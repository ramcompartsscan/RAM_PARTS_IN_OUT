//NEW G SHEET URL 1DiMVz57DaV0IT-F_ik4dQvHiO-1P65i2n2TUT_yMgko
//OLD G SHEET URL 1FC7ipzQC3BqBAm__RVFP3gf-pLjEInKESzbBCS5yztI

//NEW FOLDER URL https://drive.google.com/drive/folders/1jpHTkd55qurEmzbRnOjiLvHou0vhGe5J?usp=drive_link
//OLD FOLDER URL https://drive.google.com/drive/folders/15pPXnlsetx2t7YaiVnqBvh4d6XBFfz6V?usp=drive_link

function saveSCANToDrive() {
  // Specify the spreadsheet and range
  var spreadsheetId = '1DiMVz57DaV0IT-F_ik4dQvHiO-1P65i2n2TUT_yMgko';
  var range = 'A:G';
  // Retrieve the data from the spreadsheet
  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var sheet = spreadsheet.getSheetByName('CRUDII');
  var data = sheet.getRange(range).getValues();
  // Convert the data to CSV format
  var csvData = data.map(function(row) {
    return row.join(',');
  }).join('\n');
  // Create a new file name with the desired format
  var currentDate = new Date();
  var fileName = 'APP1_' + Utilities.formatDate(currentDate, 'GMT+2', 'yyyy_MM_dd_HHmm') + '.csv';
  // Create a new file in the specified Google Drive folder
  var folderId = '15pPXnlsetx2t7YaiVnqBvh4d6XBFfz6V';
  var folder = DriveApp.getFolderById(folderId);
  var file = folder.createFile(fileName, csvData, 'text/csv');
}

function createFileName() {
  // Get the value from cell F1 on the 'JSlist' sheet
  var ssId = '1DiMVz57DaV0IT-F_ik4dQvHiO-1P65i2n2TUT_yMgko';
  var sheet = SpreadsheetApp.openById(ssId).getSheetByName('JSlist');
  var startingNumber = sheet.getRange('F1').getValue();
  // Ensure the starting number is a 4-digit number
  var formattedStartingNumber = ('00000' + startingNumber).slice(-5);
  // Create the file name
  var currentDate = new Date();
  var fileName = formattedStartingNumber + '_APP1_' + Utilities.formatDate(currentDate, 'GMT+2', 'yyyy_MM_dd_HHmm') + '.csv';
  // Logger.log(fileName)
  return fileName;
  
}



// SCAN DATA JOBSYS FOLDER https://drive.google.com/drive/folders/1jpHTkd55qurEmzbRnOjiLvHou0vhGe5J?usp=sharing
// Parts app when save writes to csv on gd fro import in JobSys



function saveCSVDATAtoJobSys() {
  var fileName = createFileName();
  // Get the data from the sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('csvdata');
  var data = sheet.getDataRange().getValues();
  // Remove the square brackets from the header row
  data[0] = data[0].map(function(item) {
    return item.replace('[', '').replace(']', '');
  });
  // Filter out rows where the first column is empty
  data = data.filter(function(row) {
    return row[0] !== '';
  });
  // Convert the data to CSV format
  var csvContent = convertArrayToCSV(data, '\r\n');
  // Create a new file name with the desired format
  // var date = Utilities.formatDate(new Date(), 'GMT+2', 'yyyy_MM_dd');
  // var time = Utilities.formatDate(new Date(), 'GMT+2', 'HHmm');
  // var fileName = 'APP1_' + date + '_' + time + '.csv';
  
  // SCAN_DATA_JOBSYS
  var folderId = '1jpHTkd55qurEmzbRnOjiLvHou0vhGe5J';
  var folder = DriveApp.getFolderById(folderId);
  var file = folder.createFile(fileName, csvContent, 'text/csv');

  // Display the download link in a modal dialog
//   var url = file.getDownloadUrl();
//   var htmlOutput = HtmlService.createHtmlOutput('<a href="' + url + '">Click here to download the CSV file</a>');
//   SpreadsheetApp.getUi().showModalDialog(htmlOutput, "Download CSV");
  listFilesInFolder();
}

function convertArrayToCSV(array, lineBreak) {
  var csvContent = "";
  array.forEach(function(row, index) {
    var rowData = row.join(",");
    csvContent += rowData + lineBreak;
  });
  return csvContent;
  
}

function savePRINTERxlsx() {
  var fileNameX = createFileNameX();
  
  // Get the data from the sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('printer');
  var data = sheet.getDataRange().getValues();
  
  // Remove the square brackets from the header row
  data[0] = data[0].map(function(item) {
    return item.replace('[', '').replace(']', '');
  });
  
  // Filter out rows where the first column is empty
  data = data.filter(function(row) {
    return row[0] !== '';
  });
  
  // Create a new spreadsheet and sheet
  var ss = SpreadsheetApp.create(fileNameX);
  var newSheet = ss.getSheets()[0];
  
  // Copy the data to the new sheet
  newSheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  
  // Get the file ID of the new spreadsheet
  var fileId = ss.getId();
  
  // Move the file to the desired Google Drive folder
  var folderId = '1dIbP8WyMDou3pKOh6WYY5RgDka5nrBLo';
  var folder = DriveApp.getFolderById(folderId);
  var file = DriveApp.getFileById(fileId);
  folder.addFile(file);
  file.setName(fileNameX);
  
  // Display the download link in a modal dialog
  // var url = 'https://docs.google.com/spreadsheets/d/' + fileId + '/export?format=xlsx';
  // var htmlOutput = HtmlService.createHtmlOutput('<a href="' + url + '">Click here to download the XLSX file</a>');
  // SpreadsheetApp.getUi().showModalDialog(htmlOutput, "Download XLSX");
}

function createFileNameX() {
  var date = Utilities.formatDate(new Date(), 'GMT+2', 'yyyy_MM_dd');
  var time = Utilities.formatDate(new Date(), 'GMT+2', 'HHmm');
  var filenameX = 'APP1_' + date + '_' + time + '.xlsx';
  Logger.log(filenameX);
  return filenameX;
}





// function deleteRange() {
  // SpreadsheetApp.getActiveSpreadsheet().getSheetByName('CRUDII').getRange('A2:G').clearContent();
// }

function saveCSVDATAtoJobSys2() {
  // Get the data from the sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('csvdata2');
  var data = sheet.getDataRange().getValues();

  // Remove the square brackets from the header row
  data[0] = data[0].map(function(item) {
    return item.replace('[', '').replace(']', '');
  });

  // Filter out rows where the first column is empty
  data = data.filter(function(row) {
    return row[0] !== '';
  });

  // Convert the data to CSV format
  var csvContent = convertArrayToCSV(data, '\r\n');

  // Create a new file name with the desired format
  var date = Utilities.formatDate(new Date(), 'GMT+2', 'yyyy_MM_dd');
  var time = Utilities.formatDate(new Date(), 'GMT+2', 'HHmm');
  var fileName = 'App2_' + date + '_' + time + '.csv';

  // Create a new file in the specified Google Drive folder
  var folderId = '1jpHTkd55qurEmzbRnOjiLvHou0vhGe5J';
  var folder = DriveApp.getFolderById(folderId);
  var file = folder.createFile(fileName, csvContent, 'text/csv');

  // Display the download link in a modal dialog
//   var url = file.getDownloadUrl();
//   var htmlOutput = HtmlService.createHtmlOutput('<a href="' + url + '">Click here to download the CSV file</a>');
//   SpreadsheetApp.getUi().showModalDialog(htmlOutput, "Download CSV");
}

function convertArrayToCSV(array, lineBreak) {
  var csvContent = "";
  array.forEach(function(row, index) {
    var rowData = row.join(",");
    csvContent += rowData + lineBreak;
  });
  return csvContent;
}


function deleteRange2() {
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName('CRUDII2').getRange('A2:G').clearContent();
}















