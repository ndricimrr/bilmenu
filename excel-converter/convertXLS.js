// This script converts an HTML table to an Excel document using Node.js - using XLSX library

const fs = require("fs");
const XLSX = require("xlsx");
const { JSDOM } = require("jsdom");

// Read the HTML file
fs.readFile("input.html", "utf8", (err, htmlContent) => {
  if (err) {
    console.error("Error reading HTML file:", err);
    return;
  }

  // Parse the HTML content
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  // Find the table
  const table = document.querySelector("table");
  if (!table) {
    console.error("No table found in the HTML content");
    return;
  }

  // Convert the table to a worksheet
  const worksheet = XLSX.utils.table_to_sheet(table);

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Write the workbook to an XLSX file
  XLSX.writeFile(workbook, "output.xlsx");
  console.log("Excel document created successfully.");
});
