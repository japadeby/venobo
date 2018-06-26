import * as i18next from 'i18next';
import isDevMode from 'electron-is-dev';
import { reactI18nextModule } from 'react-i18next';

export function createI18n(ietf: string) {
  return i18next
    .use(reactI18nextModule)
    .init({
      ns: ['translations'],
      defaultNS: 'translations',
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
