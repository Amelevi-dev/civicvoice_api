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
      return res.status(500).send({ message: error.message })
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
         return res.status(404).send({ message: "Utilisateur introuvable" })
      }
      return res.status(200).send(user)
   } catch(error) {
      return res.status(500).send({ message: error.message })
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
         return res.status(404).send({ message: "Utilisateur introuvable" })
      }

      user.name = name || user.name
      user.username = username || user.username
      user.email = email || user.email
      user.emailOrPhone = emailOrPhone || user.emailOrPhone
      user.sexe = sexe || user.sexe
      user.age = age || user.age
      user.arrondissement = arrondissement || user.arrondissement

      await user.save()
      return res.status(200).send({ message: "Utilisateur modifié avec succès", user })
   } catch(error) {
      return res.status(500).send({ message: error.message })
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
         return res.status(404).send({ message: "Utilisateur introuvable" })
      }
      user.status = false
      await user.save()
      return res.status(200).send({ message: "Utilisateur désactivé avec succès" })
   } catch(error) {
      return res.status(500).send({ message: error.message })
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
         return res.status(404).send({ message: "Utilisateur introuvable" })
      }
      return res.status(200).send(user)
   } catch(error) {
      return res.status(500).send({ message: error.message })
   }
}

/**
 * @desc    Enregistrer le NINA (Déclaratif pour prototype)
 * @route   POST /api/users/verify-nina
 * @access  Citizen
 */
exports.verifyNina = async (req, res) => {
    try {
        const { ninaNumber } = req.body;

        // Vérification de base (format NINA malien standard)
        if (!ninaNumber || ninaNumber.length < 10) {
            return res.status(400).json({ message: "Numéro NINA incomplet ou invalide" });
        }

        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

        user.ninaNumber = ninaNumber;
        user.isVerified = true; // On marque comme vérifié par défaut pour le prototype
        await user.save();

        res.status(200).json({ 
            message: "Votre NINA a été enregistré. Identité certifiée (mode prototype).",
            isVerified: true,
            ninaNumber: user.ninaNumber
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Ce numéro NINA est déjà utilisé par un autre compte." });
        }
        res.status(500).json({ message: error.message });
    }
};