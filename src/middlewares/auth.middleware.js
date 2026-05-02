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
         process.env.JWT_SECRET
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