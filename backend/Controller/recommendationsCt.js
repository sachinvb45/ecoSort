const createRecommendationsModel = require('../Model/recommendationsMd');
const sgMail = require('@sendgrid/mail');
const Feedback = require('../Model/feedbackMd');
sgMail.setApiKey(process.env.SG); // Use environment variable for API key

exports.store = async (req, res) => {
    const { places, email } = req.body;
    const Recommendation = createRecommendationsModel(req.globalDB);

    try {
        const newRecommendation = new Recommendation({ email, places });
        const currentRequest = await newRecommendation.save();
        res.json({ currentRequest });
    } catch (err) {
        res.status(500).json({ error: 'Failed to store recommendations' });
    }
};
let clickedPlaces = {}; // Object to store clicked places
let timeoutId; // Variable to hold the timeout ID

exports.track = async (req, res) => {
    const { currentRequest, placeId, email, name ,placeName } = req.body;
    const Recommendation = createRecommendationsModel(req.globalDB);
    
    try {
        const resp = await Recommendation.updateOne(
            { '_id': currentRequest, 'places.place_id': placeId },
            { $set: { 'places.$.clicked': true } }
        );

        if (resp.matchedCount > 0 && resp.modifiedCount > 0) {
            res.status(200).json({ message: 'Click tracked successfully', resp });

            // Add the clicked place ID to the object
            clickedPlaces[placeName] = true;

            // Clear the existing timeout if it exists
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            // Set a new timeout for 30 seconds
            timeoutId = setTimeout(async () => {
                try {
                    // Send a single feedback email with all clicked places
                    await sendFeedbackEmail(email, name, Object.keys(clickedPlaces));
                    clickedPlaces = {}; // Clear clicked places after sending
                } catch (err) {
                    console.error('Failed to send feedback email:', err.message);
                }
            }, 30 * 100); // Delay in milliseconds
        } else {
            res.status(404).json({ message: 'No matching document or place found', resp });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to track click', details: err.message });
    }
};
async function sendFeedbackEmail(email, name, clickedPlaceIds) {
    // Fetch place details based on clickedPlaceIds
    console.log(clickedPlaceIds);
    const placesDetails = clickedPlaceIds.map(id => `
        <div style="margin-bottom: 15px;">
            <label for="feedback_${id}" style="font-weight: bold; font-size: 16px;">Place ID: ${id}</label>
            <textarea id="feedback_${id}" name="comments[${id}]" rows="4" required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-family: Arial, sans-serif;"></textarea>
        </div>
    `).join('');

    const msg = {
        to: 'sachinvb27@gmail.com', // Send to the user's email
        from: 'devnotes24@gmail.com', // Your verified sender email
        subject: 'We Value Your Feedback - Eco Sort',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
                <h1 style="color: #4CAF50;">We Value Your Feedback, ${name}</h1>
                <p style="font-size: 16px; margin-bottom: 20px;">Thank you for using Eco Sort! Please provide your feedback for the following places:</p>
                <form action="http://localhost:8000/recommendationsRt/feedback" method="POST" style="border: 1px solid #ccc; padding: 20px; border-radius: 5px;">
                    ${placesDetails}
                    <div style="margin-bottom: 15px;">
                        <label for="name" style="font-weight: bold;">Name:</label>
                        <input type="text" id="name" name="name" value="${name}" readonly required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-family: Arial, sans-serif;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label for="email" style="font-weight: bold;">Email:</label>
                        <input type="email" id="email" name="email" value="${email}" readonly required style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-family: Arial, sans-serif;">
                    </div>
                    <button type="submit" style="background-color: #4CAF50; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">Submit Feedback</button>
                </form>
            </div>
        `,
    };

    try {
        await sgMail.send(msg);
        console.log('Feedback email sent successfully');
    } catch (error) {
        console.error('Error sending feedback email:', error.response ? error.response.body : error.message);
        throw new Error('Failed to send email');
    }
}



// Endpoint to handle feedback form submissions
exports.feedback = async (req, res) => {
    const { name, email, comments } = req.body;
    const feedback = Feedback(req.globalDB);

    try {
        // Create a new feedback document
        const newFeedback = new feedback({
            name,
            email,
            comments // comments will be stored as an object keyed by place IDs
        });

        // Save the feedback to the database
        await newFeedback.save();

        console.log('Feedback received:', { name, email, comments });
        // Respond back to the user
        res.status(200).send('Thank you for your feedback!');
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).send('Error saving feedback, please try again later.');
    }
};


exports.getHist = async (req, res) => {
    const Recommendation = createRecommendationsModel(req.globalDB);
    const { email } = req.body;
  
    try {
      // Find all documents with the provided email
      const userHistory = await Recommendation.find({ email });
  
      if (userHistory.length === 0) {
        return res.json({ error: 'User does not have any history' });
      }
  
      // Map through the userHistory and extract only the names from the places array
      const historyWithPlaceNames = userHistory.map(history => ({
        _id:history._id,
        email: history.email,
        places: history.places.map(place => place.name),  // Extract only the name field
        createdAt: history.createdAt
      }));
  
      // Send the response with the filtered data
      res.json({
        history: historyWithPlaceNames
      });
  
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  

  exports.getFeedbacks= async (req, res) => {
    const { companyName } = req.body; // Expecting company name in the body
    const User = Feedback(req.globalDB);

    try {
        const usersWithComments = await User.find({
          [`comments.${companyName}`]: { $exists: true } // Check if the comment exists for the provided company name
        })
        .select('name comments createdAt -_id') // Select only the fields you need, excluding the _id
    
        // Transform the result to return only the needed information
        const result = usersWithComments.map(user => ({
          name: user.name,
          comments: user.comments.get(companyName), // Get the specific comment for the company
          createdAt: user.createdAt,
        }));
    
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ message: 'Server error', error });
      }
  };
  
  