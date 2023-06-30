const User = require('../model/user.schema')
const createHash = require('../utils/createhash.utils')
const { messaging, statuscode } = require('../utils/messaging.utils')

const insetUserDetails = async (req, res) => {
    try {
        const { sUsername, sPassword} = req.body
        const isUserExist = await User.findOne({ sUsername: sUsername })

        if(isUserExist){
            return messaging(res, statuscode.statusSuccess, 'Username is already exists')
        }

        const result = await User.create(
            { sUsername: sUsername, sPassword: createHash(sPassword)})
        if(!result){
            return messaging(res, statuscode.statusSuccess, err._message)
        }
            // .then(async (result) => {
            //     return messaging(res, statuscode.statusSuccess, result)
            // }).catch((err) => {
            //     return messaging(res, statuscode.statusSuccess, err._message)
            // })

    } catch (error) {
        console.log(error)
        return messaging(res, statuscode.statusNotFound, error)
    }
}

module.exports = {
    insetUserDetails
}