const Personnel = require("../../models/Personnel.model");
const { Status } = require("../../models/Status.model");

const moment = require("moment-timezone");

const {
  getPMSignoutSummary,
  getAllStatuses,
  exportOverallStatus,
} = require("./+services");
const { convertDateFormat } = require("../admin/forecast/+services");

const getTodaysDate = () => {
  return moment().tz("Asia/Makassar").format("DD/MM/YYYY");
};

const getOverallStatus = async (date, type) => {
  const allAMStatus = await getAllStatuses(date, type, "AM");
  const allPMStatus = await getAllStatuses(date, type, "PM");
  const yetToSignout = await getPMSignoutSummary(date, type);
  const totalHeadcount = await Personnel.find({ type }).count();

  return {
    allAMStatus,
    allPMStatus,
    yetToSignout,
    totalHeadcount,
  };
};

const getReceipt = async (date, type, ampmStatus) => {
  const allPersonnelStatus = await getAllStatuses(date, type, ampmStatus);
  const totalHeadcount = await Personnel.find({ type }).count();

  return {
    allPersonnelStatus,
    totalHeadcount,
  };
};

module.exports = {
  exportOverallStatus: async (req, res) => {
    const date = getTodaysDate();
    const overallStatus = await exportOverallStatus(date);

    res.render("export/csv", {
      header: `Dokki University Overall Status`,
      date,
      overallStatus,
    });
  },
  renderOverallStatus: async (req, res) => {
    const { type } = req.params;
    let { date } = req.query;

    if (!date) {
      date = getTodaysDate();
    } else {
      date = convertDateFormat(date);
    }

    const { allAMStatus, allPMStatus, yetToSignout, totalHeadcount } =
      await getOverallStatus(date, type);

    await res.render("overallStatus", {
      header: `Dokki University ${type.toUpperCase()} Overall Status`,
      type,
      date,
      allAMStatus,
      allPMStatus,
      totalHeadcount,
      yetToSignout,
    });
  },
  renderReceipt: async (req, res) => {
    const { type, ampmStatus } = req.params;
    const date = getTodaysDate();
    const { allPersonnelStatus, totalHeadcount } = await getReceipt(
      date,
      type,
      ampmStatus
    );

    res.render("print/receipt", {
      ampmStatus,
      type,
      allPersonnelStatus,
      totalHeadcount,
    });
  },
  updateOverallStatus: async (req, res) => {
    const { type } = req.params;
    const { _id, AM, PM, amRemarks, pmRemarks } = req.body;
    const updateStatus = await Status.findById(_id);
    updateStatus.status.AM = AM;
    updateStatus.status.PM = PM;
    updateStatus.status.amRemarks = amRemarks;
    updateStatus.status.pmRemarks = pmRemarks;
    await updateStatus.save();

    res.redirect(`/overallStatus/${type}`);
  },
};
