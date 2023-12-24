const { Status, allStatuses } = require("../../models/Status.model");

const getStatuses = async (date, type, ampmStatus, status) => {
  const queryObj = { date };
  queryObj[`status.${ampmStatus}`] = status;

  const allStatuses = await Status.find(queryObj)
    .sort({ faculty: 1 })
    .populate({
      path: "personnel",
      match: { type },
    });
  return filterOutStatusesWithNullPersonnel(allStatuses);
};

const filterOutStatusesWithNullPersonnel = (allStatuses) => {
  const statuses = [];
  for (const status of allStatuses) {
    if (status.personnel != null) {
      statuses.push(status);
    }
  }
  return statuses;
};

class StatusClass {
  constructor(statusTitle, allStatuses) {
    this.statusTitle = statusTitle;
    this.allStatuses = allStatuses;
  }
}

module.exports = {
  exportOverallStatus: async (date) => {
    const overallStatus = await Status.find({ date })
      .sort({ faculty: 1 })
      .populate("personnel");
    return overallStatus;
  },
  getAllStatuses: async (date, type, ampmStatus) => {
    const allPersonnelStatus = [];

    for (const status of allStatuses) {
      const allStatuses = await getStatuses(date, type, ampmStatus, status);
      allPersonnelStatus.push(new StatusClass(status, allStatuses));
    }
    return allPersonnelStatus;
  },
  getPMSignoutSummary: async (date, type) => {
    const allStatuses = await Status.find({
      date,
      "sigin.sigin": true,
      "signout.signout": false,
    })
      .sort({ name: 1 })
      .populate({
        path: "personnel",
        match: { type },
      });
    return filterOutStatusesWithNullPersonnel(allStatuses);
  },
};
