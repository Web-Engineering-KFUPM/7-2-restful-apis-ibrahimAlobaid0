import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./db.js";
import { Song } from "./models/song.model.js";

const app = express();
const PORT = process.env.PORT || 5174;

app.use(cors());              
app.use(express.json());

await connectDB(process.env.MONGO_URL);


// api/songs (Read all songs)
app.get("/api/songs", async (req, res) => {
    try {
        const songs = await Song.find();
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// get one song by id
app.get("/api/songs/:id", async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);    
        if (!song) {
            return res.status(404).json({ message: "Song not found" });
        }
        res.json(song);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// api/songs (Insert song)
app.post("/api/songs", async (req, res) => {
          try {
            const { title = "", artist = "", year } = req.body || {};
            const created = await Song.create({
              title: title.trim(),
              artist: artist.trim(),
              year

            });
            console.log("here")
            res.status(201).json(created);
          } catch (err) {
            res.status(400).json({ message: err.message || "Create failed" });
          }
        });
// /api/songs/:id (Update song)
app.put("/api/songs/:id", async (req, res) => {
        try {
          const updated = await Song.findByIdAndUpdate(
            req.params.id,
            req.body || {},
            { new: true, runValidators: true, context: "query" }
          );
          if (!updated) return res.status(404).json({ message: "Song not found" });
          res.json(updated);
        } catch (err) {
          res.status(400).json({ message: err.message || "Update failed" });
        }
      });

// /api/songs/:id (Delete song)
app.delete("/api/songs/:id", async (req, res) => {
        const deleted = await Song.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Song not found" });
        res.status(204).end();
      });

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
