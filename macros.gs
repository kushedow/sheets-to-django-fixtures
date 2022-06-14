function get_parent_folder(){
  /**
   * Получает папку, чтобы сохранить фиктсуры туда, откуда скрипт был запущен
   * @return Folder
   */

  var this_file = DriveApp.getFileById(SpreadsheetApp.getActive().getId());
  var parent_folder = this_file.getParents().next()

  return parent_folder

}

function assemble_django_item(modelname, fieldnames, row_data, rownumber){
  /**
   * Собирает ожин объект в формате джанго-фикстуры
   * @param modelname Название фикстуры
   * @param fieldnames Список названий полей
   * @param row_data Один элемент в формате плоского асс. массива.
   * @return Object. Один элемент в формате фикстуры джанго
   * https://docs.djangoproject.com/en/4.0/howto/initial-data/
   */

    fields = {}
    
    for (var f = 1; f < row_data.length; f++) {
      key = fieldnames[f]
      fields[key] = row_data[f]
    } 
    
    return {
      "model":modelname, 
      "pk":rownumber, 
      "fields": fields,
      }
  
}


function assemble_flask_item(modelname, fieldnames, row_data, rownumber){
  /**
   * Собирает ожин объект в формате плоского списка объектов
   * @param modelname Название фикстуры
   * @param fieldnames Список названий полей
   * @param row_data Один элемент в формате плоского асс. массива.
   * @return Object. Один элемент в виде плоского Object
   */

    fields = {}
    
    for (var f = 1; f < row_data.length; f++) {
      key = fieldnames[f]
      fields[key] = row_data[f]
      fields["pk"] = rownumber
    } 
    
    return fields
  
}


function fixturize(framework="django") {

  /**
   * Делат всю работу
   * Получает данные
   * Создает json
   * Пишет в файл
   */
  
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

    row_data = data[rownumber]

    // Собираем каждую запись отдельной функцией

    if (framework == "django"){ item = assemble_django_item(modelname, fieldnames, row_data, rownumber) }
    if (framework == "flask"){ item = assemble_flask_item(modelname, fieldnames, row_data, rownumber) }

    items.push(item)

  }
  
  // Пакуем в json и сохраняем в выбранной папке
  
  result = JSON.stringify(items)
  folder = get_parent_folder()
  folder.createFile(sheetname, result, MimeType.PLAIN_TEXT)
  
}

function save_as_flask_fixture(){
  fixturize(framework="flask")
}


function save_as_django_fixture(){
  fixturize(framework="django")
}
