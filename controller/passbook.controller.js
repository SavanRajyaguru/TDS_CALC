const User = require('../model/user.schema')
const mongoose = require('mongoose')
const { messaging, statuscode } = require('../utils/messaging.utils')
const passbookEntry = require('../utils/passbook_entry')
const withdrawEntry = require('../utils/withdraw_entry')
const tdsCalc = require('./tds_function')
const tdsEntry = require('../utils/tds_entry')

const createPassbookEntry = async (req, res) => {
    try {
        const { iUserId, nAmount, eTransactionType} = req.body

        const isUserExist = await User.findOne({ _id: iUserId })

        if(!isUserExist){
            return res.status(200).json({message: 'User not Found'})
        }

        // if(eTransactionType === 'Withdraw'){
        //     const resultW = await withdrawEntry(iUserId, nAmount)
        //     console.log(resultW)
        // }
        const result = await passbookEntry(res, iUserId, nAmount, eTransactionType)

        return messaging(res, statuscode.statusSuccess, result)

    } catch (error) {
        console.log(error)
        return messaging(res, statuscode.statusNotFound, error)
    } 
}

const tdsEntryController = async (req, res) => {
    const session = await mongoose.startSession()
    try {
        const { iUserId, nAmount } = req.body
        
        const calculateTDS = await tdsCalc(res, iUserId, nAmount)
        console.log('>>>>>>>', calculateTDS)
        console.log(calculateTDS.ans > 0,'$$$$$$$$$')
        return messaging(res, statuscode.statusSuccess, `TDS is ${calculateTDS.ans}`)
        // if(calculateTDS.ans > 0){
        //     //* transaction option
        //     const transactionOption = {
        //         readPreference: 'primary',
        //         readConcern: { level: 'majority' },
        //         writeConcern: { w: 'majority' }
        //     }
        //     //* start transaction
        //     session.startTransaction(transactionOption)
            
        //     //* Make Entry of Tds after calculating Taxable Amount
        //     await tdsEntry(res, iUserId, calculateTDS.ans, nAmount-calculateTDS.ans, session)
            
        //     //* Make Withdraw entry after deducting Tds from requested amount
        //     await withdrawEntry(iUserId, nAmount, session)

        //     //* Make Passbook entry
        //     //! update
        //     await passbookEntry(res, iUserId, nAmount, 'Withdraw', session)

        //     //* Make Passbook enteries for the same
        //     await passbookEntry(res, iUserId, calculateTDS.ans, 'TDS', session)

        //     //* commit transaction
        //     await session.commitTransaction()
        //     return messaging(res, statuscode.statusSuccess, `TDS is ${calculateTDS.ans}`)
        // } else {
        //     //* Make Withdraw entry after deducting Tds from requested amount
        //     await withdrawEntry(iUserId, nAmount, session)

        //     return messaging(res, statuscode.statusSuccess, 'TDS not cut')
        // }
    } catch (error) {
        console.log(error)
        await session.abortTransaction()
        return messaging(res, statuscode.statusNotFound, 'TDS Calculation rollback')
    } finally {
        await session.endSession()
    }
}

module.exports = {
    createPassbookEntry,
    tdsEntryController
}