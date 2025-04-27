/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

use('iqmenu')

// Получить все
db.users.find()

// Найти по id
// db.users.find({
//   _id: ObjectId('680e1a15d3541dc2a1cf6298')
// })

// Найти $or
// db.users.find({
//   $or: [
//     { _id: ObjectId('680e1a15d3541dc2a1cf6298') },
//     { phone: '+70000000001' }
//   ]
// })

// Обновить активность
// db.users.updateOne(
//   { _id: ObjectId('680e1a15d3541dc2a1cf6298') },
//   { $set: { isActive: false } }
// )

// Удалить по номерам
// db.users.deleteMany({ phone: { $in: ["+70000000001"] } })

// Удалить все
// db.users.deleteMany({})
