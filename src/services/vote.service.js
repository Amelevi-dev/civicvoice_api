// src/services/vote.service.js

const Vote = require('../models/vote.model')

exports.calculateResults = async (
   consultationId
) => {

   const yes = await Vote.countDocuments({
      consultationId,
      choice: "yes"
   })

   const no = await Vote.countDocuments({
      consultationId,
      choice: "no"
   })

   const abstain = await Vote.countDocuments({
      consultationId,
      choice: "abstain"
   })

   const total = yes + no + abstain

   return {
      total,
      yes,
      no,
      abstain
   }
}