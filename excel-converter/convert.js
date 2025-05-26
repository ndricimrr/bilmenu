// This script converts an HTML table to an Excel document using Node.js using html-docx-js library

const fs = require("fs");
const htmlDocx = require("html-docx-js");
const { Blob } = require("buffer");

// Read the HTML file
fs.readFile("input.html", "utf8", (err, htmlContent) => {
  if (err) {
    console.error("Error reading HTML file:", err);
    return;
  }

  // Convert HTML to DOCX
  const docxBlob = htmlDocx.asBlob(htmlContent);

  // Convert Blob to Buffer
  const reader = docxBlob.stream().getReader();
  const chunks = [];

  reader.read().then(function process({ done, value }) {
    if (done) {
      const buffer = Buffer.concat(chunks);
      // Write the DOCX file
      fs.writeFile("output.docx", buffer, (err) => {
        if (err) {
          console.error("Error writing DOCX file:", err);
        } else {
          console.log("Word document created successfully.");
        }
      });
      return;
    }
    chunks.push(value);
    return reader.read().then(process);
  });
});
