function fixturize() {

  FOLDER = "SCRIPTS" // Папка, куда будут падать файлы.
  
  var sheet = SpreadsheetApp.getActiveSheet();
  var sheetname = sheet.getName();
  var modelname = "myapp."+sheetname //  Название файла == название модели == название вкладки
  var data = sheet.getDataRange().getValues();
 
  // Получаем ключи из верхней строчки таблицы
  
  firstrow = data[0]
  fieldnames = []
  
  for (var col = 0; col < firstrow.length; col++) {
    cell = data[0][col]
    fieldnames.push(cell) 
  } 
  
  // Получаем остальные данные и оформляем в формат фикстур
  
  items = []
  
  for (var rownumber = 1; rownumber < data.length; rownumber++) {

    rowdata = data[rownumber]
    fields = {}
    
    for (var f = 1; f < rowdata.length; f++) {
      key = fieldnames[f]
      fields[key] = rowdata[f]
    } 
    
    items.push({"model":modelname, "pk":rownumber, "fields": fields})
  }
  
  // Пакуем в json и сохраняем в выбранной папке
  
  result = JSON.stringify(items)
  folder = DriveApp.getFoldersByName(FOLDER).next()
  folder.createFile(sheetname, result, MimeType.PLAIN_TEXT)
  
}
