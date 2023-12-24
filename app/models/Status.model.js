const mongoose = require("mongoose");

const allStatuses = ["PRESENT", "MA", "LEAVE", "UNKNOWN", "MC"];

const statusSchema = new mongoose.Schema({
  personnel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Personnel",
  },
  date: String,
  faculty: String,
  signin: {
    signin: {
      type: Boolean,
      default: false,
    },
    time: {
      type: String,
      default: "NULL",
    },
    signature: {
      type: String,
      default: "NULL",
    },
  },
  signout: {
    signout: {
      type: Boolean,
      default: false,
    },
    time: {
      type: String,
      default: "NULL",
    },
    signature: {
      type: String,
      default: "NULL",
    },
  },
  status: {
    AM: {
      type: String,
      enum: allStatuses,
      default: "UNKNOWN",
    },
    amRemarks: String,
    PM: {
      type: String,
      enum: allStatuses,
      default: "UNKNOWN",
    },
    pmRemarks: String,
  },
});

const Status = mongoose.model("Status", statusSchema);
module.exports = {
  Status,
  allStatuses,
};
