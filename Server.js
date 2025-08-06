// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Prediction = require('./models/Prediction'); // Ensure this path is correct

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
