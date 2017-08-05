import { Router } from 'express'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import { Strategy } from 'passport-local'

import logger from '../lib/logger'
import Account from '../lib/account'

passport.serializeUser(function (user, done) {
  done(null, user.id)
})
passport.deserializeUser(function (obj, done) {
  done(null, obj)
})
passport.use(new Strategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  // Validate email and password
  if(!validator.isEmail(email) || !validator.isLength(password, 4)) {
    return done(null, false)
  }
  Account.findOne({
    email: email
  })
  .then(account => {
    if(account === null) {
      logger.warn(new Error('Account Not Found'))
      return done(null, false)
    } else {
      if(!Account.match(password, account.password)) {
        logger.warn(new Error('Invalid Password'))
        return done(null, false)
      } else {
        return done(null, account)
      }
    }
  })
  .catch(err => {
    logger.error(err)
    return done(err, false)
  })
}))

const router = Router()

router.post('/', passport.authenticate('local'), (req, res) => {
  res.send({
    account: req.user,
    session: req.session 
  })
})

/*
router.post('/', (req, res) => {
  let params = _.pick(req.body, 'email', 'password')
  if(!params.email || !params.password) {
    // Missing email and/or password fields
    logger.error('Missing parameters')
    res.status(400).json({
      success: false,
      message: 'Missing parameters'
    })
  } else if(!validator.isEmail(params.email) || !validator.isLength(params.password, 4)) {
    // Invalid email and/or password
    logger.warn('Invalid email and/or password')
    res.status(400).json({
      success: false,
      message: 'Invalid email and/or password'
    })
  } else {
    Account.findOne({
      email: params.email
    })
    .then(account => {
      if(account == null) {
        // No account found
        logger.warn('Account not found')
        res.status(404).json({
          success: false,
          message: 'Account not found'
        })
      } else if(!Account.match(params.password, account.password)) {
        // Account found, but invalid password
        logger.warn('Invalid password')
        res.status(400).json({
          success: false,
          message: 'Invalid password'
        })
      } else {



        // Account found and authenticated
        let exp = new Date(Date.now() + 2592000)
        let key = account.key



        // Create session

        let payload = {
          sub: account._id,
          email: account.email
        }
        let token = jwt.sign(payload, account.key)
        let opts = {
          expires: new Date(Date.now() + 2592000),
          httpOnly: true,
          secure: process.env.NODE_ENV == 'production'
        }
        res.cookie('token', token, opts)
        res.status(200).json({
          success: true,
          account: account
        })



      }
    })
    .catch(err => {
      logger.error(err)
      res.status(500).json({
        success: false,
        message: 'Internal Server Error'
      })
    })
  }
})
*/

export default router
