const express = require("express");
const router = express.Router();

const Hall = require('../models/hall');

// Get all the hall data
router.get("/getallHalls", async (req, res) => {
    try {
        const halls = await Hall.find({});
        res.send(halls);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

// Get a hall by its ID
router.post("/gethallbyid", async (req, res) => {
    const { hallid } = req.body; // Extract hallid from the request body
    try {
        const hall = await Hall.findById(hallid); // Fetch the hall using its ID
        if (!hall) {
            return res.status(404).json({ message: "Hall not found" });
        }
        res.send(hall); // Send the hall data as a response
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

router.post("/addhall", async(req, res) => {

    try{
        const newhall = new Hall(req.body)
        await newhall.save()

        res.send('New Room Added Successfully')
    } catch (error) {
        return res.status(400).json({ error });
    }
})


module.exports = router;
