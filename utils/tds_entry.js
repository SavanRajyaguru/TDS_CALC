const Tds = require('../model/tds.schema')
const { messaging, statuscode } = require('../utils/messaging.utils')

async function tdsEntry(res, iUserId, nAmount, nOriginalAmount, session){
    try {
        
        const TdsObj = {
            iUserId,
            nAmount,
            nOriginalAmount,
        }
        
        //* make entry in withdraw
        const data = await Tds.create([TdsObj], {session})
        console.log('>>>>>>>>',data)
        return data

    } catch (error) {
        console.log(error)
        return res.status(200).json({message: err})
    }
}

module.exports = tdsEntry
