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

export default router
