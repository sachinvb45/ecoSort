const mongoose = require('mongoose');

const WasteSchema = new mongoose.Schema({
  wasteType: { type: String, required: true }, // Example: 'plastic', 'glass'
  title: { type: String, required: true }, // Title of the waste type
  description: { type: String, required: true }, // Description of the waste type
  videoUrl: { type: String, required: true } // URL of the video
});

const createWasteModel = (connection) => {
    return connection.model('Waste', WasteSchema);
  };
  module.exports = createWasteModel;