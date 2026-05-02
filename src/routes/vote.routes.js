// src/routes/vote.routes.js

const router = require('express').Router()

const voteController =
require('../controllers/vote.controller')

const {
   verifyToken
} = require('../middlewares/auth.middleware')

router.post(
   '/',
   verifyToken,
   voteController.submitVote
)

router.get(
   '/results/:consultationId',
   voteController.getResults
)

router.get(
   '/check/:consultationId',
   verifyToken,
   voteController.checkUserVote
)

module.exports = router