// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

use('iqmenu')

// Получить все
// db.menus.find()

// Найти максимальный
// db.menus.aggregate([
//   { $group: { _id: null, maxCode: { $max: "$code" } } }
// ]);

// Удалить индекс
// db.menus.dropIndex("id_1")

// Удалить все
db.menus.deleteMany({})
