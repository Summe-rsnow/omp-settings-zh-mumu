# Changelog

本项目遵循 [Semantic Versioning](https://semver.org/)。

## [0.4.0] - 2026-11-10

- 适配 OMP 18.18.6 设置体系（从 18.16.0 升级至 18.18.6）：
  - 翻译全量覆盖：覆盖率由 438 项扩增至 450 项完整 UI 设置（450/450，100% P0 覆盖），0 部分，0 未翻译，123 项无 UI 配置 0 异常，上游 Schema 漂移完全归零。
  - 新增 12 项设置项汉化：
    - 外观与展示：彩色 Markdown (`tui.colorfulMarkdown`)、Spinner 间隔 (`tui.spinnerInterval`)、最大帧率 (`tui.maxFps`)、动效总开关 (`tui.motion`)、Shell 可视化 (`display.shellVisualization`)
    - 交互与更新：自动更新 (`update.auto`)、Chillax 关键词 (`magicKeywords.chillax`)
    - 提供商：OpenAI Responses WebSockets (`providers.openaiResponsesWebsockets`)
    - 任务与隔离：ovnfs 可执行文件 (`ovnfs.path`)、子代理工作线程 (`task.workerThreads`)
    - 工具与扩展：扩展对话记录呈现器 (`extensionRenderers.transcriptPresenters`)、Spotlight 实验 (`spotlight.experiment.enabled`)
  - 同步 11 项已有设置文案漂移：
    - `tui.mouse`：对齐鼠标捕获阻止滚轮滚动、改用终端键盘回滚键的说明
    - `display.shimmer`：补充「精简或关闭动效时停用」
    - `display.smoothStreaming`：补充 Tern 自行逐字输出助手文本
    - `textVerbosity`：默认标记由 medium 更正为 low
    - `magicKeywords.enabled`：关键词列表补充 chillax
    - `providers.openaiWebsockets`：标题改为 OpenAI Codex WebSockets，说明收敛为「仅针对 OpenAI Codex 模型」
    - `mnemopi.dbPath`：补充开头 `~` 表示主目录
    - `edit.mode`：补充 `none` 移除编辑工具并保留 bash
    - `lsp.enabled`：对齐为语言服务器集成（lsp 工具、写入/编辑诊断、写入格式化）
    - `isolation.backend`：收敛为「子代理隔离与 worktree 克隆后端」，auto 选项补充 ovnfs 检出语义
    - `task.eager`：补充子代理保留模型自身策略
  - 版本号与测试维护：正式升级版本号至 0.4.0，测试版本断言与设置总数（450）对齐 OMP 18.18.6，全部测试与自动化校验套件 100% 通过
- 开发依赖：`@oh-my-pi/pi-coding-agent` devDependency 升级至 `18.18.6`

## [0.3.0] - 2026-11-03

- 适配 OMP 18.16.0 设置体系（从 18.14.1 升级至 18.16.0）：
  - 翻译全量覆盖：覆盖率由 433 项扩增至 438 项完整 UI 设置（438/438，100% P0 覆盖），0 部分，0 未翻译，123 项无 UI 配置 0 异常，上游 Schema 漂移完全归零。
  - 新增 5 项设置项汉化：
    - 输入与会话：`/btw` 引导注入 (`btw.inject`)、预测候选项 (`composer.predictionAlternatives`)
    - 记忆：Hindsight 全局作用域 (`hindsight.globalScope`)
    - 任务与子代理：单次调用模型 (`task.perCallModel`)、单次调用模型允许列表 (`task.perCallModelAllow`)
  - 同步 3 项已有设置文案漂移：
    - `tier.openai`：`ultrafast` 选项补充 Codex 与中转（relay）模型
    - `async.widgets`：补充后台任务输出推导、长 shell 命令一行用途说明，以及每个任务一份配置至多一条说明的细节
    - `task.maxEffort`：对齐单次调用模型、显式 `:level` 钳制、继承与冷启动恢复语义
  - 版本号与测试维护：正式升级版本号至 0.3.0，测试版本断言与 OMP 18.16.0 对齐，全部测试与自动化校验套件 100% 通过
- 开发依赖：`@oh-my-pi/pi-coding-agent` devDependency 升级至 `18.16.0`
- 工具链：`tsconfig.json` 增加 `lib: ["ES2024", "DOM"]` 与 `types: ["node", "bun"]`，与同系列插件保持一致

## [0.2.0] - 2026-10-31

- 适配 OMP 18.14.1 最新设置体系（从 18.8.7 跨越升级至 18.14.1）：
  - 翻译全量覆盖：覆盖率由 410 项扩增至 433 项完整 UI 设置（433/433，100% P0 覆盖），0 部分，0 未翻译，123 项无 UI 配置 0 异常，上游 Schema 漂移完全归零。
  - 新增 25 项全新设置项汉化：
    - 界面与展示：完整回滚缓冲 (`tui.completeScrollback`)、Advisor 折叠行数 (`display.advisorCollapsedLines`)
    - 输入与会话：输入框文本预测 (`composer.predictions`)、恢复会话工作区范围 (`session.worktreeScope`)
    - Prewalk 深度规划：Prewalk 规划模型 (`prewalk.from`)、目标模型 (`prewalk.into`)、自动 Prewalk 裁判判定 (`prewalk.auto`)、自动目标模型 (`prewalk.autoTarget`)
    - 重试与提供商：回退触发条件 (`retry.fallbackOn`)、速率限制链路推进 (`retry.rateLimitWalksChain`)、Codex Daybreak Blue 网络访问方案 (`providers.openai-codex.daybreak`)
    - 模型与审查：Advisor 续行严重度阈值 (`advisor.continueSeverity`)
    - 上下文与安全：额外上下文文件 (`contextFiles.extra`)、受限目录强制审批 (`tools.restrictedFolders`)
    - 工具与执行：Computer 后台回退策略 (`computer.backgroundFallback`)、即时输出通道 (`out.enabled`)、任务结果唤醒打印模式 (`async.printWake`)、后台任务实时小组件 (`async.widgets`)、xd:// 挂载提示 (`tools.xdevNotices`)、LSP 请求超时 (`lsp.requestTimeout`)
    - 任务与子代理：从文件读取任务指令 (`task.file`)、结构化任务结果与模式 (`task.structured`)、提示词间隔刷新会话标题 (`title.refreshAfterPrompts`)
    - 扩展机制：扩展模式控制 (`extensionHandlers.modeControl`)、扩展答复渲染器 (`extensionRenderers.assistantText`)
  - 同步 19 项已有设置文案与选项漂移：
    - `autoResume`（增加模型无法恢复警告说明）、`tui.autoGraph`（新增 `auto` 选项）、`tui.mouse`（补充悬停高亮与扩展链接选择）、`tui.vimModeDisplay`（新增 `REPLACE` 模式）、`ask.timeout`（补充 cfg:// 审批限制说明）、`power.sleepPrevention`（精校 macOS caffeinate 各级别说明）、`retry.modelFallback`（对齐说明）、`providers.cacheRetention`（支持 OpenAI GPT-5.6+ 12h 提示词缓存与选项刷新）、`codexResets.autoRedeem` 与 `claudeResets.autoRedeem`（额度兑换规则对齐）、`contextPromotion.enabled`（对齐目标模型说明）、`compaction.methodOrder`（对齐服务器端压缩与各方法描述）、`compaction.idleTimeoutSeconds`（补充 1 小时提示词缓存过期机制）、`snapcompact.toolResults`（更新大体量结果位图渲染说明）、`tools.approvalMode`（新增 `always-ask-cached` 选项）、`lsp.shared`（更新项目级 broker 机制）、`bash.gitGuard`（更新关联 worktree 机制）、`task.isolation.enabled`（对齐说明）、`task.softRequestBudget`（对齐软预算与强制停止阈值）
  - 清理 2 项上游已删除废弃设置：`providers.openai-codex.codeMode`、`providers.openai-codex.codeModeDirectTools`
  - 同步 1 项无 UI 配置 (`bashInterceptor.patterns`) 的最新上游正则模式扩展与哈希值
  - 全量文风与排版统一：严格按照 TRANSLATION-GUIDE 规范，保持短动宾/短名词结构、句末不带句号、专有名词与技术标识保留英文（如 Token、Worktree、Prewalk、Advisor、LSP、xd:// 等），消除机器翻译生硬感与术语分歧
  - 版本号与测试维护：正式升级版本号至 0.2.0，更新 package.json 与测试断言，全部测试与自动化校验套件 100% 通过

## [0.1.0] - 2026-09-18

- 适配 OMP 18.8.7 设置体系：
  - 翻译全量覆盖：覆盖率由 406 项扩增至 410 项完整 UI 设置（410/410，100% P0 覆盖），0 部分，0 未翻译，123 项无 UI 配置 0 异常
  - 新增 4 项设置：程序状态上报 (`terminal.programStatus`，OSC 7501 状态同步)、本地 TTS 语速 (`tts.localSpeed`)、朗读发音语速 (`speech.speed`)、Git 保护守卫 (`bash.gitGuard`，拦截危险丢弃工作命令)
  - 同步 2 项已有设置文案变更：`tools.xdev`（虚拟设备纯写入挂载通道说明）、`title.icons`（补充 `/rename` 会话重命名文案）
- 适配 OMP 18.8.6 设置体系：
  - 动态 Getter 安全支持：重构 `apply-translations`，支持对包含动态 getter 描述的 7 项宿主设置进行安全覆盖与无损原子回滚
  - 翻译全量覆盖：覆盖率由 378 项扩增至 406 项完整 UI 设置（406/406，100% P0 覆盖），0 部分，0 未翻译，123 项无 UI 配置 0 异常
  - 新增 29 项设置：SVG 图表渲染 (`tui.renderSvg`)、自动表格图表化 (`tui.autoGraph`)、子代理实时预览 (`display.subagentLivePreview`)、空会话直接退出 (`input.bareExitOnEmptySession`)、无斜杠命令执行 (`input.bareSlashCommands`)、展开思考内容块 (`expandThinkingBlocks`)、OpenAI 实时引导 (`providers.openaiLiveSteering`)、Muse Code 存储响应 (`providers.muse-code.storeResponses`)、缓存预热 (`providers.cacheWarming`)、OTLP 遥测导出 (`telemetry.otlpExportEnabled`)、Advisor 审查模式/间隔/过期清理 (`advisor.reviewMode`/`advisor.reviewInterval`/`advisor.evictStaleResults`)、工件文件大小上限 (`tools.artifactMaxBytes`)、Ratchet 评估工具 (`ratchet.enabled`)、会话归档 (`archive.enabled`)、Worktree 启动与退出策略 (`worktree.onStart`/`worktree.onExit`)、推测性任务启动 (`task.speculativeLaunch`)、子代理完成度探测 (`task.completionProbe`)、标题图标/生成器 (`title.icons`/`title.generator`)、Tern 浏览器画中画 (`browser.tern`)、IDA Pro 系列设置 (`ida.enabled`/`ida.python`/`ida.installDir`/`ida.maxOpen`/`ida.idleCloseSec`)、MCP 启动等待窗口 (`mcp.startupTimeoutMs`)
  - 同步 27 项已有设置文案与选项漂移（单词自动补全扩展至 4 种算法选项、OpenAI/Subagent/Advisor 服务层级新增 `ultrafast` 超高速选项等）
  - 移除已废弃的 `irc.timeoutMs`，同步更新 `bashInterceptor.patterns` 拦截器定义哈希
  - 新增 `tools` 页签的 `IDA Pro` 分组汉化映射
- `omp.displayMetadata` 清单字段与 `src/desktop-display.ts` 数据模块（只导出数据、不导入宿主包），供宿主安全读取 `configOnly` 文案：为官方 Schema 中 123 项没有 `ui` 元数据的设置提供中文名称、说明、页签与分组，供列出全部 Schema 键的宿主（OMP 桌面端）使用；不写入 `SETTINGS_SCHEMA`，官方 `/settings` 面板显示的设置集合不变
- `configOnly` 漂移校验：按 `type` / `default` / `values` 计算 `sourceHash`，并检查页签、分组、名称说明与重复条目
- OMP Extension 入口，通过 `package.json#omp.extensions` 加载
- OMP 18.2.11 `/settings` 页签、分组、设置、警告和静态选项的简体中文显示元数据（378 项设置完整覆盖）
- 基于官方英文原文独立生成的克制译文，保留产品名、工具名、协议和技术缩写
- 宿主结构与主版本兼容预检
- 原子 Mutation Plan、写入后验证、完整回滚和共享元数据冲突检测
- 英文回退、重复应用幂等性和一次性兼容警告
- 翻译覆盖率、选项值漂移和英文原文哈希检查
- OMP 18.2.11 契约测试、初始化冒烟检查和真实 TUI 验证流程
- 迁移至 OMP 18.2.11：新增 `magicKeywords.jevify`、`skills.registryUrl`、`ttsr.judge`、`eval.autoProvision`、`find.enabled` 与 `claudeResets.*`（4 项）共 9 项设置译文；移除上游已废弃的 `stt.modelName`、`providers.webSearch*`、`providers.imageOrder`、`providers.tts`、`tts.localModel` 及已归并至模型角色的 `providers.judgmentProvider`、`providers.tinyModel`、`providers.memoryModel`、`providers.autoThinkingModel`、`providers.unexpectedStopModel` 共 12 项；同步 `symbolPreset`、`providers.anthropic.serverSideFallback`、`magicKeywords.enabled` 的文案变更；新增 `interaction` 页签的 `Skills` 分组
- 全量翻译精校与术语规范化（对齐 Agent、子代理、轮次、行内等统一术语，消除内联/智能体不一致与笔误）
- 对 Prewalk、推测执行、基于笔记的上下文持久化、xd:// 设备工具、TTSR、Worktree CoW 克隆、Sharpshooter 等难懂技术设置项补充清晰易懂的机制与行为原理解释
