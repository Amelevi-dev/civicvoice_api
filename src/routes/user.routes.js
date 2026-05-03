// src/routes/user.routes.js

const router = require('express').Router()

const userController = require('../controllers/user.controller')

const {
   verifyToken,
   isAdmin
} = require('../middlewares/auth.middleware')

router.get(
   '/',
   verifyToken,
   isAdmin,
   userController.getUsers
)

router.get(
   '/profile/me',
   verifyToken,
   userController.getMyProfile
)

router.post(
    '/verify-nina',
    verifyToken,
    userController.verifyNina
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

router.put(
    '/:id/approve',
    verifyToken,
    isAdmin,
    userController.approveUser
 )

router.delete(
   '/:id',
   verifyToken,
   isAdmin,
   userController.deleteUser
)

module.exports = router