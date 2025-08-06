// models/Prediction.js

const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    matchId: { type: Number, required: true },
    team: { type: String, required: true },
});

module.exports = mongoose.model('Prediction', PredictionSchema);
