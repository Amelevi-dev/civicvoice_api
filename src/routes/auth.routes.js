
const router = require('express').Router()

const authController = require('../controllers/auth.controller')

router.post('/signup', authController.signup)

router.post('/signin', authController.signin)

router.post('/forgot-password', authController.forgotPassword)

router.post('/reset-password', authController.resetPassword)

router.post('/refresh', authController.refresh)

module.exports = router