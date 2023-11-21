// gallery.js
const express = require('express');
const router = express.Router();
const Image = require('./models/image');

// Route for fetching and returning a list of user's images
router.get('/gallery', async (req, res) => {
    try {
        // Assume the user is authenticated, and you have access to the user's ID
        const userId = req.user._id; // Adjust this based on your actual authentication setup

        // Fetch the user's images from the database
        const userImages = await Image.find({ userId: req.user._id });

        // Respond to the client with the list of images
        res.json(userImages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
