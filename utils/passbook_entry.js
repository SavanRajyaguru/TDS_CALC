const Passbook = require('../model/passbook.schema')
const User = require('../model/user.schema')
const { messaging, statuscode } = require('../utils/messaging.utils')

async function passbookEntry(res, iUserId, nAmount, eTransactionType, session){
    try {
        //* find oldPassbook Entry
        const oldPassbook = await Passbook.find({ iUserId: iUserId, eStatus: 'S' }).sort({dCreatedAt: -1}).limit(1)
        console.log('OLD>>>>', oldPassbook)

        if(oldPassbook){
            if(eTransactionType === 'WIN'){
                oldPassbook[0].nTotalBalance += nAmount
            } else if(eTransactionType === 'Deposit'){
                oldPassbook[0].nDepositBalance += nAmount
            } else if(eTransactionType === 'TDS'){
                //! you have to write some code here...
                // oldPassbook[0].nTotalBalance -= nAmount
            } else if(eTransactionType === 'Withdraw'){

                //! last entry in the passbook for the TDS cut... 

                console.log(oldPassbook[0].nTotalBalance, nAmount)
                if(nAmount > oldPassbook[0].nTotalBalance){
                    return res.status(200).json({message: 'Amount is bigger then you have'})
                } else {
                    oldPassbook[0].nTotalBalance -= nAmount
                }
            }
            const passbookObj = {
                iUserId,
                nAmount,
                eTransactionType,
                nDepositBalance: oldPassbook[0].nDepositBalance,
                nTotalBalance: oldPassbook[0].nTotalBalance
            }

            console.log('NEW>>>>', passbookObj)

            //* make entry in passbook
            const isData = await Passbook.create([passbookObj], {session})
            return isData
                
        }
    } catch (error) {
        console.log(error)
        return res.status(200).json({message: err})
    }
}

module.exports = passbookEntry