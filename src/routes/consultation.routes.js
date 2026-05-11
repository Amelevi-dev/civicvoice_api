// src/routes/consultation.routes.js

const router = require('express').Router()

const consultationController =
require('../controllers/consultation.controller')

const {
   verifyToken,
   verifyTokenOptional
} = require('../middlewares/auth.middleware')

const {
   isAuthority
} = require('../middlewares/role.middleware')

router.post(
   '/',
   verifyToken,
   isAuthority,
   consultationController.createConsultation
)

router.get(
   '/',
   verifyTokenOptional,
   consultationController.getConsultations
)

router.get(
   '/:id',
   verifyTokenOptional,
   consultationController.getConsultationById
)

router.put(
   '/:id',
   verifyToken,
   isAuthority,
   consultationController.updateConsultation
)

router.patch(
   '/:id/close',
   verifyToken,
   isAuthority,
   consultationController.closeConsultation
)

router.patch(
   '/:id/archive',
   verifyToken,
   isAuthority,
   consultationController.archiveConsultation
)

router.delete(
   '/:id',
   verifyToken,
   isAuthority,
   consultationController.deleteConsultation
)

module.exports = router