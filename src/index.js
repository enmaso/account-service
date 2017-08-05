require('dotenv').config()

import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import logger from './lib/logger'
import routes from './routes'
import passport from 'passport'
import redis from 'redis'
import connectRedis from 'connect-redis'
import session from 'express-session'

const app = express()
const PORT = process.env.PORT || 8080

const redisStore = connectRedis(session)
const redisClient = redis.createClient()

// Service middleware
app.use(require('morgan')('short', {stream: logger.stream}))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
//app.use(cookieParser(process.env.REDIS_SECRET))
app.use(passport.initialize())

// Redis Session
let sessionOpts = {
  secret: process.env.REDIS_SECRET,
  store: new redisStore({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    client: redisClient,
    disableTTL: true
  }),
  saveUninitialized: true,
  resave: false
}
app.use(session(sessionOpts))

// Mongo connection
let mongoOpts = {
  poolSize: Number(process.env.MONGO_POOLSIZE) || 4,
  useMongoClient: true
}
let mongoUri = `mongodb://${process.env.MONGO_HOST}/${process.env.MONGO_DB}`
mongoose.connect(mongoUri, mongoOpts)

// Service routes
app.use('/account', routes)

app.get('/favicon.ico', (req, res, next) => {
  next()
})

// If Route not found, 404
app.all('*', (req, res) => {
  res.status(404).json({
    message: 'Service Not Found'
  })
})

// Run service
app.listen(PORT, () => {
  logger.debug(`[${process.env.NODE_ENV}] Auth-Service ready on port ${PORT}`)
})

export default app
