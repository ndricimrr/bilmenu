// Language Switcher functionality for BilMenu
class LanguageSwitcher {
  constructor() {
    this.currentLanguage = this.getStoredLanguage() || "en";
    this.translations = window.translations;

    this.init();
  }

  init() {
    // Set initial language
    this.setLanguage(this.currentLanguage);

    // Create language switcher UI
    this.createLanguageSwitcher();

    // Bind events
    this.bindEvents();
  }

  getStoredLanguage() {
    return localStorage.getItem("bilmenu-language");
  }

  setStoredLanguage(lang) {
    localStorage.setItem("bilmenu-language", lang);
  }

  setLanguage(lang) {
    if (!this.translations[lang]) {
      console.warn(`Language ${lang} not found, falling back to English`);
      lang = "en";
    }

    this.currentLanguage = lang;
    this.setStoredLanguage(lang);

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Translate all elements with data-translate attribute
    this.translateElements();

    // Update language switcher UI
    this.updateSwitcherUI();

    // Update week indicator if it exists
    this.updateWeekIndicator();

    // Dispatch custom event for language change
    const event = new CustomEvent("languageChanged", {
      detail: { language: lang },
    });
    document.dispatchEvent(event);
  }

  translateElements() {
    const elements = document.querySelectorAll("[data-translate]");

    elements.forEach((element) => {
      const key = element.getAttribute("data-translate");
      const translation = this.translations[this.currentLanguage][key];

      if (translation) {
        // Handle different element types
        if (element.tagName === "INPUT" && element.type === "submit") {
          element.value = translation;
        } else if (element.hasAttribute("placeholder")) {
          element.placeholder = translation;
        } else if (element.hasAttribute("title")) {
          element.title = translation;
        } else {
          element.textContent = translation;
        }
      } else {
        console.warn(`Translation missing for key: ${key}`);
      }
    });
  }

  createLanguageSwitcher() {
    // Check if switcher already exists
    if (document.querySelector(".language-switcher")) {
      return;
    }

    // Find the navigation container
    const navContainer = document.querySelector(".nav-container");
    if (!navContainer) {
      console.warn("Navigation container not found");
      return;
    }

    // Create language switcher element
    const switcher = document.createElement("div");
    switcher.className = "language-switcher";
    switcher.innerHTML = `
      <button class="lang-btn" data-lang="en">EN</button>
      <button class="lang-btn" data-lang="tr">TR</button>
    `;

    // Insert before the main navigation
    const mainNav = navContainer.querySelector(".main-nav");
    if (mainNav) {
      navContainer.insertBefore(switcher, mainNav);
    } else {
      navContainer.appendChild(switcher);
    }

    // Update UI
    this.updateSwitcherUI();
  }

  updateSwitcherUI() {
    const switcher = document.querySelector(".language-switcher");
    if (!switcher) return;

    const buttons = switcher.querySelectorAll(".lang-btn");
    buttons.forEach((btn) => {
      const lang = btn.getAttribute("data-lang");
      if (lang === this.currentLanguage) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  bindEvents() {
    // Bind language switcher button events
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("lang-btn")) {
        e.preventDefault();
        const lang = e.target.getAttribute("data-lang");
        this.setLanguage(lang);
      }
    });
  }

  // Public method to get current language
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // Public method to translate a specific key
  translate(key) {
    return this.translations[this.currentLanguage][key] || key;
  }

  // Update week indicator with translated text
  updateWeekIndicator() {
    if (typeof updateWeekIndicator === "function") {
      updateWeekIndicator();
    }
  }
}

// Initialize language switcher when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.languageSwitcher = new LanguageSwitcher();
});

// Export for use in other scripts
window.LanguageSwitcher = LanguageSwitcher;
