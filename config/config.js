require('dotenv').config()

// SET NODE_ENV=development
// for the env 
// const env = process.env.NODE_ENV; // 'dev' or 'test'

const config = {
    app: {
        port: process.env.PORT || 4040,
        DB_URL: process.env.DB_URL || '',
    }
}

module.exports = config