// src/middlewares/role.middleware.js

exports.isAdmin = (req, res, next) => {

   if (
      req.userRole === "admin"
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

exports.isObserver = (req, res, next) => {

   if (
      req.userRole === "observer"
   ) {
      next()
   } else {
      return res.status(403).send({
         message: "Accès réservé aux observateurs de la société civile"
      })
   }
}

exports.isAuditor = (req, res, next) => {
    // Authorities, observers and Super-Admin can audit the system
    if (["authority", "observer", "admin"].includes(req.userRole)) {
        next();
    } else {
        return res.status(403).send({
            message: "Accès restreint aux auditeurs certifiés"
        });
    }
}