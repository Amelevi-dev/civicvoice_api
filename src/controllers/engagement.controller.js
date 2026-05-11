// src/controllers/engagement.controller.js

const Engagement = require('../models/engagement.model')
const User = require('../models/user.model')
const Consultation = require('../models/consultation.model')

const ALLOWED_STATUSES = [
   'pending',
   'in_progress',
   'completed',
   'cancelled'
]


/**
 * @desc    Créer un engagement
 * @route   POST /api/engagements
 * @access  Authority
 */
exports.createEngagement = async (req, res) => {

   try {

      const { consultationId, description } = req.body

      // Ne prendre que les champs attendus côté front
      // Vérifier que la consultation existe et appartient au même territoire que l'authority
      const consultation = await Consultation.findById(consultationId)
      if (!consultation) return res.status(404).send({ message: 'Consultation introuvable' })

      const authority = await User.findById(req.userId).select('role arrondissement quartier')
      if (!authority) return res.status(404).send({ message: 'Utilisateur introuvable' })
      if (authority.role !== 'authority') return res.status(403).send({ message: 'Accès refusé' })

      if (consultation.arrondissement !== authority.arrondissement || consultation.quartier !== authority.quartier) {
         return res.status(403).send({ message: 'Impossible de créer un engagement hors de votre territoire' })
      }

      const engagement = new Engagement({ consultationId, authorityId: req.userId, description, status: 'pending' })

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

      // Si authority connecté => filtrer par arrondissement/quartier
      if (req.userRole === 'authority' && req.userId) {
         const authority = await User.findById(req.userId).select('arrondissement quartier')
         if (!authority) return res.status(404).send({ message: 'Utilisateur introuvable' })

         // récupérer les userIds du même quartier
         const users = await User.find({ arrondissement: authority.arrondissement, quartier: authority.quartier }).select('_id')
         const ids = users.map(u => u._id)

         const engagements = await Engagement.find({ authorityId: { $in: ids } })
            .populate('consultationId')
            .populate('authorityId', 'institutionName arrondissement quartier name username')

         return res.status(200).send(engagements)
      }

      const engagements = await Engagement.find()
         .populate('consultationId')
         .populate('authorityId', 'institutionName arrondissement quartier name username')

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

      // Autorité propriétaire seulement
      if (engagement.authorityId.toString() !== req.userId) {
         return res.status(403).send({ message: 'Accès refusé' })
      }

      // Vérifier territorialité (sécurité supplémentaire)
      const authority = await User.findById(req.userId).select('arrondissement quartier role')
      if (!authority) return res.status(404).send({ message: 'Utilisateur introuvable' })
      if (authority.role !== 'authority') return res.status(403).send({ message: 'Accès refusé' })

      const engagementAuthor = await User.findById(engagement.authorityId).select('arrondissement quartier')
      if (!engagementAuthor) return res.status(404).send({ message: 'Auteur introuvable' })
      if (engagementAuthor.arrondissement !== authority.arrondissement || engagementAuthor.quartier !== authority.quartier) {
         return res.status(403).send({ message: 'Accès hors territoire' })
      }

      // Validation status
      if (req.body.status !== undefined) {
         if (!ALLOWED_STATUSES.includes(req.body.status)) {
            return res.status(400).send({ message: 'Status invalide' })
         }
         engagement.status = req.body.status
      }

      // Validation progress
      if (req.body.progress !== undefined) {
         const p = Number(req.body.progress)
         if (Number.isNaN(p) || p < 0 || p > 100) {
            return res.status(400).send({ message: 'Progress doit être entre 0 et 100' })
         }
         engagement.progress = p
      }

      // Mise à jour dueDate si fourni
      if (req.body.dueDate !== undefined) {
         const d = new Date(req.body.dueDate)
         if (isNaN(d.getTime())) {
            return res.status(400).send({ message: 'dueDate invalide' })
         }
         engagement.dueDate = d
      }

      await engagement.save()

      // Archivage automatique : si engagement terminé (status completed ou progress 100)
      try {
         if ( (engagement.status === 'completed') || (engagement.progress === 100) ) {
            const consultation = await Consultation.findById(engagement.consultationId)
            if (consultation && consultation.status === 'closed') {
               consultation.status = 'archived'
               await consultation.save()
            }
         }
      } catch (e) {
         console.error('Erreur lors de l\'archivage automatique de la consultation liée :', e.message)
      }

      return res.status(200).send({ message: 'Engagement mis à jour', engagement })

   } catch(error) {

      return res.status(500).send({
         message: error.message
      })

   }
}


/**
 * @desc    Récupérer un engagement par id
 * @route   GET /api/engagements/:id
 * @access  Public
 */
exports.getEngagementById = async (req, res) => {
   try {
      const engagement = await Engagement.findById(req.params.id)
         .populate('consultationId')
         .populate('authorityId', 'institutionName arrondissement quartier name username')

      if (!engagement) {
         return res.status(404).send({ message: 'Engagement introuvable' })
      }

      // Si authority connecté, vérifier territorialité
      if (req.userRole === 'authority' && req.userId) {
         const authority = await User.findById(req.userId).select('arrondissement quartier role')
         if (!authority) return res.status(404).send({ message: 'Utilisateur introuvable' })
         if (authority.role !== 'authority') return res.status(403).send({ message: 'Accès refusé' })

         const engagementAuthor = await User.findById(engagement.authorityId).select('arrondissement quartier')
         if (!engagementAuthor) return res.status(404).send({ message: 'Auteur introuvable' })
         if (engagementAuthor.arrondissement !== authority.arrondissement || engagementAuthor.quartier !== authority.quartier) {
            return res.status(403).send({ message: 'Accès hors territoire' })
         }
      }

      return res.status(200).send(engagement)
   } catch (error) {
      return res.status(500).send({ message: error.message })
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
         return res.status(404).send({ message: 'Engagement introuvable' })
      }

      // Autorité propriétaire seulement
      if (engagement.authorityId.toString() !== req.userId) {
         return res.status(403).send({ message: 'Accès refusé' })
      }

      // Vérifier territorialité
      const authority = await User.findById(req.userId).select('arrondissement quartier role')
      if (!authority) return res.status(404).send({ message: 'Utilisateur introuvable' })
      if (authority.role !== 'authority') return res.status(403).send({ message: 'Accès refusé' })

      const engagementAuthor = await User.findById(engagement.authorityId).select('arrondissement quartier')
      if (!engagementAuthor) return res.status(404).send({ message: 'Auteur introuvable' })
      if (engagementAuthor.arrondissement !== authority.arrondissement || engagementAuthor.quartier !== authority.quartier) {
         return res.status(403).send({ message: 'Accès hors territoire' })
      }

      await engagement.deleteOne()

      return res.status(200).send({ message: 'Engagement supprimé' })

   } catch(error) {

      return res.status(500).send({
         message: error.message
      })

   }
}