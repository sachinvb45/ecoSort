const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recommendationSchema = new Schema({
    email: { type: String, required: true },
    places: {
        type:Array
},
createdAt: { type: String, default: () => new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) },});


const Recommendation = (connection) => {
    return connection.model('Recommendation', recommendationSchema);
  };
  module.exports = Recommendation;