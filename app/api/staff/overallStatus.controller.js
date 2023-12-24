const Personnel = require("../../models/Personnel.model");
const { Status, allStatuses } = require("../../models/Status.model");

const {
  totalStatusCount,
  convertDateFormat,
} = require("../admin/overallStatus/+services");

const moment = require("moment-timezone");
let date = moment().tz("Asia/Makassar").format("DD/MM/YYYY");

setInterval(() => {
  date = moment().tz("Asia/Makassar").format("DD/MM/YYYY");
}, 15000);

module.exports = {
  renderOverallStatus: async (req, res) => {
    //Info on his status count total
    const type = "staff";
    let { name, startDate, endDate } = req.query;
    let personnels, statuses;

    if (name) {
      personnels = await Personnel.find({ name, type });
      const allStatuses = await Status.find({
        personnel: personnels,
        date: {
          $gte: convertDateFormat(startDate),
          $lte: convertDateFormat(endDate),
        },
      });
      statuses = totalStatusCount(allStatuses);
    } else {
      personnels = await Personnel.find({ type }).sort({
        name: 1,
      });
    }

    res.render("panel/OverallStatus", {
      header: "Dokki University Overall Status",
      personnels,
      statuses,
      type,
    });
  },
};
