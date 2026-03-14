// ============================================================
// JOB ITEM SCANNER - Google Apps Script Backend
// ============================================================
// SETUP INSTRUCTIONS:
// 1. Create new Apps Script project
// 2. Paste this as Code.gs
// 3. Create Index.html file with the frontend code
// 4. Update CONFIG object below with your Google Sheet ID and Drive Folder ID
// 5. Run setupSheets() ONCE to create sheet structure
// 6. Deploy → New Deployment → Web App → Execute as: Me, Access: Anyone
// ============================================================

// ══════════════════════════════════════════════════════════
// CONFIGURATION - UPDATE THESE VALUES
// ══════════════════════════════════════════════════════════
const CONFIG = {
  SPREADSHEET_ID: '1DiMVz57DaV0IT-F_ik4dQvHiO-1P65i2n2TUT_yMgko',
  DRIVE_FOLDER_ID: '1jpHTkd55qurEmzbRnOjiLvHou0vhGe5J',
  IMPORT_COMBINED_FOLDER_ID: '1GmMvA6ITgt4o7L2szRmS2i9lyq0lwR4z',
  IMPORT_COMPLETED_FOLDER_ID: '1vR_S58zFSD13H11Vuz6MiYsJuM8ddJ97',
  TIMEZONE: 'GMT+2'
};

// Sheet names
const SHEETS = {
  CRUDII: 'CRUDII',
  JOB_CUS_PROJ_TASK: 'JobCusProjTask',
  ARTISANS: 'Artisans',
  CSVDATA: 'csvdata',
  JSLIST: 'JSlist'
};

// ── Entry point ──────────────────────────────────────────────
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile("Index")
    .setTitle("Job Item Scanner")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ── One-time sheet setup ─────────────────────────────────────
function setupSheets() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  
  // --- CRUDII sheet ---
  let crudiiSheet = ss.getSheetByName(SHEETS.CRUDII);
  if (!crudiiSheet) crudiiSheet = ss.insertSheet(SHEETS.CRUDII);
  crudiiSheet.clearContents();
  const crudiiHeaders = [
    "Job Number", "Allocation Reference", "Issued To", 
    "ItemCode / Barcode", "Quantity Issued", "INOUTQTIME", "Project Number"
  ];
  crudiiSheet.appendRow(crudiiHeaders);
  crudiiSheet.getRange(1, 1, 1, crudiiHeaders.length)
    .setFontWeight("bold")
    .setBackground("#1a1a2e")
    .setFontColor("#ffffff");
  crudiiSheet.setFrozenRows(1);
  
  // --- JobCusProjTask sheet ---
  let jobSheet = ss.getSheetByName(SHEETS.JOB_CUS_PROJ_TASK);
  if (!jobSheet) jobSheet = ss.insertSheet(SHEETS.JOB_CUS_PROJ_TASK);
  jobSheet.clearContents();
  const jobHeaders = ["LINENO", "JOBNO", "CODE", "DESCRIPTION", "CUSTOMER"];
  jobSheet.appendRow(jobHeaders);
  jobSheet.getRange(1, 1, 1, jobHeaders.length)
    .setFontWeight("bold")
    .setBackground("#1a1a2e")
    .setFontColor("#ffffff");
  jobSheet.setFrozenRows(1);
  
  // Sample jobs
  const sampleJobs = [
    ["91193", "37377", "STORES", "STORES", "OUTENIQUA TRUCK AND BUS (PTY) LTD"],
    ["91086", "37376", "STORES", "STORES", "GEORGE MUNICIPALITY"],
    ["91063", "37369", "STORES", "STORES", "MIDGRAAF PROPERTIES"],
    ["91060", "37368", "STORES", "STORES", "WILLEM RT LASER"],
    ["91044", "37367", "STORES", "STORES", "RAMCOM CAPE (PTY)LTD"],
  ];
  sampleJobs.forEach(r => jobSheet.appendRow(r));
  
  // --- Artisans sheet ---
  let artisansSheet = ss.getSheetByName(SHEETS.ARTISANS);
  if (!artisansSheet) artisansSheet = ss.insertSheet(SHEETS.ARTISANS);
  artisansSheet.clearContents();
  const artisanHeaders = ["Name"];
  artisansSheet.appendRow(artisanHeaders);
  artisansSheet.getRange(1, 1, 1, artisanHeaders.length)
    .setFontWeight("bold")
    .setBackground("#1a1a2e")
    .setFontColor("#ffffff");
  
  // Sample artisans
  const sampleArtisans = [
    ["VIVIAN"],
    ["JOHN"],
    ["SARAH"],
    ["MICHAEL"],
    ["EMMA"]
  ];
  sampleArtisans.forEach(r => artisansSheet.appendRow(r));
  
  // --- csvdata sheet ---
  let csvSheet = ss.getSheetByName(SHEETS.CSVDATA);
  if (!csvSheet) csvSheet = ss.insertSheet(SHEETS.CSVDATA);
  csvSheet.clearContents();
  const csvHeaders = [
    "Date", "Job Number", "Project Number", "ItemCode / Barcode", 
    "Item Description", "Store Code", "Quantity Issued", "Unit Cost", 
    "Unit Price", "Allocation Reference", "Print Reference", "Issued To", 
    "Cost Category", "UDF1", "UDF2", "UDF3", "UDF4"
  ];
  csvSheet.appendRow(csvHeaders);
  csvSheet.getRange(1, 1, 1, csvHeaders.length)
    .setFontWeight("bold")
    .setBackground("#1a1a2e")
    .setFontColor("#ffffff");
  
  // --- JSlist sheet ---
  let jslistSheet = ss.getSheetByName(SHEETS.JSLIST);
  if (!jslistSheet) jslistSheet = ss.insertSheet(SHEETS.JSLIST);
  jslistSheet.clearContents();
  jslistSheet.getRange("A1").setValue("Last File Number");
  jslistSheet.getRange("F1").setValue(1); // Starting number
  
  SpreadsheetApp.flush();
  return { status: "ok", message: "Sheets created successfully" };
}

// ── API dispatcher ───────────────────────────────────────────
function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action;
    
    if (action === "searchJob") return respond(searchJob(params.query));
    if (action === "getJobs") return respond(getJobs());
    if (action === "getArtisans") return respond(getArtisans());
    if (action === "submitTransaction") return respond(submitTransaction(params));
    if (action === "getTransactions") return respond(getTransactions());
    if (action === "deleteTransaction") return respond(deleteTransaction(params.rowIndex));
    if (action === "saveToDrive") return respond(saveToDrive());
    if (action === "saveCSVDATAtoJobSys") return respond(saveCSVDATAtoJobSys());
    if (action === "getSavedFiles") return respond(getSavedFiles());
    if (action === "updateFileLists") return respond(updateFileLists());
    if (action === "getFileListsFromSheets") return respond(getFileListsFromSheets());
    
    return respond({ status: "error", message: "Unknown action: " + action });
  } catch (err) {
    return respond({ status: "error", message: err.toString() });
  }
}

function respond(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Search job by JOBNO or LINENO ────────────────────────────
function searchJob(query) {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEETS.JOB_CUS_PROJ_TASK);
  const data = sheet.getDataRange().getValues();
  
  if (!query || query.trim() === "") {
    return { status: "error", message: "Please enter a Job or Project number" };
  }
  
  const q = query.trim();
  
  // Search for match in LINENO (col 0) or JOBNO (col 1)
  const row = data.slice(1).find(r => 
    String(r[0]) === q || String(r[1]) === q
  );
  
  if (!row) {
    return { status: "error", message: "Job/Project not found: " + q };
  }
  
  return {
    status: "ok",
    job: {
      LINENO: row[0],
      JOBNO: row[1],
      CODE: row[2],
      DESCRIPTION: row[3],
      CUSTOMER: row[4]
    }
  };
}

// ── Get all jobs for dropdown ─────────────────────────────────
function getJobs() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEETS.JOB_CUS_PROJ_TASK);
  const data = sheet.getDataRange().getValues();
  
  const jobs = data.slice(1)
    .filter(r => r[0] && r[1])
    .map(r => ({
      LINENO: String(r[0]),
      JOBNO: String(r[1]),
      CODE: String(r[2]),
      DESCRIPTION: String(r[3]),
      CUSTOMER: String(r[4])
    }));
  
  return { status: "ok", jobs };
}

// ── Get list of artisans ─────────────────────────────────────
function getArtisans() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEETS.ARTISANS);
  const data = sheet.getDataRange().getValues();
  
  const artisans = data.slice(1)
    .filter(r => r[0] && r[0].toString().trim() !== "")
    .map(r => r[0].toString().trim());
  
  return { status: "ok", artisans };
}

// ── Submit TAKE or RETURN transaction ────────────────────────
function submitTransaction(params) {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const crudiiSheet = ss.getSheetByName(SHEETS.CRUDII);
  const now = new Date();
  
  // Validate
  if (!params.jobNumber) return { status: "error", message: "Job number is required" };
  if (!params.projectNumber) return { status: "error", message: "Project number is required" };
  if (!params.collector) return { status: "error", message: "Collector is required" };
  if (!params.issuer) return { status: "error", message: "Issuer is required" };
  if (!params.barcode) return { status: "error", message: "Barcode is required" };
  if (!params.quantity || params.quantity === 0) return { status: "error", message: "Valid quantity is required" };
  
  // Create allocation reference from collector name
  const allocRef = "AA - TEST - TABLET"; // You can modify this logic
  
  // Format timestamp
  const timestamp = Utilities.formatDate(now, CONFIG.TIMEZONE, "yyyy/MM/dd_HH:mm:ss");
  
  // Append to CRUDII sheet
  crudiiSheet.appendRow([
    params.jobNumber,
    allocRef,
    params.issuer,
    params.barcode,
    params.quantity,
    timestamp,
    params.projectNumber
  ]);
  
  SpreadsheetApp.flush();
  
  return { 
    status: "ok", 
    message: "Transaction recorded",
    timestamp: timestamp
  };
}

// ── Get all transactions from CRUDII ─────────────────────────
function getTransactions() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEETS.CRUDII);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const transactions = data.slice(1).map((row, index) => ({
    rowIndex: index + 2, // +2 because: +1 for header, +1 for 1-based indexing
    "Job Number": row[0],
    "Allocation Reference": row[1],
    "Issued To": row[2],
    "ItemCode / Barcode": row[3],
    "Quantity Issued": row[4],
    "INOUTQTIME": row[5],
    "Project Number": row[6]
  }));
  
  return { status: "ok", transactions: transactions.reverse() };
}

// ── Delete transaction ───────────────────────────────────────
function deleteTransaction(rowIndex) {
  if (!rowIndex || rowIndex < 2) {
    return { status: "error", message: "Invalid row index" };
  }
  
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEETS.CRUDII);
  
  sheet.deleteRow(rowIndex);
  SpreadsheetApp.flush();
  
  return { status: "ok", message: "Transaction deleted" };
}

// ── Save to Drive as CSV ─────────────────────────────────────
function saveToDrive() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const crudiiSheet = ss.getSheetByName(SHEETS.CRUDII);
  const csvSheet = ss.getSheetByName(SHEETS.CSVDATA);
  const jslistSheet = ss.getSheetByName(SHEETS.JSLIST);
  
  // Clear csvdata sheet
  csvSheet.clearContents();
  
  // Add headers
  const csvHeaders = [
    "Date", "Job Number", "Project Number", "ItemCode / Barcode", 
    "Item Description", "Store Code", "Quantity Issued", "Unit Cost", 
    "Unit Price", "Allocation Reference", "Print Reference", "Issued To", 
    "Cost Category", "UDF1", "UDF2", "UDF3", "UDF4"
  ];
  csvSheet.appendRow(csvHeaders);
  
  // Get CRUDII data
  const crudiiData = crudiiSheet.getDataRange().getValues();
  
  // Transform CRUDII data to CSV format
  for (let i = 1; i < crudiiData.length; i++) {
    const row = crudiiData[i];
    
    // Extract date from INOUTQTIME (format: 2026/03/05_09:41:16)
    const dateTime = row[5] ? row[5].toString().split('_')[0] : '';
    
    // For RETURN items, quantity should be negative
    const quantity = row[4];
    
    csvSheet.appendRow([
      dateTime,                    // Date
      row[0],                      // Job Number
      row[6],                      // Project Number
      row[3],                      // ItemCode / Barcode
      '',                          // Item Description (empty)
      '001',                       // Store Code
      quantity,                    // Quantity Issued
      '',                          // Unit Cost
      '',                          // Unit Price
      row[1],                      // Allocation Reference
      '',                          // Print Reference
      row[2],                      // Issued To
      '',                          // Cost Category
      '',                          // UDF1
      '',                          // UDF2
      '',                          // UDF3
      ''                           // UDF4
    ]);
  }
  
  // Get all data from csvdata sheet
  const csvData = csvSheet.getDataRange().getValues();
  
  // Convert to CSV format
  const csvText = csvData.map(function(row) {
    return row.join(',');
  }).join('\n');
  
  // Create filename
  const fileName = createFileName(jslistSheet);
  
  // Save to Drive
  const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
  const file = folder.createFile(fileName, csvText, 'text/csv');
  
  // Increment file number
  const currentNum = jslistSheet.getRange('F1').getValue();
  jslistSheet.getRange('F1').setValue(currentNum + 1);
  
  return { 
    status: "ok", 
    message: "File saved successfully",
    fileName: fileName,
    fileUrl: file.getUrl()
  };
}

// ── Create filename ──────────────────────────────────────────
function createFileName(jslistSheet) {
  const startingNumber = jslistSheet.getRange('F1').getValue();
  const formattedStartingNumber = ('00000' + startingNumber).slice(-5);
  const currentDate = new Date();
  const fileName = formattedStartingNumber + '_APP1_' + 
    Utilities.formatDate(currentDate, CONFIG.TIMEZONE, 'yyyy_MM_dd_HHmm') + '.csv';
  return fileName;
}

// ── Get saved files from Drive ───────────────────────────────
function getSavedFiles() {
  const folder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
  const files = folder.getFilesByType(MimeType.CSV);
  
  const fileList = [];
  while (files.hasNext()) {
    const file = files.next();
    fileList.push({
      name: file.getName(),
      url: file.getUrl(),
      date: file.getLastUpdated(),
      id: file.getId()
    });
  }
  
  // Sort by date descending
  fileList.sort((a, b) => b.date - a.date);
  
  return { status: "ok", files: fileList };
}

// ── Update file lists in spreadsheet ───────────────────────────
function updateFileLists() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  
  // Update JSlist sheet (SCAN_DATA_JOBSYS folder)
  let jslistSheet = ss.getSheetByName('JSlist');
  if (!jslistSheet) {
    jslistSheet = ss.insertSheet('JSlist');
    jslistSheet.getRange(1, 1).setValue('File Name');
    jslistSheet.getRange(1, 2).setValue('Owner');
    jslistSheet.getRange(1, 3).setValue('Last Modified');
    jslistSheet.getRange(1, 4).setValue('File Size');
  }
  
  const folder1 = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
  const files1 = folder1.getFiles();
  let row = 2;
  jslistSheet.getRange('A2:D').clearContent();
  while (files1.hasNext()) {
    const file = files1.next();
    jslistSheet.getRange(row, 1).setValue(file.getName());
    jslistSheet.getRange(row, 2).setValue(file.getOwner().getEmail());
    jslistSheet.getRange(row, 3).setValue(file.getLastUpdated());
    jslistSheet.getRange(row, 4).setValue(file.getSize() + ' bytes');
    row++;
  }
  
  // Update JSlistComb sheet (IMPORT_COMBINED folder)
  let jslistCombSheet = ss.getSheetByName('JSlistComb');
  if (!jslistCombSheet) {
    jslistCombSheet = ss.insertSheet('JSlistComb');
    jslistCombSheet.getRange(1, 1).setValue('File Name');
    jslistCombSheet.getRange(1, 2).setValue('Owner');
    jslistCombSheet.getRange(1, 3).setValue('Last Modified');
    jslistCombSheet.getRange(1, 4).setValue('File Size');
  }
  
  const folder2 = DriveApp.getFolderById(CONFIG.IMPORT_COMBINED_FOLDER_ID);
  const files2 = folder2.getFiles();
  row = 2;
  jslistCombSheet.getRange('A2:D').clearContent();
  while (files2.hasNext()) {
    const file = files2.next();
    jslistCombSheet.getRange(row, 1).setValue(file.getName());
    jslistCombSheet.getRange(row, 2).setValue(file.getOwner().getEmail());
    jslistCombSheet.getRange(row, 3).setValue(file.getLastUpdated());
    jslistCombSheet.getRange(row, 4).setValue(file.getSize() + ' bytes');
    row++;
  }
  
  SpreadsheetApp.flush();
  return { status: "ok", message: "File lists updated" };
}

// ── Get file lists from spreadsheet sheets ───────────────────────
function getFileListsFromSheets() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  
  const jslistComb = ss.getSheetByName('JSlistComb');
  const jslist = ss.getSheetByName('JSlist');
  
  const result = {
    importCombined: [],
    savedJobsys: []
  };
  
  if (jslistComb) {
    const data = jslistComb.getRange('A2:C').getValues();
    result.importCombined = data.filter(row => row[0] !== '');
  }
  
  if (jslist) {
    const data = jslist.getRange('A2:C').getValues();
    result.savedJobsys = data.filter(row => row[0] !== '');
  }
  
  return { status: "ok", data: result };
}

// ── Utility ──────────────────────────────────────────────────
function rowToObj(headers, row) {
  const obj = {};
  headers.forEach((h, i) => obj[h] = row[i]);
  return obj;
}
