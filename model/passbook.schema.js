const mongoose = require('mongoose'), Schema = mongoose.Schema

const passbook = Schema({
    iUserId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'Enter userId']
    }, 
    nTotalBalance: {
        type: Number,
        default: 0,
        required: [true, 'Enter TotalBalance']
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
    eTransactionType: {
        type: String,
        enum: ['TDS', 'Withdraw', 'WIN', 'Deposit'],
        require: [true, 'Enter Transaction Type']
    },
    nDepositBalance: {
        type: Number,
        default: 0,
        require: [true, 'Enter DepositBalance']
    },
}, { timestamps: {
    createdAt: 'dCreatedAt',
    updatedAt: 'dUpdatedAt'
} })

const Passbook = mongoose.model('passbook', passbook)

module.exports = Passbook