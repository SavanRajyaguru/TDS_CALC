const mongoose = require('mongoose'), Schema = mongoose.Schema

const withdraw = Schema({
    iUserId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'Enter userId']
    }, 
    nAmount: {
        type: Number,
        required: [true, 'Enter Amount']
    },
    eStatus: {
        type: String,
        enum: ['S', 'F'],
        default: 'S',
        require: [true, 'Enter Status']
    },
}, { timestamps: {
    createdAt: 'dCreatedAt',
    updatedAt: 'dUpdatedAt'
} })

const Withdraw = mongoose.model('withdraw', withdraw)

module.exports = Withdraw