// src/controllers/auth.controller.js

const authService = require('../services/auth.service')

exports.signup = async (req, res) => {
   try {

      const result = await authService.signup(req.body)

      return res.status(201).send(result)

   } catch(error) {

      return res.status(500).send({
         message: error.message
      })

   }
}

exports.signin = async (req, res) => {
   try {

      const result = await authService.signin(req.body)

      if (!req.body.isMobile && result.refreshToken) {

         res.cookie('jwt', result.accessToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 2 * 60 * 60 * 1000
         })

         res.cookie('jwtRefresh', result.refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
         })
      }

      return res.status(200).send(result)

   } catch(error) {

      return res.status(500).send({
         message: error.message
      })

   }
}

exports.forgotPassword = async (req, res) => {
   try {

      const result = await authService.forgotPassword(req.body)

      return res.status(200).send(result)

   } catch(error) {

      return res.status(500).send({
         message: error.message
      })

   }
}

exports.resetPassword = async (req, res) => {
   try {

      const result = await authService.resetPassword(req.body)

      return res.status(200).send(result)

   } catch(error) {

      return res.status(500).send({
         message: error.message
      })

   }
}

exports.refresh = async (req, res) => {

   try {

      const refreshToken = req.cookies?.jwtRefresh

      if (!refreshToken) {
         return res.status(401).send({
            message: "Unauthorized"
         })
      }

      const result = await authService.refresh(refreshToken)

      res.cookie('jwt', result.accessToken, {
         httpOnly: true,
         sameSite: 'None',
         secure: true,
         maxAge: 2 * 60 * 60 * 1000
      })

      return res.status(200).send(result)

   } catch(error) {

      return res.status(500).send({
         message: error.message
      })

   }
}