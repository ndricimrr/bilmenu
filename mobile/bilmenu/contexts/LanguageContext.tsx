import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import { Language } from "@/constants/translations";

interface LanguageContextType {
  language: Language;
  changeLanguage: (newLanguage: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>("en");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved language on app start
  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem("bilmenu-language");
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "tr")) {
        setLanguage(savedLanguage as Language);
      }
    } catch (error) {
      console.error("Error loading language:", error);
      // Continue with default language even if there's an error
    } finally {
      setIsLoaded(true);
      // Ensure splash screen is hidden after language loads
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        // Ignore splash screen errors
      }
    }
  };

  const changeLanguage = async (newLanguage: Language) => {
    try {
      await AsyncStorage.setItem("bilmenu-language", newLanguage);
      setLanguage(newLanguage);
    } catch (error) {
      console.log("Error saving language:", error);
    }
  };

  // Don't render until language is loaded
  if (!isLoaded) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
