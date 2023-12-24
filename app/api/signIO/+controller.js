const { signin, signout } = require("./+services");
const { allStatuses } = require("../../models/Status.model");

module.exports = {
  renderForm: (req, res) => {
    const { signIO, type } = req.params;

    const SignIO = signIO.replace(/\s+/g, "").replace(/\w{4}(?!$)/, "$& ");
    console.log(SignIO);

    res.render("SignIO", {
      header: `${type.toUpperCase()} ${SignIO.toUpperCase()}`,
      signIO,
      type,
      allStatuses,
    });
  },
  signIO: async (req, res) => {
    const { signIO, type } = req.params;
    const reqObj = req.body.data;

    if (!signIO) {
      throw new Error(
        "This is a breaking error, contact Metta! Error is @ signIO params"
      );
    }

    switch (signIO) {
      case "signin":
        await signin(reqObj, signIO);
        break;
      case "signout":
        await signout(reqObj, signIO);
        break;
    }

    res.redirect(`/signIO/${signIO}/${type}`);
  },
};
