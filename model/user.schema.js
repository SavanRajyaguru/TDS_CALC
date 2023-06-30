const mongoose = require('mongoose'), Schema = mongoose.Schema

const user = Schema({
    sUsername: {
        type: String,
        required: [true, 'Enter username']
    }, 
    sPassword: {
        type: String,
        required: [true, 'Enter password']
    },
}, { timestamps: false })

const User = mongoose.model('users', user)

module.exports = User