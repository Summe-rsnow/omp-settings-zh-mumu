import { VERSION } from "@oh-my-pi/pi-coding-agent";
import { orderedSettings } from "@oh-my-pi/pi-coding-agent/config/all-settings";
import type { HostDerivedDefinition, HostMetadata, HostSettingDefinition } from "./compatibility";

const CANONICAL_SETTING_TABS: readonly string[] = [
  "appearance",
  "model",
  "interaction",
  "context",
  "memory",
  "files",
  "shell",
  "tools",
  "tasks",
  "providers",
];

const CANONICAL_TAB_METADATA: Record<string, { label: string; icon: string }> = {
  appearance: { label: "Appearance", icon: "tab.appearance" },
  model: { label: "Model", icon: "tab.model" },
  interaction: { label: "Interaction", icon: "tab.interaction" },
  context: { label: "Context", icon: "tab.context" },
  memory: { label: "Memory", icon: "tab.memory" },
  files: { label: "Files", icon: "tab.files" },
  shell: { label: "Shell", icon: "tab.shell" },
  tools: { label: "Tools", icon: "tab.tools" },
  tasks: { label: "Tasks", icon: "tab.tasks" },
  providers: { label: "Providers", icon: "tab.providers" },
};

const CANONICAL_TAB_GROUPS: Record<string, readonly string[]> = {
  appearance: ["Theme", "Composer", "Status Line", "Display", "Images"],
  model: ["Thinking", "Sampling", "Prompt", "Retry & Fallback", "Advisor", "Prewalk", "Vision"],
  interaction: [
    "Input",
    "Approvals",
    "Notifications",
    "Speech",
    "Collab",
    "Stream",
    "Magic Keywords",
    "Startup & Updates",
    "Power",
    "Agent",
    "Git",
    "Skills",
  ],
  context: ["General", "Compaction", "Rules (TTSR)", "Experimental"],
  memory: ["General", "Auto-Learn", "Mnemopi", "Hindsight", "Sharpshooter"],
  files: ["Editing", "Reading", "Read Summaries", "LSP"],
  shell: ["Bash", "Eval & Runtimes"],
  tools: [
    "Available Tools",
    "Todos",
    "Grep & Browser",
    "Computer",
    "IDA Pro",
    "GitHub",
    "Output Limits",
    "Execution",
    "Discovery & MCP",
    "Extensions",
    "Developer",
  ],
  tasks: ["Modes", "Subagents", "Isolation", "Commands & Skills"],
  providers: ["Services", "Fireworks", "Tiny Model", "Protocol", "Timeouts", "Privacy"],
};

function deriveDefinitionsFromSchema(
  schema: Record<string, HostSettingDefinition | undefined>,
): HostDerivedDefinition[] {
  const derived: HostDerivedDefinition[] = [];
  for (const [path, definition] of Object.entries(schema)) {
    if (!definition?.ui) continue;
    if (definition.type !== "number" && definition.type !== "array") {
      // eligible
    } else if (!Array.isArray(definition.ui.options)) {
      continue;
    }
    derived.push({
      path,
      type: definition.type,
      tab: definition.ui.tab,
      ...(definition.ui.group !== undefined ? { group: definition.ui.group } : {}),
      label: definition.ui.label,
      description: definition.ui.description,
      ...(definition.ui.warning ? { warning: definition.ui.warning } : {}),
      ...(Array.isArray(definition.ui.options) ? { options: definition.ui.options } : {}),
    });
  }
  return derived;
}

/**
 * The only boundary that knows OMP's unstable settings metadata exports.
 * Every returned collection is the host-owned live object, not a copy.
 */
export function getHostMetadata(): HostMetadata {
  const settings = orderedSettings();
  const schema: Record<string, HostSettingDefinition | undefined> = {};
  for (const s of settings) {
    schema[s.id] = s.definition as unknown as HostSettingDefinition;
  }

  return {
    version: VERSION,
    tabs: CANONICAL_SETTING_TABS,
    tabMetadata: CANONICAL_TAB_METADATA,
    tabGroups: CANONICAL_TAB_GROUPS,
    schema,
    derivedDefinitions: deriveDefinitionsFromSchema(schema),
  };
}
