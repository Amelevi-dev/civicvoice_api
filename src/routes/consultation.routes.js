// src/routes/consultation.routes.js

const router = require('express').Router()

const consultationController =
require('../controllers/consultation.controller')

const {
   verifyToken
} = require('../middlewares/auth.middleware')

const {
   isAdmin
} = require('../middlewares/role.middleware')

router.post(
   '/',
   verifyToken,
   isAdmin,
   consultationController.createConsultation
)

router.get(
   '/',
   verifyToken,
   consultationController.getConsultations
)

router.get(
   '/active',
   verifyToken,
   consultationController.getActiveConsultations
)

router.get(
   '/:id',
   consultationController.getConsultationById
)

router.put(
   '/:id',
   verifyToken,
   isAdmin,
   consultationController.updateConsultation
)

router.patch(
   '/:id/close',
   verifyToken,
   isAdmin,
   consultationController.closeConsultation
)

router.delete(
   '/:id',
   verifyToken,
   isAdmin,
   consultationController.deleteConsultation
)

module.exports = router