const Personnel = require("../../../models/Personnel.model");
const { Status, allStatuses } = require("../../../models/Status.model");

const moment = require("moment-timezone");

module.exports = {
    convertDateFormat: (date) => {
        const newYear = date.substring(0, 4);
        const newMonth = date.substring(5, 7);
        const newDay = date.substring(8, 10);
        const newDate = `${newDay}/${newMonth}/${newYear}`;
        return newDate;
    },
    calculateDays: (start, end) => {
        const tempStartDate = moment(start);
        const tempEndDate = moment(end);
        const days = tempEndDate.diff(tempStartDate, "days");
        return days + 1;
    },
    createStatus: (personnel, date, am, pm) => {
        const newStatus = new Status({
            personnel,
            date,
            department: personnel.department,
            status: {
                AM: am.reason,
                amRemarks: am.remarks,
                PM: pm.reason,
                pmRemarks: pm.remarks,
            },
        });
        return newStatus;
    },
    addDay: (date) => {
        const addDate = moment(date, "DD/MM/YYYY").add(1, "days");
        const newDate = addDate.format("DD/MM/YYYY");
        return newDate;
    },
};
