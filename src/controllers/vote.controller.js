// src/controllers/vote.controller.js

const Vote = require('../models/vote.model')
const Consultation = require('../models/consultation.model')
const blockchainService = require('../services/blockchain.service');
const User = require('../models/user.model')

/**
 * @desc    Soumettre un vote
 * @route   POST /api/votes
 * @access  Citizen
 */
exports.submitVote = async (req, res) => {

   try {

      const {
         consultationId,
         choice
      } = req.body

      const user = await User.findById(req.userId);
      if (!user.isVerified) {
          return res.status(403).json({
              message: "Votre identité n'est pas certifiée (NINA requis). Seuls les citoyens vérifiés peuvent voter."
          });
      }

      const consultation = await Consultation.findById(
...
         consultationId
      )

      if (!consultation) {

         return res.status(404).send({
            message: "Consultation introuvable"
         })

      }

      if (consultation.status === "closed") {

         return res.status(400).send({
            message: "Cette consultation est fermée"
         })

      }

      const existingVote = await Vote.findOne({
         userId: req.userId,
         consultationId
      })

      if (existingVote) {

         return res.status(400).send({
            message: "Vous avez déjà voté"
         })

      }

      const vote = new Vote({
         userId: req.userId,
         consultationId,
         choice
      })

      await vote.save();

      // Blockchain Integration: Add vote to ledger
      const block = await blockchainService.addBlock({
          type: 'VOTE',
          voteId: vote._id,
          consultationId: vote.consultationId,
          choice: vote.choice,
          timestamp: vote.createdAt
      });

      return res.status(201).send({
         message: "Vote enregistré avec succès et scellé sur la blockchain",
         blockchainHash: block.hash
      })

   } catch(error) {

      return res.status(500).send({
         message: error.message
      })

   }
}


/**
 * @desc    Résultats d'une consultation
 * @route   GET /api/votes/results/:consultationId
 * @access  Public
 */
exports.getResults = async (req, res) => {

   try {

      const consultationId = req.params.consultationId

      const yes = await Vote.countDocuments({
         consultationId,
         choice: "yes"
      })

      const no = await Vote.countDocuments({
         consultationId,
         choice: "no"
      })

      const abstain = await Vote.countDocuments({
         consultationId,
         choice: "abstain"
      })

      const total = yes + no + abstain

      return res.status(200).send({
         total,
         yes,
         no,
         abstain
      })

   } catch(error) {

      return res.status(500).send({
         message: error.message
      })

   }
}


/**
 * @desc    Vérifier si utilisateur a voté
 * @route   GET /api/votes/check/:consultationId
 * @access  Citizen
 */
exports.checkUserVote = async (req, res) => {

   try {

      const consultationId = req.params.consultationId

      const vote = await Vote.findOne({
         userId: req.userId,
         consultationId
      })

      return res.status(200).send({
         voted: !!vote,
         vote
      })

   } catch(error) {

      return res.status(500).send({
         message: error.message
      })

   }
}