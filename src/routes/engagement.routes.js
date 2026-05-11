// src/routes/engagement.routes.js

const router = require('express').Router()

const engagementController =
require('../controllers/engagement.controller')

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
   engagementController.createEngagement
)

router.get(
   '/',
   verifyTokenOptional,
   engagementController.getEngagements
)

router.get(
   '/:id',
   verifyTokenOptional,
   engagementController.getEngagementById
)

router.patch(
   '/:id',
   verifyToken,
   isAuthority,
   engagementController.updateEngagementStatus
)

router.delete(
   '/:id',
   verifyToken,
   isAuthority,
   engagementController.deleteEngagement
)

module.exports = router