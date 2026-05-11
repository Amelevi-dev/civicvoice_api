// src/middlewares/role.middleware.js

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