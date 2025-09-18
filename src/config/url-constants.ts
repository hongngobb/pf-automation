import { BASE_URL } from './framework-constants';

// URL Constants
export const PF_BASE_URL = BASE_URL;
export const PF_PAGES_URL = `${BASE_URL}/pages`;
export const PF_SECTIONS_URL = `${BASE_URL}/sections`;
export const PF_TRASH_URL = `${BASE_URL}/trash`;
export const PF_THEMES_URL = `${BASE_URL}/themes`;
export const PF_SETTINGS_URL = `${BASE_URL}/settings`;

// Legacy class for backward compatibility
export class UrlConstants {
  static readonly PF_BASE_URL = PF_BASE_URL;
  static readonly PF_PAGES_URL = PF_PAGES_URL;
  static readonly PF_SECTIONS_URL = PF_SECTIONS_URL;
  static readonly PF_TRASH_URL = PF_TRASH_URL;
  static readonly PF_THEMES_URL = PF_THEMES_URL;
  static readonly PF_SETTINGS_URL = PF_SETTINGS_URL;
}
