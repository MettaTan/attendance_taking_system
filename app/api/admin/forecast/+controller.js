const Personnel = require("../../../models/Personnel.model");
const { Status } = require("../../../models/Status.model");

const {
  convertDateFormat,
  calculateDays,
  createStatus,
  addDay,
} = require("./+services");

const moment = require("moment-timezone");
let date = moment().tz("Asia/Makassar").format("DD/MM/YYYY");

setInterval(() => {
  date = moment().tz("Asia/Makassar").format("DD/MM/YYYY");
}, 15000);

module.exports = {
  renderForecastPage: async (req, res) => {
    const personnels = await Personnel.find({ type: "student" }).sort({
      name: 1,
    });
    res.render("panel/forecast", {
      header: "Forecast School Personnels",
      personnels,
      type: "admin",
    });
  },
  submitForecastPanel: async (req, res) => {
    for (const [key, value] of Object.entries(req.body)) {
      const { name, am, pm, start, end } = value;
      const personnel = await Personnel.findOne({ name });
      const days = calculateDays(start.date, end.date);

      let date = convertDateFormat(start.date);
      for (let i = 0; i < days; i++) {
        const existingStatus = await personnel.populate({
          path: "statuses",
          match: { date },
        });
        if (existingStatus.statuses.length == 0) {
          const status = await createStatus(personnel, date, am, pm);
          date = addDay(date);
          await status.save();
          personnel.statuses.push(status);
          await personnel.save();
        }
      }
      res.redirect("/admin");
    }
  },
};
