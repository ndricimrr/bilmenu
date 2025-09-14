import { useLanguage } from "@/contexts/LanguageContext";
import { TranslationKey } from "@/constants/translations";
import { translations } from "@/constants/translations";

export function useTranslations() {
  const { language, changeLanguage } = useLanguage();

  const t = (
    key: TranslationKey,
    params?: Record<string, string | number>
  ): string => {
    let translation = translations[language][key];

    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(`{${paramKey}}`, String(value));
      });
    }

    return translation;
  };

  return {
    t,
    language,
    changeLanguage,
  };
}
