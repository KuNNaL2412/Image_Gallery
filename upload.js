// upload.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');

// Define the storage for uploaded images
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Example: MongoDB model for storing image information
const Image = require('./models/image'); // Import your Image model

// Route for handling image uploads
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        // Resize and convert image to webp format using Sharp
        const resizedImageBuffer = await sharp(req.file.buffer)
            .resize({ width: 300, height: 300 })
            .webp()
            .toBuffer();

        // Save the processed image to the database or file system
        const savedImage = await Image.create({
            data: resizedImageBuffer,
            contentType: 'image/webp', // Adjust this based on your actual content type
            userId: req.user._id, // Assuming req.user._id contains the user's ID
            // Add other relevant image data here
        });

        // Respond to the client with the image URL or other information
        res.json({ imageUrl: `/images/${savedImage._id}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
