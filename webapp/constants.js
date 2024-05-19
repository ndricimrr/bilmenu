const URL = "http://kafemud.bilkent.edu.tr/monu_eng.html";

// CommonJS export (for Node.js)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { URL };
}
// for browsers
else {
  window.URL = URL;
}
