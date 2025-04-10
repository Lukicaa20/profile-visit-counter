const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const visitSchema = new mongoose.Schema({
  count: { type: Number, default: 0 },
});

const Visit = mongoose.model("Visit", visitSchema);

app.get("/api/visit", async (req, res) => {
  try {
    let doc = await Visit.findOne();
    if (!doc) doc = await Visit.create({ count: 1 });
    else {
      doc.count += 1;
      await doc.save();
    }
    res.json({ visits: doc.count });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(3001, () => console.log("Server running on port 3001"));
  })
  .catch((err) => console.log("DB error", err));
