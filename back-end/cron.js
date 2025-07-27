const cron = require('cron');
const https = require('https');

const backendUrl = "https://ute-shop-x9sx.onrender.com/api/v1/book/top/10" || 'http://localhost:8080/api/v1/book/top/10';
const job = new cron.CronJob('*/14 * * * *', function() {
  console.log("Restarting server");

  https
    .get(backendUrl, (res) => {
      if (res.statusCode === 200) {
        console.log("Server restarted successfully");
      } else {
        console.error("Failed to restart server: " + res.statusCode);
      }
    })
    .on('error', (e) => {
      console.error("Error during restart: " + e.message);
    })
})

module.exports = {
  job
}