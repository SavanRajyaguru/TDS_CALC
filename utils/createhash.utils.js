const crypto = require('crypto')

//######### convert password into hash ###########//
const createHash = (password) => {
    try {
        const passwordHash = crypto.createHash('sha256').update(password).digest('hex')
        return passwordHash
    } catch (error) {
        console.log('Error in createHash')
    }
}

module.exports = createHash