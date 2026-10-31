import { createHash } from "node:crypto";
import type { HostMetadata, HostOption, HostSettingDefinition, HostUiMetadata } from "./compatibility";
import type { LocalePack } from "./translations/types";

export interface OptionMismatch {
  readonly path: string;
  readonly missingValues: readonly string[];
  readonly staleValues: readonly string[];
}

export interface MissingGroup {
  readonly tab: string;
  readonly group: string;
}

/** A `configOnly` entry that cannot be rendered safely by a host. */
export interface ConfigOnlyIssue {
  readonly path: string;
  readonly reason: string;
}

export interface CoverageReport {
  readonly totalUiSettings: number;
  readonly translatedSettings: number;
  readonly completeSettings: number;
  readonly partialSettings: number;
  readonly untranslatedPaths: readonly string[];
  readonly partialPaths: readonly string[];
  readonly stalePaths: readonly string[];
  readonly optionMismatches: readonly OptionMismatch[];
  readonly sourceHashMismatches: readonly string[];
  readonly missingTabs: readonly string[];
  readonly missingGroups: readonly MissingGroup[];
  /** Settings the core ships without UI metadata and this pack describes. */
  readonly configOnlyTotal: number;
  readonly configOnlyIssues: readonly ConfigOnlyIssue[];
}

function normalizeOptions(options: HostUiMetadata["options"]): Array<{
  value: string;
  label: string;
  description: string | null;
}> | null {
  if (!Array.isArray(options)) return null;
  return options.map((option) => ({
    value: option.value,
    label: option.label,
    description: option.description ?? null,
  }));
}

export function computeSourceHash(ui: HostUiMetadata): string {
  const normalized = {
    tab: ui.tab,
    group: ui.group,
    label: ui.label,
    description: ui.description,
    warning: ui.warning ?? null,
    options: normalizeOptions(ui.options),
  };
  return createHash("sha256").update(JSON.stringify(normalized)).digest("hex");
}

/**
 * Drift hash for a setting the core ships without UI metadata: the reviewed
 * definition fields are its type, default and enum values.
 */
export function computeDefinitionHash(definition: HostSettingDefinition): string {
  const normalized = {
    type: definition.type,
    default: definition.default ?? null,
    values: definition.values ?? null,
  };
  return createHash("sha256").update(JSON.stringify(normalized)).digest("hex");
}

function hasCompleteOptionTranslation(
  sourceOption: HostOption,
  translatedOption: { readonly label?: string; readonly description?: string } | undefined,
): boolean {
  if (!translatedOption?.label) return false;
  return sourceOption.description === undefined || Boolean(translatedOption.description);
}

export function buildCoverageReport(host: HostMetadata, locale: LocalePack): CoverageReport {
  const untranslatedPaths: string[] = [];
  const partialPaths: string[] = [];
  const optionMismatches: OptionMismatch[] = [];
  const sourceHashMismatches: string[] = [];
  const missingTabs = host.tabs.filter((tab) => locale.tabs[tab] === undefined);
  const missingGroups: MissingGroup[] = [];
  let translatedSettings = 0;
  let completeSettings = 0;
  let totalUiSettings = 0;

  for (const tab of host.tabs) {
    for (const group of host.tabGroups[tab] ?? []) {
      if (locale.groups[tab]?.[group] === undefined) missingGroups.push({ tab, group });
    }
  }

  for (const [path, definition] of Object.entries(host.schema)) {
    const ui = definition?.ui;
    if (!ui) continue;
    totalUiSettings += 1;

    const translation = locale.settings[path];
    if (!translation) {
      untranslatedPaths.push(path);
      continue;
    }
    translatedSettings += 1;

    let complete =
      Boolean(translation.label) &&
      Boolean(translation.description) &&
      locale.tabs[ui.tab] !== undefined &&
      (ui.group === undefined || locale.groups[ui.tab]?.[ui.group] !== undefined) &&
      (ui.warning === undefined ? translation.warning === undefined : Boolean(translation.warning));

    const currentHash = computeSourceHash(ui);
    if (translation.sourceHash !== currentHash) {
      sourceHashMismatches.push(path);
      complete = false;
    }

    const sourceOptions = Array.isArray(ui.options) ? ui.options : [];
    const translatedOptions = translation.options ?? {};
    const sourceValues = new Set(sourceOptions.map((option) => option.value));
    const missingValues = sourceOptions
      .filter((option) => !hasCompleteOptionTranslation(option, translatedOptions[option.value]))
      .map((option) => option.value);
    const staleValues = Object.keys(translatedOptions).filter((value) => !sourceValues.has(value));
    if (missingValues.length > 0 || staleValues.length > 0) {
      optionMismatches.push({ path, missingValues, staleValues });
      complete = false;
    }

    if (complete) completeSettings += 1;
    else partialPaths.push(path);
  }

  const stalePaths = Object.keys(locale.settings).filter((path) => !host.schema[path]?.ui);

  // `configOnly` describes schema entries without `ui`: a host renders them
  // (desktop engine-parameters tab) instead of the terminal panel, so every
  // entry must resolve to a real, still-untabbed setting inside a declared tab.
  const configOnly = locale.configOnly ?? {};
  const configOnlyIssues: ConfigOnlyIssue[] = [];
  const groupValues = new Map<string, Set<string>>();
  for (const [tab, groups] of Object.entries(locale.groups)) {
    groupValues.set(tab, new Set(Object.values(groups)));
  }
  for (const [path, entry] of Object.entries(configOnly)) {
    const definition = host.schema[path];
    if (!definition) configOnlyIssues.push({ path, reason: "设置不存在于宿主 Schema" });
    else if (definition.ui) configOnlyIssues.push({ path, reason: "宿主已提供 UI 元数据，应放入 settings" });
    else if (entry.sourceHash !== computeDefinitionHash(definition)) {
      configOnlyIssues.push({ path, reason: "上游定义已漂移（sourceHash 不匹配）" });
    }
    if (!host.tabs.includes(entry.tab)) configOnlyIssues.push({ path, reason: `未知页签 ${entry.tab}` });
    else if (!groupValues.get(entry.tab)?.has(entry.group)) {
      configOnlyIssues.push({ path, reason: `页签 ${entry.tab} 未声明分组 ${entry.group}` });
    }
    if (!entry.label.trim() || !entry.description.trim()) {
      configOnlyIssues.push({ path, reason: "缺少名称或说明" });
    }
    if (locale.settings[path]) configOnlyIssues.push({ path, reason: "与 settings 中的条目重复" });
  }

  return {
    totalUiSettings,
    translatedSettings,
    completeSettings,
    partialSettings: partialPaths.length,
    untranslatedPaths,
    partialPaths,
    stalePaths,
    optionMismatches,
    sourceHashMismatches,
    missingTabs,
    missingGroups,
    configOnlyTotal: Object.keys(configOnly).length,
    configOnlyIssues,
  };
}
