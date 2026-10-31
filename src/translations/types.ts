export interface OptionTranslation {
  readonly label?: string;
  readonly description?: string;
}

export interface SettingTranslation {
  /** SHA-256 of the normalized upstream UI metadata reviewed for this translation. */
  readonly sourceHash: string;
  readonly label?: string;
  readonly description?: string;
  readonly warning?: string;
  readonly options?: Readonly<Record<string, OptionTranslation>>;
}

/**
 * Translation for a core setting that ships WITHOUT any `ui` block.
 *
 * The OMP settings panel only renders settings that carry UI metadata, and a
 * batch of core settings is deliberately config-file-only. Hosts that list every
 * key of `SETTINGS_SCHEMA` (the OMP desktop's engine-parameters tab) still need
 * to show them, so their wording lives here instead of being written into
 * `SETTINGS_SCHEMA` — mutating the schema would surface those settings in the
 * terminal panel as a side effect. `sourceHash` covers the reviewed definition
 * (type / default / values) so upstream drift is reported like any other entry.
 */
export interface ConfigOnlyTranslation {
  readonly sourceHash: string;
  /** Core tab id this setting is displayed under. */
  readonly tab: string;
  /** Group header inside that tab, in the target locale. */
  readonly group: string;
  readonly label: string;
  readonly description: string;
}

export interface LocalePack {
  readonly locale: "zh-CN";
  readonly sourceOmpVersion: string;
  readonly tabs: Readonly<Record<string, string>>;
  readonly groups: Readonly<Record<string, Readonly<Record<string, string>>>>;
  readonly settings: Readonly<Record<string, SettingTranslation>>;
  /** Display metadata for `SETTINGS_SCHEMA` entries that have no `ui` block. */
  readonly configOnly?: Readonly<Record<string, ConfigOnlyTranslation>>;
}
