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
 * @desc    Résultats d'une consultation avec statistiques démographiques
 * @route   GET /api/votes/results/:consultationId
 * @access  Public
 */
exports.getResults = async (req, res) => {
   try {
      const { consultationId } = req.params;
      const mongoose = require('mongoose');

      // 1. Statistiques globales par choix
      const globalStats = await Vote.aggregate([
         { $match: { consultationId: new mongoose.Types.ObjectId(consultationId) } },
         { $group: { _id: "$choice", count: { $sum: 1 } } }
      ]);

      const results = {
         yes: 0,
         no: 0,
         abstain: 0,
         total: 0,
         demographics: {
            gender: { male: 0, female: 0, other: 0 },
            age: { "18-25": 0, "26-35": 0, "36-50": 0, "50+": 0 }
         }
      };

      globalStats.forEach(stat => {
         results[stat._id] = stat.count;
         results.total += stat.count;
      });

      // 2. Statistiques démographiques (seulement si des votes existent)
      if (results.total > 0) {
         const demographicStats = await Vote.aggregate([
            { $match: { consultationId: new mongoose.Types.ObjectId(consultationId) } },
            {
               $lookup: {
                  from: 'users',
                  localField: 'userId',
                  foreignField: '_id',
                  as: 'user'
               }
            },
            { $unwind: "$user" },
            {
               $group: {
                  _id: null,
                  male: { $sum: { $cond: [{ $eq: ["$user.sexe", "Homme"] }, 1, 0] } },
                  female: { $sum: { $cond: [{ $eq: ["$user.sexe", "Femme"] }, 1, 0] } },
                  other: { $sum: { $cond: [{ $in: ["$user.sexe", ["n/A", null]] }, 1, 0] } },
                  age18_25: { 
                     $sum: { 
                        $cond: [
                           { $and: [{ $gte: [{ $toInt: "$user.age" }, 18] }, { $lte: [{ $toInt: "$user.age" }, 25] }] }, 
                           1, 0
                        ] 
                     } 
                  },
                  age26_35: { 
                     $sum: { 
                        $cond: [
                           { $and: [{ $gt: [{ $toInt: "$user.age" }, 25] }, { $lte: [{ $toInt: "$user.age" }, 35] }] }, 
                           1, 0
                        ] 
                     } 
                  },
                  age36_50: { 
                     $sum: { 
                        $cond: [
                           { $and: [{ $gt: [{ $toInt: "$user.age" }, 35] }, { $lte: [{ $toInt: "$user.age" }, 50] }] }, 
                           1, 0
                        ] 
                     } 
                  },
                  age50Plus: { $sum: { $cond: [{ $gt: [{ $toInt: "$user.age" }, 50] }, 1, 0] } }
               }
            }
         ]);

         if (demographicStats.length > 0) {
            const ds = demographicStats[0];
            results.demographics.gender = { male: ds.male, female: ds.female, other: ds.other };
            results.demographics.age = {
               "18-25": ds.age18_25,
               "26-35": ds.age26_35,
               "36-50": ds.age36_50,
               "50+": ds.age50Plus
            };
         }
      }

      return res.status(200).send(results);

   } catch(error) {
      console.error("Aggregation error:", error);
      return res.status(500).send({
         message: error.message
      });
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

/**
 * @desc    Get all votes of the logged in user
 * @route   GET /api/votes/my-votes
 * @access  Citizen
 */
exports.getMyVotes = async (req, res) => {
    try {
        const votes = await Vote.find({ userId: req.userId })
            .populate('consultationId')
            .sort({ createdAt: -1 });

        return res.status(200).send(votes);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}