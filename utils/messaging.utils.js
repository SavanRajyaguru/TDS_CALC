const statuscode = {
    statusSuccess: 200,
    statusNotFound: 403,
    badRequest: 400,
    unAuthorized: 403,
    pageNotFound: 404
}

const messaging = (res, statusCode, value) => {
    try {
        return res.status(statusCode).json({ message: value })
    } catch (error) {
        console.log('ERROR in msg>>>>>> ', error)
        return res.status(200).json({ Error: error })
    }
}

module.exports = { messaging, statuscode }