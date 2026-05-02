// src/services/blockchain.service.js

const crypto = require('crypto')

exports.generateVoteHash = (voteData) => {

   const data = JSON.stringify(voteData)

   const hash = crypto
      .createHash('sha256')
      .update(data)
      .digest('hex')

   return hash
}