import { Router } from 'express'
import jwt from 'jsonwebtoken'
import create from './create'
import authenticate from './authenticate'
import logger from '../lib/logger'

const router = new Router()

// Service route /account/create
router.use('/create', create)

// Service route /account/authenticate
router.use('/authenticate', authenticate)

// Service route /account/expire
router.get('/expire', (req, res) => {
  req.session.destroy(err => {
    res.send('OK')
  })
})

// Service route /account/status
router.get('/status', (req, res) => {
  res.status(200).json({
    message: 'OK'
  })
})

export default router
