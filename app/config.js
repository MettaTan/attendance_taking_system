const config = module.exports;
require("dotenv").config();

let PRODUCTION = process.env.NODE_ENV === "production";

if (PRODUCTION) {
  config.express = {
    port: process.env.EXPRESS_PORT,
    ip: process.env.EXPRESS_IP,
  };

  config.mongodb = {
    port: process.env.MONGODB_PORT,
    host: process.env.MONGODB_HOST,
    db: process.env.MONGODB_DB,
  };
} else {
  config.express = {
    port: 8004,
    ip: "127.0.0.1",
  };

  config.mongodb = {
    port: 27017,
    host: "127.0.0.1",
    db: "attendance_system",
  };
}
