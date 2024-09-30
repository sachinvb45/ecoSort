// models/Feedback.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    comments: { type: Map, of: String }, // Using a Map to store comments keyed by place ID
    createdAt: { type: String, default: () => new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) }
});

const Feedback = (connection) => {
    return connection.model('Feedback', feedbackSchema);
  };
  module.exports = Feedback;