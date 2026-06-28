import { useEffect, useState } from 'react';
import { createTranslator, getActiveLanguage } from '../../../i18n/index.js';

const STORAGE_KEY = 'safeai.language';
const LANGUAGE_CHANGE_EVENT = 'safeai:language-change';

/**
 * Dashboard-bound translation factory for sovereign administrative surfaces.
 */
export function useAdminTranslator(languageProp) {
  const [language, setLanguage] = useState(() => languageProp ?? getActiveLanguage());

  useEffect(() => {
    if (languageProp) {
      setLanguage(languageProp);
      return undefined;
    }

    const refresh = () => setLanguage(getActiveLanguage());
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY) refresh();
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener(LANGUAGE_CHANGE_EVENT, refresh);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(LANGUAGE_CHANGE_EVENT, refresh);
    };
  }, [languageProp]);

  return createTranslator(language);
}
