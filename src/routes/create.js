import { Router } from 'express'
import validator from 'validator'
import _ from 'lodash'
import logger from '../lib/logger'
import Account from '../lib/account'

const router = Router()

router.post('/', (req, res) => {
  let params = _.pick(req.body, 'email', 'password')
  if(!params.email || !params.password) {
    // Missing email and/or password fields
    logger.error('Missing Parameters')
    res.status(400).send({
      status: 400,
      error: 'Missing Parameters',
      timestamp: new Date
    })
  } else if(!validator.isEmail(params.email) || !validator.isLength(params.password, 4)) {
    // Invalid email and/or password
    logger.warn('Invalid Credentials')
    res.status(400).send({
      status: 400,
      error: 'Invalid Credentials',
      timestamp: new Date
    })
  } else {
    // Ok, let's create an account with params
    let account = new Account()
    account.email = params.email
    account.password = params.password
    account.save(err => {
      if(err) {
        if(err.code === 11000) {
          logger.warn('Account Exists')
          res.status(400).send({
            status: 400,
            error: 'Account Exists',
            timestamp: new Date
          })
        } else {
          logger.error(err)
          res.status(500).send({
            status: 500,
            error: 'Internal Server Error',
            timestamp: new Date
          })
        }
      } else {
        res.status(201).send({
          status: 201,
          account: account
        })
      }
    })
  }
})


export default router
