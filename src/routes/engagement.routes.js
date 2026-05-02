// src/routes/engagement.routes.js

const router = require('express').Router()

const engagementController =
require('../controllers/engagement.controller')

const {
   verifyToken
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
   engagementController.getEngagements
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