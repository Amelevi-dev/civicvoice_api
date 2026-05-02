// src/controllers/user.controller.js

const User = require('../models/user.model')

/**
 * @desc    Récupérer tous les utilisateurs
 * @route   GET /api/users
 * @access  Admin
 */
exports.getUsers = async (req, res) => {

   try {

      const users = await User.find()
         .select('-password')

      return res.status(200).send(users)

   } catch(error) {

      return res.status(500).send({
         message: error.message
      })

   }
}


/**
 * @desc    Récupérer un utilisateur par ID
 * @route   GET /api/users/:id
 * @access  Admin / Utilisateur concerné
 */
exports.getUserById = async (req, res) => {

   try {

      const user = await User.findById(req.params.id)
         .select('-password')

      if (!user) {

         return res.status(404).send({
            message: "Utilisateur introuvable"
         })

      }

      return res.status(200).send(user)

   } catch(error) {

      return res.status(500).send({
         message: error.message
      })

   }
}


/**
 * @desc    Modifier un utilisateur
 * @route   PUT /api/users/:id
 * @access  Admin / Utilisateur concerné
 */
exports.updateUser = async (req, res) => {

   try {

      const {
         name,
         username,
         email,
         emailOrPhone,
         sexe,
         age,
         arrondissement
      } = req.body

      const user = await User.findById(req.params.id)

      if (!user) {

         return res.status(404).send({
            message: "Utilisateur introuvable"
         })

      }

      user.name = name || user.name
      user.username = username || user.username
      user.email = email || user.email
      user.emailOrPhone = emailOrPhone || user.emailOrPhone
      user.sexe = sexe || user.sexe
      user.age = age || user.age
      user.arrondissement = arrondissement || user.arrondissement

      await user.save()

      return res.status(200).send({
         message: "Utilisateur modifié avec succès",
         user
      })

   } catch(error) {

      return res.status(500).send({
         message: error.message
      })

   }
}


/**
 * @desc    Désactiver un utilisateur
 * @route   DELETE /api/users/:id
 * @access  Admin
 */
exports.deleteUser = async (req, res) => {

   try {

      const user = await User.findById(req.params.id)

      if (!user) {

         return res.status(404).send({
            message: "Utilisateur introuvable"
         })

      }

      // Soft delete
      user.status = false

      await user.save()

      return res.status(200).send({
         message: "Utilisateur désactivé avec succès"
      })

   } catch(error) {

      return res.status(500).send({
         message: error.message
      })

   }
}


/**
 * @desc    Récupérer le profil connecté
 * @route   GET /api/users/profile/me
 * @access  Utilisateur connecté
 */
exports.getMyProfile = async (req, res) => {

   try {

      const user = await User.findById(req.userId)
         .select('-password')

      if (!user) {

         return res.status(404).send({
            message: "Utilisateur introuvable"
         })

      }

      return res.status(200).send(user)

   } catch(error) {

      return res.status(500).send({
         message: error.message
      })

   }
}