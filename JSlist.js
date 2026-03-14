function listFilesInFolder() {
  // Set the ID of the folder you want to list files for
  var folderId = '1jpHTkd55qurEmzbRnOjiLvHou0vhGe5J'; //scan data jobsys folder

  // Get the folder object
  var folder = DriveApp.getFolderById(folderId);

  // Get the list of files in the folder
  var files = folder.getFiles();

 var spreadsheet = SpreadsheetApp.openById('1DiMVz57DaV0IT-F_ik4dQvHiO-1P65i2n2TUT_yMgko');
  var sheet = spreadsheet.getSheetByName('JSlist');
  // var range = sheet.getRange('A2:D');
  // range.clearContent();


  // Add the header row
  sheet.getRange(1, 1).setValue('File Name');
  sheet.getRange(1, 2).setValue('Owner');
  sheet.getRange(1, 3).setValue('Last Modified');
  sheet.getRange(1, 4).setValue('File Size');

  // Populate the spreadsheet with the file information
  var row = 2;
  while (files.hasNext()) {
    var file = files.next();
    sheet.getRange(row, 1).setValue(file.getName());
    sheet.getRange(row, 2).setValue(file.getOwner().getEmail());
    sheet.getRange(row, 3).setValue(file.getLastUpdated());
    sheet.getRange(row, 4).setValue(file.getSize() + ' bytes');
    row++;
  }

  // Open the spreadsheet in a new tab
  SpreadsheetApp.getActiveSpreadsheet().toast('File list generated!', 'Done');
  SpreadsheetApp.getActiveSpreadsheet().getRange('A1').activate();
  SpreadsheetApp.openById(spreadsheet.getId());
}

function listFilesInFolderComb() {
  // Set the ID of the folder you want to list files for
  var folderId = '1GmMvA6ITgt4o7L2szRmS2i9lyq0lwR4z'; //combined folder

  

  // Get the folder object
  var folder = DriveApp.getFolderById(folderId);

  // Get the list of files in the folder
  var files = folder.getFiles();

 var spreadsheet = SpreadsheetApp.openById('1DiMVz57DaV0IT-F_ik4dQvHiO-1P65i2n2TUT_yMgko');
  var sheet = spreadsheet.getSheetByName('JSlistComb');
  // var range = sheet.getRange('A2:D');
  // range.clearContent();


  // Add the header row
  sheet.getRange(1, 1).setValue('File Name');
  sheet.getRange(1, 2).setValue('Owner');
  sheet.getRange(1, 3).setValue('Last Modified');
  sheet.getRange(1, 4).setValue('File Size');

  // Populate the spreadsheet with the file information
  var row = 2;
  while (files.hasNext()) {
    var file = files.next();
    sheet.getRange(row, 1).setValue(file.getName());
    sheet.getRange(row, 2).setValue(file.getOwner().getEmail());
    sheet.getRange(row, 3).setValue(file.getLastUpdated());
    sheet.getRange(row, 4).setValue(file.getSize() + ' bytes');
    row++;
  }

  // Open the spreadsheet in a new tab
  SpreadsheetApp.getActiveSpreadsheet().toast('File list generated!', 'Done');
  SpreadsheetApp.getActiveSpreadsheet().getRange('A1').activate();
  SpreadsheetApp.openById(spreadsheet.getId());
}