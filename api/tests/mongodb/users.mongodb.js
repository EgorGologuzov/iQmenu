// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

use('iqmenu')

// Получить все
// db.users.find()

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
