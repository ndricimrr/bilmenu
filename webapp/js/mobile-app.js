// Mobile App Integration Script
// This script handles mobile app parameters and adjusts the webapp accordingly

(function () {
  "use strict";

  // Check if we're being accessed from the mobile app
  function isMobileApp() {
    const urlParams = new URLSearchParams(window.location.search);
    return (
      urlParams.get("mobile") === "true" ||
      window.mobileApp?.isMobileApp === true ||
      navigator.userAgent.includes("BilMenu-Mobile-App")
    );
  }

  // Get language from URL parameters or mobile app context
  function getLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get("lang");

    if (langParam) {
      return langParam;
    }

    if (window.mobileApp?.language) {
      return window.mobileApp.language;
    }

    // Fallback to existing language detection
    return localStorage.getItem("language") || "en";
  }

  // Initialize mobile app integration
  function initMobileApp() {
    if (!isMobileApp()) {
      return; // Not accessed from mobile app, skip mobile-specific changes
    }

    console.log("BilMenu: Mobile app integration active");

    // Hide header and burger menu
    const header = document.querySelector(".site-header");
    if (header) {
      header.style.display = "none";
    }

    // Hide burger menu button if it exists
    const burgerButton = document.querySelector(".mobile-menu-toggle");
    if (burgerButton) {
      burgerButton.style.display = "none";
    }

    // Adjust container padding since header is hidden
    const container = document.querySelector(".container");
    if (container) {
      container.style.paddingTop = "20px";
    }

    // Set language from mobile app
    const language = getLanguage();
    if (language) {
      // Override localStorage with mobile app language
      localStorage.setItem("bilmenu-language", language);

      // Set language using the language switcher if available
      if (window.languageSwitcher) {
        window.languageSwitcher.setLanguage(language);
      } else if (window.setLanguage) {
        window.setLanguage(language);
      }
    }

    // Add mobile app class to body for additional styling
    document.body.classList.add("mobile-app");

    // Notify mobile app that webapp is ready
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type: "webappReady",
          language: language,
          mobileApp: true,
        })
      );
    }
  }

  // Function to set language with retry mechanism
  function setMobileAppLanguage() {
    const language = getLanguage();
    if (language) {
      // Override localStorage with mobile app language
      localStorage.setItem("bilmenu-language", language);

      // Try to set language with retry mechanism
      let attempts = 0;
      const maxAttempts = 10;

      const trySetLanguage = () => {
        attempts++;
        if (window.languageSwitcher) {
          window.languageSwitcher.setLanguage(language);
          console.log(
            `BilMenu: Language set to ${language} via languageSwitcher`
          );
        } else if (window.setLanguage) {
          window.setLanguage(language);
          console.log(`BilMenu: Language set to ${language} via setLanguage`);
        } else if (attempts < maxAttempts) {
          // Retry after a short delay
          setTimeout(trySetLanguage, 100);
        } else {
          console.warn(
            "BilMenu: Could not set language - languageSwitcher not available"
          );
        }
      };

      trySetLanguage();
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMobileApp);
  } else {
    initMobileApp();
  }

  // Also run when window loads (in case DOMContentLoaded already fired)
  window.addEventListener("load", initMobileApp);

  // Set language after a delay to ensure languageSwitcher is initialized
  setTimeout(setMobileAppLanguage, 200);

  // Export functions for global access
  window.mobileAppUtils = {
    isMobileApp: isMobileApp,
    getLanguage: getLanguage,
    init: initMobileApp,
  };
})();
