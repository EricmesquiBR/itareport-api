require("dotenv").config();

const config = {
  server: {
    host: process.env.HOST || "0.0.0.0",
    port: parseInt(process.env.PORT, 10) || 3030,
  },
};

module.exports = config;
