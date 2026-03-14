function App1script() {
  copyValueToCell();
  saveSCANToDrive();
  saveCSVDATAtoJobSys();
  // savePRINTERxlsx();
  deleteRange(); //delete CRUDII after save

}

function copyValueToCell() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("JSlist");
  var sourceValue = sheet.getRange("K1").getValue();
  sheet.getRange("F1").setValue(sourceValue);
}

function deleteRange() {
  // try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName('CRUDII');
    const range = sheet.getRange('A2:G');
    range.clearContent();
  //   console.log('Range cleared successfully.');
  // } catch (error) {
  //   console.error('Error clearing range:', error);
  // }
}

function doGet(e) {
  // If no parameters, return the HTML interface
  if (!e.parameter.ID) {
    return HtmlService.createHtmlOutputFromFile("Index")
      .setTitle("Stock Count");
  }
  
  // Otherwise process the data request
  var ss = SpreadsheetApp.openById(e.parameter.ID);
  var sh = ss.getSheetByName(e.parameter.SH);
  var fn = e.parameter.FN;
  var rg = sh.getDataRange().getValues();

  if(e.parameter.FN == 'SAVE') {
    // saveSCANToDrive(sh);
    App1script();
    return ContentService.createTextOutput(JSON.stringify(e.parameter));
  }
  
  // Create/Add new record, using comma separated values
  else if ( fn == 'CREATE' ) {
    var data = e.parameter.DATA.split(',');
    sh.appendRow(data);
    return ContentService.createTextOutput("New record created");
  }
  
  // Reads/Returns all data as a stringified JSON List
  else if ( fn == 'READ' ) {
    return ContentService.createTextOutput(JSON.stringify(rg));     
  }
  
  // Edit/Update existing record, requires index/row and current col1 to match
  else if ( fn == 'UPDATE' ) {
    var index = e.parameter.INDEX;  //index in list
    var col1 = e.parameter.COL1;  // current/existing value of col1 - it could be replaced...
    var data = e.parameter.DATA.split(','); //new data
    var range = sh.getRange((parseInt(index)+1),1,1,data.length);
    for (var i = 0; i < rg.length; i++ ) {
      if ( index != undefined && i == index && col1 == rg[i][0] ) {
        range.setValues([data]);
      } 
    }
    return ContentService.createTextOutput("Record updated");    
    }
  
  // deletes a single record (and its row) from sheet. Requires row index and col1 to match
  else if ( fn == 'DELETE' ) {
    var index = e.parameter.INDEX;  //index in list
    var col1 = e.parameter.COL1;  // current/existing value of col1 - it could be replaced...
    for (var i = 0; i < rg.length; i++ ) {
      if ( index != undefined && i == index && col1 == rg[i][0] ) {
        sh.deleteRow(parseInt(index)+1);
      } 
    }
    return ContentService.createTextOutput("Existing record deleted");    
   }
    
  // outputs results from SQL query of all data  
  else if ( fn == 'QUERY' ) {
    var rgq = sh.getName() + "!" + sh.getDataRange().getA1Notation();
    var sql = e.parameter.SQL;
    var qry = '=query(' + rgq + ';\"' + sql + '\";1)';
    var ts = ss.insertSheet();
    var setQuery = ts.getRange(1,1).setFormula(qry);
    var getResult = ts.getDataRange().getValues();
    ss.deleteSheet(ts); 
    return ContentService.createTextOutput(JSON.stringify(getResult));
  }
  
}


