import { zhCN } from "./translations/zh-CN";

/**
 * Display metadata for core settings that ship without any `ui` block.
 *
 * The terminal settings panel only renders schema entries carrying UI metadata,
 * so a batch of core settings is config-file-only there. Hosts that list every
 * `SETTINGS_SCHEMA` key (the OMP desktop's engine-parameters tab) still show
 * them, and this export is the single source of their wording: it is published
 * as data instead of being written into `SETTINGS_SCHEMA`, because mutating the
 * schema would also surface those settings — including credential-shaped ones —
 * in the terminal panel.
 *
 * Consumers read `SETTINGS_DISPLAY_METADATA` from the extension entry module and
 * apply it only to entries that have no `ui` of their own; a key absent here
 * keeps the host's original wording.
 */
export interface SettingsDisplayEntry {
  /** Core tab id the setting is displayed under. */
  readonly tab: string;
  /** Group header inside that tab, in the pack's locale. */
  readonly group: string;
  readonly label: string;
  readonly description: string;
}

export const SETTINGS_DISPLAY_METADATA: Readonly<Record<string, SettingsDisplayEntry>> = Object.freeze(
  Object.fromEntries(
    Object.entries(zhCN.configOnly ?? {}).map(([path, entry]) => [
      path,
      { tab: entry.tab, group: entry.group, label: entry.label, description: entry.description },
    ]),
  ),
);
