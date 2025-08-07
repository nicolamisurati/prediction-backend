// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Prediction = require('./models/Prediction'); // Ensure this path is correct
const User = require('./models/User'); // Import the User model

const app = express();
const PORT = process.env.PORT || 3000; // Change to 3000 or another port

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/soccer_predictions', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB connected');
    // Start the server after successful connection
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

// Endpoint to save predictions
app.post('/api/predictions', async (req, res) => {
    const predictions = req.body; // Expecting an array of predictions

    try {
        await Prediction.insertMany(predictions); // Save all predictions at once
        res.status(201).json({ message: 'Predictions saved' });
    } catch (error) {
        console.error('Error saving predictions:', error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to save predictions' });
    }
});

// Endpoint to get predictions for a user
app.get('/api/predictions/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const userPredictions = await Prediction.find({ userId });
        res.status(200).json(userPredictions);
    } catch (error) {
        console.error('Error retrieving predictions:', error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to retrieve predictions' });
    }
});

// // Endpoint to evaluate predictions and update scores
// app.post('/api/evaluate-predictions', async (req, res) => {
//     const { matchResults } = req.body; // Expecting an array of match results

//     try {
//         // Loop through each match result
//         for (const result of matchResults) {
//             const { matchId, winningTeam } = result; // Extract match ID and winning team

//             // Find all predictions for this match
//             const predictions = await Prediction.find({ matchId });

//             // Loop through each prediction and update scores
//             for (const prediction of predictions) {
//                 if (prediction.team === winningTeam) {
//                     // Update user points
//                     await User.updateOne(
//                         { username: prediction.userId }, // Assuming userId is the username
//                         { $inc: { points: 3 } } // Increment points by 3 for correct prediction
//                     );
//                 }
//             }
//         }

//         res.status(200).json({ message: 'Predictions evaluated and scores updated.' });
//     } catch (error) {
//         console.error('Error evaluating predictions:', error);
//         res.status(500).json({ error: 'Failed to evaluate predictions' });
//     }
// });



// Endpoint to get the leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        const leaderboard = await User.find().sort({ points: -1 }); // Sort users by points in descending order
        res.status(200).json(leaderboard);
    } catch (error) {
        console.error('Error retrieving leaderboard:', error);
        res.status(500).json({ error: 'Failed to retrieve leaderboard' });
    }
});

// Endpoint to get all predictions
app.get('/api/predictions', async (req, res) => {
    try {
        const allPredictions = await Prediction.find(); // Fetch all predictions
        res.status(200).json(allPredictions);
    } catch (error) {
        console.error('Error retrieving predictions:', error); // Log the error for debugging
        res.status(500).json({ error: 'Failed to retrieve predictions' });
    }
});

// Endpoint to get match results
app.get('/api/match-results', async (req, res) => {
    const matchResults = [
        { matchId: 1, winningTeam: 'Team A' },
        { matchId: 2, winningTeam: 'Team D' },
        { matchId: 3, winningTeam: 'Team E' },
    ];

    res.status(200).json(matchResults);
});