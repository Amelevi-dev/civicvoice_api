// src/routes/user.routes.js

const router = require('express').Router()

const userController = require('../controllers/user.controller')

const {
   verifyToken
} = require('../middlewares/auth.middleware')

router.get(
   '/',
   verifyToken,
   userController.getUsers
)

router.get(
   '/profile/me',
   verifyToken,
   userController.getMyProfile
)

router.get(
   '/:id',
   verifyToken,
   userController.getUserById
)

router.put(
   '/:id',
   verifyToken,
   userController.updateUser
)

router.delete(
   '/:id',
   verifyToken,
   userController.deleteUser
)

module.exports = router