import { useState, useEffect } from "react";
import {
  translations,
  Language,
  TranslationKey,
} from "@/constants/translations";

export function useTranslations() {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: TranslationKey): string => {
    return translations[language][key];
  };

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    // You can add AsyncStorage here to persist language preference
  };

  return {
    t,
    language,
    changeLanguage,
  };
}
