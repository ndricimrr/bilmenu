const URL = "http://kafemud.bilkent.edu.tr/monu_tr.html";

// CommonJS export (for Node.js)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { URL };
}
// for browsers
else {
  window.URL = URL;
}
