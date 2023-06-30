const Withdraw = require('../model/withdraw.schema')
const { messaging, statuscode } = require('../utils/messaging.utils')

async function withdrawEntry(iUserId, nAmount, session){
    try {
        
        const withdrawObj = {
            iUserId,
            nAmount
        }
        
        //* make entry in withdraw
        const data = await Withdraw.create([withdrawObj], {session})
        console.log('>>>>>>>>',data)
        return data
    } catch (error) {
        console.log(error)
        return res.status(200).json({message: err})
    }
}

module.exports = withdrawEntry