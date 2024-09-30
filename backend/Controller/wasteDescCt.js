const createWasteModel=require('../Model/wasteDescMd')

exports.wasteData = async (req, res) => {
    const Waste = createWasteModel(req.globalDB);
    try {
        const wasteData = await Waste.find(); // Fetch all waste data from MongoDB
    
        // Convert the array of waste documents into the wasteData structure your frontend expects
        const structuredWasteData = {};
        wasteData.forEach((waste) => {
          structuredWasteData[waste.wasteType] = {
            title: waste.title,
            description: waste.description,
            videoUrl: waste.videoUrl
          };
        });
    
        res.json(structuredWasteData); // Send the structured data to the frontend
      } catch (error) {
        res.status(500).json({ message: 'Error fetching waste data' });
      }
  };


  