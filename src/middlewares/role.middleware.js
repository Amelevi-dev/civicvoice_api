// src/middlewares/role.middleware.js

exports.isAdmin = (req, res, next) => {

   if (
      req.userRole === "authority" // ADMIN
   ) {
      next()
   } else {
      return res.status(403).send({
         message: "Accès refusé"
      })
   }
}

exports.isCitizen = (req, res, next) => {

   if (
      req.userRole === "citizen" // CITOYEN
   ) {
      next()
   } else {
      return res.status(403).send({
         message: "Accès refusé"
      })
   }
}

exports.isAuthority = (req, res, next) => {

   if (
      req.userRole === "authority"
   ) {
      next()
   } else {
      return res.status(403).send({
         message: "Accès refusé"
      })
   }
}