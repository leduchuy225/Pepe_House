const request = require("request-promise");
const cheerio = require("cheerio");

request({
  url: "https://alonhadat.com.vn/sieu-hiem-mat-pho-vu-trong-khanh-ha-dong-kinh-doanh-duong-48m-via-he-rong-8520772.html",
}).then((body) => {
  console.log(body);
});
