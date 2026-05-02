// src/controllers/engagement.controller.js

const Engagement = require('../models/engagement.model')


/**
 * @desc    Créer un engagement
 * @route   POST /api/engagements
 * @access  Authority
 */
exports.createEngagement = async (req, res) => {

   try {

      const {
         consultationId,
         content
      } = req.body

      const engagement = new Engagement({
         consultationId,
         authorityId: req.userId,
         content,
         status: "en cours"
      })

      await engagement.save()

      return res.status(201).send({
         message: "Engagement créé avec succès",
         engagement
      })

   } catch(error) {

      return res.status(500).send({
         message: error.message
      })

   }
}


/**
 * @desc    Liste des engagements
 * @route   GET /api/engagements
 * @access  Public
 */
exports.getEngagements = async (req, res) => {

   try {

      const engagements = await Engagement.find()
         .populate('consultationId')
         .populate('authorityId', 'name username')

      return res.status(200).send(engagements)

   } catch(error) {

      return res.status(500).send({
         message: error.message
      })

   }
}


/**
 * @desc    Modifier statut engagement
 * @route   PATCH /api/engagements/:id
 * @access  Authority
 */
exports.updateEngagementStatus = async (req, res) => {

   try {

      const engagement = await Engagement.findById(
         req.params.id
      )

      if (!engagement) {

         return res.status(404).send({
            message: "Engagement introuvable"
         })

      }

      engagement.status =
         req.body.status || engagement.status

      await engagement.save()

      return res.status(200).send({
         message: "Statut mis à jour",
         engagement
      })

   } catch(error) {

      return res.status(500).send({
         message: error.message
      })

   }
}


/**
 * @desc    Supprimer engagement
 * @route   DELETE /api/engagements/:id
 * @access  Authority
 */
exports.deleteEngagement = async (req, res) => {

   try {

      const engagement = await Engagement.findById(
         req.params.id
      )

      if (!engagement) {

         return res.status(404).send({
            message: "Engagement introuvable"
         })

      }

      await engagement.deleteOne()

      return res.status(200).send({
         message: "Engagement supprimé"
      })

   } catch(error) {

      return res.status(500).send({
         message: error.message
      })

   }
}