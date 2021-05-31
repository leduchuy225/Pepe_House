/* 
  Crawl data from a Propzy
*/

const rp = require(`request-promise`);
const cheerio = require(`cheerio`);
const { connect } = require("mongoose");
const { HouseStatus } = require("../config/const");
const House = require("../models/house.model");

/* const list_type = [
  "mua/nha/hcm",
  "mua/can-ho/hcm",
  "mua/dat-nen/hcm",
  "mua/dat-nen-du-an/hcm",
  "thue/nha/hcm",
  "thue/can-ho/hcm",
];
const pageIn = [24667, 441, 406, 2, 1282, 722]; */

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: true,
};

const list_type = ["mua/nha/hcm"];
const pageIn = [1];

connect(process.env.MONGO_URL, options, (err) => {
  if (err) return console.log("Fail to connect Mongo DB");
  console.log("Connecting to Mongo DB");
});

run(1, list_type[0], 0);

function run(page, type, index) {
  console.log(`running ${page} - ${type} - ${index} `);
  getPage(page, type).then((data) => {
    console.log(data);
    data.forEach((de) => {
      getDetail(de)
        .then(async (ts) => {
          console.log(ts);
          /* if (ts.lat != NaN) {
            await new House(ts).save().then(() => {
              console.log("Added a new house");
              // process.exit(1);
            });
          } */
        })
        .catch((err) => {
          console.log(err);
          process.exit(1);
        });
    });
    if (index < list_type.length) {
      setTimeout(() => {
        if (page < pageIn[index]) {
          run(db, page + 1, list_type[index], index);
        } else return;
        /* else {
          page = 0;
          index = index + 1;
          run(db, page + 1, list_type[index], index);
        } */
        //run(db, page + 1, type)
      }, 5 * 1000);
    }
  });
  // .catch(console.log);
}

function getPage(page, type) {
  return new Promise((resolve, reject) => {
    rp({
      url: `https://propzy.vn/${type}/p${page}`,
    })
      .then((body) => {
        const $ = cheerio.load(body);
        const list = [];
        $(".listing-card").each((index, item) => {
          const a = $(item).find("a")[0];
          list.push($(a).attr("href"));
        });
        resolve(list);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function getDetail(link) {
  return new Promise((resolve, reject) => {
    rp({
      url: `https://propzy.vn/${link}`,
    })
      .then((body) => {
        const $ = cheerio.load(body);
        const title = remove_text(
          $("body")
            .find(
              "div#wrapper > main#main.sec-tb.p-project-detail > div.container.z-10 > div.row > div.col-lg-12.col-md-12 > div.row.list-item.t-detail-s > div.col-lg-8 > div.t-detail > h1.h3-title"
            )
            .text()
        );
        const add = remove_text(
          $("body")
            .find(
              "div#wrapper > main#main.sec-tb.p-project-detail > div.container.z-10 > div.row > div.col-lg-12.col-md-12 > div.row.list-item.t-detail-s > div.col-lg-8 > div.t-detail > p.p-address"
            )
            .text()
        );
        const price = remove_text(
          $("body")
            .find(
              "div#wrapper > main#main.sec-tb.p-project-detail > div.container.z-10 > div.row > div.col-lg-12.col-md-12 > div.row.list-item.t-detail-s > div.col-lg-8 > div.t-detail > p.p-price-n"
            )
            .text()
        );
        const area = remove_text(
          $("body")
            .find(
              "div#wrapper > #main > div > div > div:nth-child(1) > div.row.list-item.t-detail-s > div.col-lg-8 > div.bl-parameter-listing > ul > li:nth-child(3) > span.sp-info"
            )
            .text()
        );
        const desc = remove_text(
          $("body").find("#tab-detail > div > div").text()
        );
        const housing_type = remove_text(
          $("body")
            .find(
              "#main > div > div > div:nth-child(1) > div.row.list-item.t-detail-s > div.col-lg-8 > div.t-detail > div.label.mb-10 > span.label-1"
            )
            .text()
        );
        const lat = cutStr(body, '"latitude":', ",");
        const lon = cutStr(body, '"longitude":', ",");
        const list_img = [];
        $(".tRes_60").each((index, item) => {
          list_img.push($(item).find("img").attr("src"));
        });
        const description =
          (desc ? desc + "\n" : "") + createDescription($, body);
        resolve({
          name: title,
          address: add,
          price: parseFloat(price),
          area: parseFloat(area),
          description: description,
          status: housing_type === "Bán" ? HouseStatus.SELLING : housing_type,
          longitude: parseFloat(lon), // Kinh do
          latitude: parseFloat(lat), // Vi do
          images: list_img,
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function remove_text(text) {
  return text.replace(/\\n\&nbsp;/g, "").trim();
}

function cutStr(str, start, end) {
  const startPos = str.indexOf(start);
  if (startPos >= 0) {
    let temp = str.slice(startPos + start.length);
    return temp.slice(0, temp.indexOf(end));
  } else return "";
}

function createDescription($, body) {
  let description = "";
  const site = "propzy.vn";
  description += site && `Site: ${site}\n`;
  const huongnha = remove_text(
    $("body")
      .find(
        "div#wrapper > #main > div > div > div:nth-child(1) > div.row.list-item.t-detail-s > div.col-lg-8 > div.bl-parameter-listing > ul > li:nth-child(4) > span.sp-info"
      )
      .text()
  );
  description += huongnha && `Hướng nhà: ${huongnha}\n`;
  const so_tang = cutStr(body, '"numberFloor":', ",");
  description += so_tang && `Số tầng: ${so_tang}\n`;
  const toilet = remove_text(
    $("body")
      .find(
        "#main > div > div > div:nth-child(1) > div.row.list-item.t-detail-s > div.col-lg-8 > div.bl-parameter-listing > ul > li:nth-child(2) > span.sp-info"
      )
      .text()
  );
  description += toilet && `Toilet: ${toilet}\n`;
  const bed = remove_text(
    $("body")
      .find(
        "#main > div > div > div:nth-child(1) > div.row.list-item.t-detail-s > div.col-lg-8 > div.bl-parameter-listing > ul > li:nth-child(1) > span.sp-info"
      )
      .text()
  );
  description += bed && `Giường ngủ: ${bed}\n`;
  const chieu_dai = cutStr(body, '"formatSizeLength":"', 'm"');
  description += chieu_dai && `Chiều dài: ${chieu_dai}\n`;
  const chieu_ngang = cutStr(body, '"formatSizeWidth":"', 'm"');
  description += chieu_ngang && `Chiều rộng: ${chieu_ngang}\n`;

  return description;
}
