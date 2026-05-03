// src/services/token.service.js

const jwt = require('jsonwebtoken')

exports.generateTokens = (user, isMobile = false) => {

   const accessToken = jwt.sign(
      {
         id: user._id,
         username: user.username,
         emailOrPhone: user.emailOrPhone,
         role: user.role || "citizen",
         arrondissement: user.arrondissement
      },
      process.env.JWT_SECRET || 'jwt_secret',
      {
         expiresIn: isMobile ? "30d" : "2h"
      }
   )

   if (isMobile) {
      return { accessToken }
   }

   const refreshToken = jwt.sign(
      {
         id: user._id
      },
      process.env.JWT_REFRESH_SECRET || 'jwt_refresh_secret',
      {
         expiresIn: "7d"
      }
   )

   return {
      accessToken,
      refreshToken
   }
}