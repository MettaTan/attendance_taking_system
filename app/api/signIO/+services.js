const Personnel = require("../../models/Personnel.model");

const moment = require("moment");
let date = moment().format("DD/MM/YYYY");
setInterval(() => {
  date = moment().format("DD/MM/YYYY");
}, 15000);

const getPersonFromDB = async (reqObj) => {
  const { nric } = reqObj;

  const person = await Personnel.findOne({ nric })
    .populate({
      path: "statuses",
      match: { date },
    })
    .exec();

  if (!person) {
    throw new Error("User does not exist!");
  } else {
    return person;
  }
};

module.exports = {
  signin: async (reqObj, signIO) => {
    const person = await getPersonFromDB(reqObj);
    const newSignin = new Signin(reqObj, signIO, person);
    newSignin.checkIfAlreadySignIO();
    newSignin.checkIfPast0900();
    newSignin.updateSignIO();
    newSignin.signin();
    await newSignin.saveSignIO();
    return;
  },
  signout: async (reqObj, signIO) => {
    const person = await getPersonFromDB(reqObj);
    const newSignout = new Signout(reqObj, signIO, person);
    newSignout.checkIfAlreadySignIO();
    newSignout.updateSignIO();
    newSignout.signout();
    await newSignout.saveSignIO();
    return;
  },
};

class SignIO {
  reqObj;
  signIO;
  person;

  constructor(reqObj, signIO, person) {
    this.reqObj = reqObj;
    this.signIO = signIO;
    this.person = person;
  }
  getDayStatus() {
    return this.person.statuses[0];
  }
  getTime() {
    return moment().format("HH:mm:ss");
  }
  getSignature() {
    return this.reqObj.signature;
  }

  checkIfAlreadySignIO() {
    const dayStatus = this.getDayStatus();
    const updated = dayStatus[this.signIO][this.signIO];
    if (updated) throw new Error(`Already ${this.signIO}!`);
  }

  updateSignIO() {
    const dayStatus = this.getDayStatus();
    dayStatus[this.signIO].time = this.getTime();
    dayStatus[this.signIO].signature = this.getSignature();
    dayStatus[this.signIO][this.signIO] = true;
  }
  async saveSignIO() {
    const dayStatus = this.getDayStatus();
    await dayStatus.save();
  }
}

class Signin extends SignIO {
  constructor(reqObj, signIO, person) {
    super(reqObj, signIO, person);
  }
  checkIfPast0900() {
    const dayStatus = this.getDayStatus();
    const past0900 = this.getTime() < moment().format("09:00:00");
    if (past0900) dayStatus.status.AM = "PRESENT";
  }
  signin() {
    const dayStatus = this.getDayStatus();
    dayStatus.status.PM = "PRESENT";
  }
}

class Signout extends SignIO {
  constructor(reqObj, signIO, person) {
    super(reqObj, signIO, person);
  }
  signout() {
    const dayStatus = this.getDayStatus();
    const { reason, remarks } = this.reqObj;
    dayStatus.status.PM = reason;
    dayStatus.status.pmRemarks = remarks;
  }
}
