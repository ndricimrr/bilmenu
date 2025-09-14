import { useLanguage } from "@/contexts/LanguageContext";
import { TranslationKey } from "@/constants/translations";
import { translations } from "@/constants/translations";

export function useTranslations() {
  const { language, changeLanguage } = useLanguage();

  const t = (key: TranslationKey): string => {
    return translations[language][key];
  };

  return {
    t,
    language,
    changeLanguage,
  };
}
