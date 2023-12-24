const mongoose = require("mongoose");

const personnelSchema = new mongoose.Schema({
  name: String,
  hp: Number,
  nric: String,
  faculty: String,
  type: {
    enum: ["student", "staff"],
    type: String,
  },
  statuses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Status",
    },
  ],
});

const Personnel = mongoose.model("Personnel", personnelSchema);
module.exports = Personnel;
