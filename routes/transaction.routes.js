const { createPassbookEntry, tdsEntryController } = require('../controller/passbook.controller')
const { insetUserDetails } = require('../controller/user.controller')

const router = require('express').Router()

router
    .post('/sign-up', insetUserDetails)
    .post('/passbook-entry', createPassbookEntry)
    .post('/tds-entry', tdsEntryController)
    
module.exports = router