const mongoose = require('mongoose')
const config = require('../config/config')

const connectDb = async () => {
        await mongoose.connect(config.app.DB_URL)
        .then(result => console.log('MongoDb connected', result.connection.db.namespace))
        .catch(err => console.log('DB ERROR>>>>', err))
}

module.exports = connectDb