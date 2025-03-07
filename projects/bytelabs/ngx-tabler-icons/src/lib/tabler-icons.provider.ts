import { TABLER_ICON_CONFIG, TablerIconsSettingsService } from "./tabler-icons-settings.service";
import { TablerIconsConfig, defaultConfig } from "./tabler-icons.config";

export function provideTablerIcons(configure: (config: TablerIconsConfig) => void = (cfg) => { }) {

  const config = { ...defaultConfig };

  configure(config);

  return [
    TablerIconsSettingsService,
    {
      provide: TABLER_ICON_CONFIG,
      useValue: config,
    },
  ];
}