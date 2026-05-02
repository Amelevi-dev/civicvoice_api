// src/controllers/consultation.controller.js

const Consultation = require('../models/consultation.model')


/**
 * @desc    Créer une consultation
 * @route   POST /api/consultations
 * @access  Admin
 */
exports.createConsultation = async (req, res) => {

   try {

      const {
         title,
         description,
         arrondissement,
         startDate,
         endDate
      } = req.body

      const consultation = new Consultation({
         title,
         description,
         arrondissement,
         startDate,
         endDate,
         createdBy: req.userId,
         status: "active"
      })

      await consultation.save()

      return res.status(201).send({
         message: "Consultation créée avec succès",
         consultation
      })

   } catch(error) {

      return res.status(500).send({
         message: error.message
      })

   }
}


/**
 * @desc    Récupérer toutes les consultations
 * @route   GET /api/consultations
 * @access  Public
 */
exports.getConsultations = async (req, res) => {

   try {

      const consultations = await Consultation.find()
         .populate('createdBy', 'name username')

      return res.status(200).send(consultations)

   } catch(error) {

      return res.status(500).send({
         message: error.message
      })

   }
}


/**
 * @desc    Récupérer une consultation
 * @route   GET /api/consultations/:id
 * @access  Public
 */
exports.getConsultationById = async (req, res) => {

   try {

      const consultation = await Consultation.findById(req.params.id)
         .populate('createdBy', 'name username')

      if (!consultation) {

         return res.status(404).send({
            message: "Consultation introuvable"
         })

      }

      return res.status(200).send(consultation)

   } catch(error) {

      return res.status(500).send({
         message: error.message
      })

   }
}


/**
 * @desc    Modifier une consultation
 * @route   PUT /api/consultations/:id
 * @access  Admin
 */
exports.updateConsultation = async (req, res) => {

   try {

      const consultation = await Consultation.findById(req.params.id)

      if (!consultation) {

         return res.status(404).send({
            message: "Consultation introuvable"
         })

      }

      consultation.title =
         req.body.title || consultation.title

      consultation.description =
         req.body.description || consultation.description

      consultation.arrondissement =
         req.body.arrondissement || consultation.arrondissement

      consultation.startDate =
         req.body.startDate || consultation.startDate

      consultation.endDate =
         req.body.endDate || consultation.endDate

      await consultation.save()

      return res.status(200).send({
         message: "Consultation modifiée avec succès",
         consultation
      })

   } catch(error) {

      return res.status(500).send({
         message: error.message
      })

   }
}


/**
 * @desc    Fermer une consultation
 * @route   PATCH /api/consultations/:id/close
 * @access  Admin
 */
exports.closeConsultation = async (req, res) => {

   try {

      const consultation = await Consultation.findById(req.params.id)

      if (!consultation) {

         return res.status(404).send({
            message: "Consultation introuvable"
         })

      }

      consultation.status = "closed"

      await consultation.save()

      return res.status(200).send({
         message: "Consultation fermée avec succès"
      })

   } catch(error) {

      return res.status(500).send({
         message: error.message
      })

   }
}


/**
 * @desc    Supprimer une consultation
 * @route   DELETE /api/consultations/:id
 * @access  Admin
 */
exports.deleteConsultation = async (req, res) => {

   try {

      const consultation = await Consultation.findById(req.params.id)

      if (!consultation) {

         return res.status(404).send({
            message: "Consultation introuvable"
         })

      }

      await consultation.deleteOne()

      return res.status(200).send({
         message: "Consultation supprimée"
      })

   } catch(error) {

      return res.status(500).send({
         message: error.message
      })

   }
}