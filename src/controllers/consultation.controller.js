// src/controllers/consultation.controller.js

const Consultation = require('../models/consultation.model')
const User = require('../models/user.model')
const Engagement = require('../models/engagement.model')


/**
 * @desc    Créer une consultation
 * @route   POST /api/consultations
 * @access  Admin
 */

exports.createConsultation = async (req, res) => {
   // --- AJOUT DES LOGS ICI ---
   console.log("=== NOUVELLE REQUÊTE DE CRÉATION ===");
   console.log("BODY REÇU :", req.body);
   console.log("USER ID (via middleware auth) :", req.userId);
   console.log("=====================================");

   try {

      const {
         title,
         description,
         startDate,
         endDate
      } = req.body

      // Récupérer les infos territoriales depuis le compte authority
      const authority = await User.findById(req.userId).select('arrondissement quartier role')
      if (!authority) return res.status(404).send({ message: 'Utilisateur introuvable' })
      if (authority.role !== 'authority') return res.status(403).send({ message: 'Accès refusé' })

      const consultation = new Consultation({
         title,
         description,
         arrondissement: authority.arrondissement,
         quartier: authority.quartier,
         startDate,
         endDate,
         createdBy: req.userId,
         status: 'active'
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

      // Si l'appel vient d'une authority connectée, on filtre sur son arrondissement/quartier
      if (req.userRole === 'authority' && req.userId) {
         const authority = await User.findById(req.userId).select('arrondissement quartier')
         if (!authority) return res.status(404).send({ message: 'Utilisateur introuvable' })

         const consultations = await Consultation.find({
            arrondissement: authority.arrondissement,
            quartier: authority.quartier
         }).populate('createdBy', 'name username')

         return res.status(200).send(consultations)
      }

      const consultations = await Consultation.find().populate('createdBy', 'name username')
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

      // Si user authority connecté, vérifier territorialité
      if (req.userRole === 'authority' && req.userId) {
         const authority = await User.findById(req.userId).select('arrondissement quartier')
         if (!authority) return res.status(404).send({ message: 'Utilisateur introuvable' })
         if (consultation.arrondissement !== authority.arrondissement || consultation.quartier !== authority.quartier) {
            return res.status(403).send({ message: 'Accès refusé' })
         }
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

      // Vérifier que l'autority est le propriétaire et dans le même quartier
      const authority = await User.findById(req.userId).select('role arrondissement quartier')
      if (!authority) return res.status(404).send({ message: 'Utilisateur introuvable' })
      if (authority.role !== 'authority') return res.status(403).send({ message: 'Accès refusé' })

      if (consultation.createdBy.toString() !== req.userId) {
         return res.status(403).send({ message: 'Vous n\'êtes pas le propriétaire de cette consultation' })
      }

      if (consultation.arrondissement !== authority.arrondissement || consultation.quartier !== authority.quartier) {
         return res.status(403).send({ message: 'Accès hors territoire' })
      }

      consultation.title = req.body.title || consultation.title
      consultation.description = req.body.description || consultation.description
      consultation.startDate = req.body.startDate || consultation.startDate
      consultation.endDate = req.body.endDate || consultation.endDate

      await consultation.save()

      return res.status(200).send({ message: 'Consultation modifiée avec succès', consultation })

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

      // Vérifier territorialité et ownership
      const authority = await User.findById(req.userId).select('role arrondissement quartier')
      if (!authority) return res.status(404).send({ message: 'Utilisateur introuvable' })
      if (authority.role !== 'authority') return res.status(403).send({ message: 'Accès refusé' })

      if (consultation.createdBy.toString() !== req.userId) {
         return res.status(403).send({ message: 'Vous n\'êtes pas le propriétaire de cette consultation' })
      }

      if (consultation.arrondissement !== authority.arrondissement || consultation.quartier !== authority.quartier) {
         return res.status(403).send({ message: 'Accès hors territoire' })
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
 * @desc    Archiver une consultation
 * @route   PATCH /api/consultations/:id/archive
 * @access  Authority
 */
exports.archiveConsultation = async (req, res) => {

   try {

      const consultation = await Consultation.findById(req.params.id)

      if (!consultation) {

         return res.status(404).send({
            message: "Consultation introuvable"
         })

      }
      // Vérifier territorialité et ownership avant archivage
      const authority = await User.findById(req.userId).select('role arrondissement quartier')
      if (!authority) return res.status(404).send({ message: 'Utilisateur introuvable' })
      if (authority.role !== 'authority') return res.status(403).send({ message: 'Accès refusé' })

      if (consultation.createdBy.toString() !== req.userId) {
         return res.status(403).send({ message: 'Vous n\'êtes pas le propriétaire de cette consultation' })
      }

      if (consultation.arrondissement !== authority.arrondissement || consultation.quartier !== authority.quartier) {
         return res.status(403).send({ message: 'Accès hors territoire' })
      }

      // Vérifier règles d'archivage : consultation doit être closed
      if (consultation.status !== 'closed') {
         return res.status(400).send({ message: 'La consultation doit être fermée avant d\'être archivée' })
      }

      // Trouver au moins un engagement lié complété ou progress=100
      const engagement = await Engagement.findOne({ consultationId: consultation._id, $or: [ { status: 'completed' }, { progress: 100 } ] })
      if (!engagement) {
         return res.status(400).send({ message: 'Aucun engagement terminé lié à cette consultation. Impossible d\'archiver.' })
      }

      consultation.status = 'archived'
      await consultation.save()

      return res.status(200).send({ message: 'Consultation archivée avec succès' })

   } catch(error) {

      return res.status(500).send({
         message: error.message
      })

   }
}


/**
 * @desc    Supprimer une consultation
 * @route   DELETE /api/consultations/:id
 * @access  Authority
 */
exports.deleteConsultation = async (req, res) => {

   try {

      const consultation = await Consultation.findById(req.params.id)

      if (!consultation) {

         return res.status(404).send({
            message: "Consultation introuvable"
         })

      }

      // Vérifier ownership et territorialité
      const authority = await User.findById(req.userId).select('role arrondissement quartier')
      if (!authority) return res.status(404).send({ message: 'Utilisateur introuvable' })
      if (authority.role !== 'authority') return res.status(403).send({ message: 'Accès refusé' })

      if (consultation.createdBy.toString() !== req.userId) {
         return res.status(403).send({ message: 'Vous n\'êtes pas le propriétaire de cette consultation' })
      }

      if (consultation.arrondissement !== authority.arrondissement || consultation.quartier !== authority.quartier) {
         return res.status(403).send({ message: 'Accès hors territoire' })
      }

      await consultation.deleteOne()

      return res.status(200).send({ message: 'Consultation supprimée' })

   } catch(error) {

      return res.status(500).send({
         message: error.message
      })

   }
}