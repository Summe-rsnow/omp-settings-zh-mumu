import { describe, expect, test } from "bun:test";
import { getHostMetadata } from "../src/host-adapter";
import { buildCoverageReport } from "../src/report";
import { SETTINGS_DISPLAY_METADATA } from "../src/desktop-display";
import { zhCN } from "../src/translations/zh-CN";
import type { LocalePack } from "../src/translations/types";
import { createFakeHost } from "./fixtures/fake-host";
import { minimalLocale } from "./fixtures/minimal-locale";

describe("coverage and drift reporting", () => {
  test("the OMP 18.16.0 locale has complete P0 coverage", () => {
    const report = buildCoverageReport(getHostMetadata(), zhCN);

    expect(report.totalUiSettings).toBe(438);
    expect(report.translatedSettings).toBe(report.totalUiSettings);
    expect(report.completeSettings).toBe(report.totalUiSettings);
    expect(report.partialSettings).toBe(0);
    expect(report.untranslatedPaths).toEqual([]);
    expect(report.stalePaths).toEqual([]);
    expect(report.optionMismatches).toEqual([]);
    expect(report.sourceHashMismatches).toEqual([]);
    expect(report.missingTabs).toEqual([]);
    expect(report.missingGroups).toEqual([]);
  });

  test("keeps product and technical names restrained instead of forcing full Chinese", () => {
    expect(zhCN.settings["advisor.enabled"]?.label).toContain("Advisor");
    expect(zhCN.settings["prewalk.enabled"]?.label).toContain("Prewalk");
    expect(zhCN.settings["compaction.methodOrder"]?.options?.snapcompact?.label).toBe("Snapcompact");
    expect(zhCN.settings["compaction.methodOrder"]?.options?.shake?.label).toBe("Shake");
    expect(zhCN.settings["update.channel"]?.options?.canary?.label).toBe("Canary");
  });

  test("reports upstream additions as English fallback", () => {
    const report = buildCoverageReport(createFakeHost(), minimalLocale);

    expect(report.totalUiSettings).toBe(3);
    expect(report.translatedSettings).toBe(2);
    expect(report.completeSettings).toBe(2);
    expect(report.untranslatedPaths).toEqual(["unlistedSetting"]);
  });

  test("reports stale paths, changed source text, and option value drift", () => {
    const host = createFakeHost();
    const locale = structuredClone(minimalLocale);
    const mutableSettings = locale.settings as unknown as Record<
      string,
      {
        sourceHash: string;
        label?: string;
        description?: string;
        options?: Record<string, { label?: string; description?: string }>;
      }
    >;
    Object.assign(mutableSettings, {
      removedSetting: { sourceHash: "stale", label: "已删除", description: "已删除" },
    });
    mutableSettings.autoResume!.sourceHash = "outdated";
    delete mutableSettings["power.sleepPrevention"]!.options!.system;
    Object.assign(mutableSettings["power.sleepPrevention"]!.options!, {
      renamed: { label: "猜测值" },
    });

    const report = buildCoverageReport(host, locale);

    expect(report.stalePaths).toEqual(["removedSetting"]);
    expect(report.sourceHashMismatches).toEqual(["autoResume"]);
    expect(report.optionMismatches).toEqual([
      {
        path: "power.sleepPrevention",
        missingValues: ["system"],
        staleValues: ["renamed"],
      },
    ]);
    expect(report.partialPaths).toEqual(["autoResume", "power.sleepPrevention"]);
  });
});

describe("config-only settings (no upstream UI metadata)", () => {
  test("describes the core settings the terminal panel never renders", () => {
    const host = getHostMetadata();
    const configOnlyPaths = Object.keys(zhCN.configOnly ?? {});
    const uiLessPaths = new Set(
      Object.entries(host.schema)
        .filter(([, definition]) => !definition?.ui)
        .map(([path]) => path),
    );

    expect(configOnlyPaths.length).toBe(123);
    expect(configOnlyPaths.filter((path) => !uiLessPaths.has(path))).toEqual([]);
    expect(configOnlyPaths).not.toContain("setupVersion");
    expect(buildCoverageReport(host, zhCN).configOnlyIssues).toEqual([]);
  });

  test("publishes the display metadata a schema-listing host consumes", () => {
    expect(Object.keys(SETTINGS_DISPLAY_METADATA).sort()).toEqual(
      Object.keys(zhCN.configOnly ?? {}).sort(),
    );
    expect(SETTINGS_DISPLAY_METADATA["memories.stage1Concurrency"]).toEqual({
      tab: "memory",
      group: "常规",
      label: "记忆一阶段并发",
      description: "阶段一记忆提取同时处理的会话 rollout 数量上限",
    });
    expect(SETTINGS_DISPLAY_METADATA["setupVersion"]).toBeUndefined();
  });

  test("reports drift, unknown tabs and duplicate entries", () => {
    const host = getHostMetadata();
    const locale: LocalePack = {
      ...zhCN,
      configOnly: {
        ...zhCN.configOnly,
        "memories.stage1Concurrency": {
          ...zhCN.configOnly!["memories.stage1Concurrency"]!,
          sourceHash: "outdated",
          tab: "nowhere",
        },
        autoResume: {
          sourceHash: "any",
          tab: "memory",
          group: "常规",
          label: "重复",
          description: "已在 settings 中翻译",
        },
      },
    };

    const issues = buildCoverageReport(host, locale).configOnlyIssues;

    expect(issues).toContainEqual({ path: "memories.stage1Concurrency", reason: "上游定义已漂移（sourceHash 不匹配）" });
    expect(issues).toContainEqual({ path: "memories.stage1Concurrency", reason: "未知页签 nowhere" });
    expect(issues).toContainEqual({ path: "autoResume", reason: "宿主已提供 UI 元数据，应放入 settings" });
    expect(issues).toContainEqual({ path: "autoResume", reason: "与 settings 中的条目重复" });
  });
});
