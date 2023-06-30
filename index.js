const express = require('express')
const app = express()
const logger = require('morgan')
const config = require('./config/config')
const connectDb = require('./database/dbconnect')
const transaction = require('./routes/transaction.routes')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//* Connect test database
connectDb()

app.use('/api', transaction)

//* If there is an error on all routes then default all 
app.all('*', (req, res) => {
    res.status(404).send('<h1>Data Not Found</h1>')
})

app.listen(config.app.port, (err) => {
    if (err) {
        console.log('Error on listen', err)
    }
    console.log(`Server is running on ${config.app.port}...`)
})