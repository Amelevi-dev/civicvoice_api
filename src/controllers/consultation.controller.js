// src/controllers/consultation.controller.js

const Consultation = require('../models/consultation.model')
const blockchainService = require('../services/blockchain.service');

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

      await consultation.save();

      // Blockchain Integration: Seal the creation of the consultation
      await blockchainService.addBlock({
          type: 'CONSULTATION_CREATED',
          consultationId: consultation._id,
          title: consultation.title,
          arrondissement: consultation.arrondissement,
          creatorId: req.userId
      });

      return res.status(201).send({
         message: "Consultation créée et scellée sur la blockchain",
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
 * @access  Public (Filtered for Authorities)
 */
exports.getConsultations = async (req, res) => {

   try {
      let query = {};
      
      // If the request is authenticated and the user is an authority, filter by their arrondissement
      if (req.userRole === "authority" && req.userArrondissement) {
         query.arrondissement = req.userArrondissement;
      }

      const consultations = await Consultation.find(query)
         .populate('createdBy', 'name username')

      return res.status(200).send(consultations)

   } catch(error) {

      return res.status(500).send({
         message: error.message
      })

   }
}


/**
 * @desc    Récupérer les consultations actives (pour mobile)
 * @route   GET /api/consultations/active
 * @access  Public (Filtered if token present)
 */
exports.getActiveConsultations = async (req, res) => {

   try {
      let query = { status: "active" };

      // If user is authenticated (mobile citizen), filter by their arrondissement
      if (req.userArrondissement) {
         query.arrondissement = req.userArrondissement;
      }

      const consultations = await Consultation.find(query)
         .populate('createdBy', 'name')
         .sort({ createdAt: -1 })

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