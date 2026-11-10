# omp-settings-zh-mumu

让官方 [Oh My Pi（OMP）](https://github.com/can1357/oh-my-pi) 的原生 `/settings` 面板显示简体中文。无需中文分支，不替换官方二进制，不改变设置行为。

- 当前版本：`0.4.0`
- 宿主兼容：Oh My Pi `>=18.0.4 <19`（当前验证 `18.18.6`）
- 运行时：Bun `>=1.3.0`，离线运行，零网络请求与遥测
- 默认状态：启用后自动汉化设置显示元数据；设置路径、类型、默认值、当前值与保存逻辑均由官方负责
- 开源许可：MIT

## 核心特性

| 特性 | 说明 |
| --- | --- |
| **全量汉化** | 450 项带 `ui` 元数据的官方设置全部译为简体中文（450/450，P0 覆盖 100%），另有 123 项无 UI 设置的 `configOnly` 文案。 |
| **零侵入显示层** | 只在 Extension 初始化阶段覆盖页签、分组、设置名称、说明、风险警告和静态选项文案；`/settings` 命令、`SettingsSelectorComponent`、设置集合与条件显示仍由官方 OMP 实现。 |
| **克制翻译** | 普通界面词、行为说明和风险信息使用中文；Advisor、Prewalk、Mnemopi、Snapcompact、MCP、LSP、API、URL、工具名、模型名和提供商名等保留更清楚的英文形式。 |
| **本机无 UI 设置补齐** | 官方 Schema 中只有类型和默认值的设置（凭据代理、记忆管线参数、`gc.*` 等）不进 `/settings`，但列出全部 Schema 键的宿主仍会渲染；插件通过 `omp.displayMetadata` 导出 `configOnly` 数据。 |
| **失败关闭** | 关键内部接口不兼容或应用失败时，保留完整官方英文界面，并显示一次兼容性警告。 |
| **原子应用与回滚** | 写入显示元数据失败时逐项恢复原值，不留下半汉化状态。 |
| **离线零请求** | 不调用 LLM、不发起网络请求、不上报任何配置或使用数据。 |

## 工作原理

插件只做一件事：在 Extension 初始化时，按稳定标识把官方设置显示元数据替换为中文。

```text
Extension 初始化
        │
        ▼
orderedSettings() ──► 读取宿主 Schema 与 UI 元数据
        │
        ▼
applyTranslations(host, zhCN)
        │
        ├─ 路径 / 选项 / 原文哈希全部匹配 ──► 逐项覆盖显示元数据 ──► hookSettingsUI()
        │                                                    │
        │                                                    └─ /settings 显示中文
        │
        └─ 任一校验或写入失败 ──► 回滚已写入项 ──► 保留官方英文 + 一次兼容性警告
```

翻译必须绑定稳定标识：页签 ID、`tab id + upstream group`、完整 setting path，以及 `setting path + option value`。禁止按英文字符串全局替换。英文原文哈希来自宿主 Schema 的 `label`、`description`、`warning`、`options` 与页签分组，上游文案变动会在校验阶段被识别。

#### 无 UI 元数据的设置

官方 Schema 中有一批设置只有类型和默认值、没有任何 `ui` 元数据，官方 `/settings` 面板按设计不显示它们。列出全部 Schema 键的宿主（如 OMP 桌面端的「引擎参数配置」页）仍会渲染这些设置，因此插件额外维护 `configOnly` 数据段，并通过扩展入口导出：

```json
// package.json
"omp": { "displayMetadata": "./src/desktop-display.ts" }
```

该文件只导出数据、不导入宿主包：

```ts
import { SETTINGS_DISPLAY_METADATA } from "./src/desktop-display";

SETTINGS_DISPLAY_METADATA["memories.stage1Concurrency"];
// { tab: "memory", group: "常规", label: "记忆一阶段并发", description: "…" }
```

宿主只应把它应用到**自身没有 `ui`** 的条目上；表中缺失的键保留宿主原文。这段数据不会写入 `SETTINGS_SCHEMA`，官方 `/settings` 面板显示哪些设置因此完全不变。

插件不会：

- 汉化 OMP 其他 TUI、CLI 帮助、提示词或错误消息；
- 注册或覆盖 `/settings`；
- 把 `configOnly` 写入官方 Schema，或改变 `/settings` 显示的设置集合；
- 读取当前配置值或凭据；
- 写入 `config.yml`；
- 在线翻译、调用 LLM 或发送遥测；
- 打包或修改 OMP 二进制。

## 安装

要求官方 OMP `>=18.0.4 <19`：

```sh
omp plugin install github:Summe-rsnow/omp-settings-zh-mumu
```

插件通过 `package.json` 中的 `omp.extensions` 字段加载 `./src/index.ts`，无需预先编译。安装后完全退出并重新启动 OMP，然后照常输入：

```text
/settings
```

插件正常应用时保持安静。关键内部接口不兼容或应用失败时，插件会失败关闭：保留完整官方英文界面，并显示一次兼容性警告。

## 配置与使用

插件没有独立配置文件，行为由 OMP 的设置体系与 `package.json` 清单决定：

| 项 | 位置 | 说明 |
| --- | --- | --- |
| 翻译入口 | `omp.extensions` → `./src/index.ts` | 启动时应用简体中文设置显示元数据。 |
| 无 UI 设置文案 | `omp.displayMetadata` → `./src/desktop-display.ts` | 供列出全部 Schema 键的宿主读取 `configOnly` 文案；不导入宿主包。 |
| 宿主版本约束 | `peerDependencies` | `@oh-my-pi/pi-coding-agent` 支持 `>=18.0.4 <19`，超出范围时兼容预检失败并保留英文。 |
| 语言范围 | 固定 `zh-CN` | 只汉化设置显示层，不影响模型输出语言或会话内容。 |

管理命令：

```sh
# 查看插件
omp plugin list --json

# 诊断
omp plugin doctor omp-settings-zh-mumu --json

# 禁用、重新启用
omp plugin disable omp-settings-zh-mumu
omp plugin enable omp-settings-zh-mumu

# 卸载
omp plugin uninstall omp-settings-zh-mumu
```

禁用或卸载后，下一次启动恢复官方英文设置；用户配置无需迁移。

## 开发

```sh
# 安装依赖（首次）
bun install

# 运行单元测试
bun test

# 类型检查 + 测试 + 覆盖率 + 漂移 + 冒烟
bun run check
```

```sh
# 单独执行各检查
bun run typecheck     # TypeScript 类型检查
bun run coverage:check # P0 翻译完整性
bun run drift:check   # 路径、选项值和英文原文哈希漂移
bun run smoke         # 真实宿主元数据初始化、行为元数据不变和零网络请求
```

影响设置面板的改动还必须在真实 OMP 中打开 `/settings`，验证中文搜索、设置编辑、禁用后的英文回退。自动检查不能代替真实 TUI 验证。

目录结构：

```text
src/
├── index.ts             # Extension 入口，失败关闭与警告
├── host-adapter.ts      # 唯一读取 OMP 内部设置元数据的边界
├── apply-translations.ts# 显示元数据覆盖、校验、原子回滚
├── compatibility.ts     # 宿主契约预检
├── report.ts            # 覆盖率与漂移计算、原文哈希
├── desktop-display.ts   # configOnly 显示元数据（只导出数据）
├── ui-hook.ts           # /settings 面板 UI 钩子
└── translations/
    ├── types.ts         # LocalePack 类型
    └── zh-CN.ts         # 简体中文词典
test/
├── host-adapter.test.ts
├── host-contract.test.ts
├── compatibility.test.ts
├── apply-translations.test.ts
├── coverage.test.ts
├── shared-metadata.test.ts
└── fixtures/
scripts/
├── check-coverage.ts
├── diff-upstream.ts
└── smoke-extension.ts
docs/
├── PRD.md
├── TECHNICAL-DESIGN.md
├── TRANSLATION-GUIDE.md
└── OPEN-SOURCE-RELEASE.md
```

翻译规范与贡献流程：

- [项目上下文](CONTEXT.md)
- [产品需求](docs/PRD.md)
- [技术设计](docs/TECHNICAL-DESIGN.md)
- [翻译规范](docs/TRANSLATION-GUIDE.md)
- [贡献指南](CONTRIBUTING.md)
- [第三方声明](THIRD_PARTY_NOTICES.md)

## 许可证与致谢

本项目以 **MIT** 许可分发，详见 [LICENSE](LICENSE)。

本项目不是 Oh My Pi 官方项目。OMP 名称、源码和产品归其原作者及贡献者所有。本项目仅提供独立的简体中文设置显示元数据扩展，第三方组件与许可信息见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
