import * as i18next from 'i18next';
import isDevMode from 'electron-is-dev';
import { reactI18nextModule } from 'react-i18next';

export const requireLocale = (ietf: string) => require(`../../static/locales/${ietf}.json`);

export function createResources(ietfs: string[]) {
  return ietfs.reduce((translations, ietf) => ({
    ...translations,
    [ietf]: requireLocale(ietf),
  }), {});
}

export function createI18n(ietf: string) {
  const resources = createResources([
    'da-DK',
    'en-US'
  ]);

  return i18next
    .use(reactI18nextModule)
    .init({
      resources,
      lng: ietf,
      fallbackLng: 'en-US',
      debug: isDevMode,
      interpolation: {
        escapeValue: false,
      },
      react: {
        wait: true,
      },
    });
}
