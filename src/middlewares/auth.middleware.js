// src/middlewares/auth.middleware.js

const jwt = require('jsonwebtoken')

exports.verifyToken = (req, res, next) => {

   try {

      let token = req.headers.authorization

      if (!token) {

         return res.status(401).send({
            message: "Token manquant"
         })

      }

      if (token.startsWith('Bearer ')) {
         token = token.split(' ')[1]
      }

      const decoded = jwt.verify(
         token,
         process.env.JWT_SECRET || 'jwt_secret'
      )

      req.userId = decoded.id
      req.userRole = decoded.role

      next()

   } catch(error) {

      return res.status(401).send({
         message: "Token invalide"
      })

   }
}

// Middleware optionnel : si un token est fourni, on le décode et on expose req.userId/req.userRole
exports.verifyTokenOptional = (req, res, next) => {
   try {
      let token = req.headers.authorization
      if (!token) return next()

      if (token.startsWith('Bearer ')) {
         token = token.split(' ')[1]
      }

      const decoded = jwt.verify(
         token,
         process.env.JWT_SECRET || 'jwt_secret'
      )

      req.userId = decoded.id
      req.userRole = decoded.role
   } catch (error) {
      // ne pas bloquer : token invalide ou absent => on continue sans user
   }
   next()
}