const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user.model')

const tokenService = require('./token.service')

exports.signup = async (data) => {

   const {
      name,
      sexe,
      age,
      emailOrPhone,
      email,
      username,
      password,
      role,
      arrondissement,
      quartier,
      institutionName,
      institutionType,
      managerName,
      managerRole
   } = data

   const existingUser = await User.findOne({
      $or: [
         { username },
         { email },
         { emailOrPhone }
      ]
   })

   if (existingUser) {
      throw new Error("Utilisateur déjà existant")
   }

   const hashedPassword = bcrypt.hashSync(password, 12)

   const userData = {
      name,
      sexe,
      age,
      emailOrPhone,
      email,
      username,
      password: hashedPassword,
      role,
      arrondissement,
      quartier
   }

   if (role === 'authority') {
      userData.institutionName = institutionName
      userData.institutionType = institutionType
      userData.managerName = managerName
      userData.managerRole = managerRole
   }

   const user = new User(userData)

   await user.save()

   return {
      message: "Compte créé avec succès"
   }
}

exports.signin = async (data) => {

   const { username, password, isMobile } = data

   const query = {
      $or: [
         { username },
         { emailOrPhone: username },
         { email: username }
      ]
   }

   const user = await User.findOne(query)

   if (!user) {
      const error = new Error("Utilisateur non trouvé")
      error.statusCode = 401
      throw error
   }

   const passwordIsValid = bcrypt.compareSync(
      password,
      user.password
   )

   if (!passwordIsValid) {
      const error = new Error("Mot de passe incorrect")
      error.statusCode = 401
      throw error
   }

   const tokens = tokenService.generateTokens(
      user,
      isMobile
   )

   return {
      user: {
         id: user._id,
         name: user.name,
         username: user.username,
         email: user.email,
         emailOrPhone: user.emailOrPhone,
         role: user.role,
         arrondissement: user.arrondissement,
         quartier: user.quartier
      },
      ...tokens
   }
}

exports.forgotPassword = async (data) => {

   const { username, newPassword } = data

   const user = await User.findOne({
      $or: [
         { email: username },
         { emailOrPhone: username },
         { username: username }
      ]
   })

   if (!user) {
      throw new Error("Utilisateur introuvable")
   }

   user.password = bcrypt.hashSync(newPassword, 12)

   await user.save()

   return {
      message: "Mot de passe modifié avec succès"
   }
}

exports.resetPassword = async (data) => {

   const {
      username,
      password
   } = data

   const user = await User.findOne({
      $or: [
         { email: username },
         { emailOrPhone: username },
         { username: username }
      ]
   })

   if (!user) {
      throw new Error("Utilisateur introuvable")
   }

   user.password = bcrypt.hashSync(password, 12)

   await user.save()

   return {
      message: "Mot de passe réinitialisé"
   }
}

exports.refresh = async (refreshToken) => {

   const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
   )

   const user = await User.findById(decoded.id)

   if (!user) {
      throw new Error("Utilisateur introuvable")
   }

   const tokens = tokenService.generateTokens(
      user,
      false
   )

   return tokens
}