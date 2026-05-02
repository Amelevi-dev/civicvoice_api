const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.User = require("./user.model");
db.Consultation = require("./consultation.model");
db.Engagement = require("./engagement.model");
db.Vote = require("./vote.model");

module.exports = db;