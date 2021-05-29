/* 
  Example
  How to crawl data from a website
*/

const rp = require(`request-promise`);
const cheerio = require(`cheerio`);
// const { MongoClient } = require(`mongodb`);

const list_type = [
  "mua/nha/hcm",
  "mua/can-ho/hcm",
  "mua/dat-nen/hcm",
  "mua/dat-nen-du-an/hcm",
  "thue/nha/hcm",
  "thue/can-ho/hcm",
];
const CategoryId = [2, 1, 5, 5, 13, 12];
const pageIn = [24667, 441, 406, 2, 1282, 722];

/* MongoClient.connect(`mongodb://localhost:27017/crawl`)
  .then((db) => {
    run(db, 1, list_type[0], 0);
  })
  .catch(console.log); */

db = null;

run(db, 1, list_type[0], 0);

function run(db, page, type, index) {
  console.log(`running ${page} - ${type} - ${index} `);
  getPage(page, type)
    .then((data) => {
      console.log(data);
      data.forEach((de) => {
        getDetail(de)
          .then((ts) => {
            ts.category = CategoryId[index];
            console.log(ts);
            if (ts.lat != NaN) {
              db.collection("data").insert(ts);
            }
          })
          .catch(console.log);
      });
      if (index < list_type.length) {
        setTimeout(() => {
          if (page < pageIn[index]) {
            run(db, page + 1, list_type[index], index);
          } else {
            page = 0;
            index = index + 1;
            run(db, page + 1, list_type[index], index);
          }
          //run(db, page + 1, type)
        }, 5 * 1000);
      }
    })
    .catch(console.log);
}
//2627

function getPage(page, type) {
  return new Promise((resolve, reject) => {
    rp({
      url: `https://propzy.vn/${type}?src=mega_menu&p=${page}`,
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

const remove_text = (text) => {
  return text.replace(/\\n\&nbsp;/g, "").trim();
};
//getDetail('/ban-can-office-tel-republic-cong-hoa-50m2-tang-6-gia-239ty-alo-0908982299-xem-nha-es1209508?src=home_box_product')
function getDetail(link) {
  return new Promise((resolve, reject) => {
    rp({
      url: `https://propzy.vn/${link}`,
    })
      .then((body) => {
        const $ = cheerio.load(body);
        const site = "propzy.vn";
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
        const huongnha = remove_text(
          $("body")
            .find(
              "div#wrapper > #main > div > div > div:nth-child(1) > div.row.list-item.t-detail-s > div.col-lg-8 > div.bl-parameter-listing > ul > li:nth-child(4) > span.sp-info"
            )
            .text()
        );
        const huong_ban_cong = "";
        const so_tang = cutStr(body, '"numberFloor":', ",");
        const house_project = remove_text(
          $("body")
            .find(
              "div#wrapper > main#main.sec-tb.p-project-detail > div.container.z-10 > div.row > div.col-lg-12.col-md-12 > div.row.list-item.t-detail-s > div.col-lg-8 > div.t-detail > p.p-project"
            )
            .text()
        );
        const phaply = "";
        const category = "";
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
        const toilet = remove_text(
          $("body")
            .find(
              "#main > div > div > div:nth-child(1) > div.row.list-item.t-detail-s > div.col-lg-8 > div.bl-parameter-listing > ul > li:nth-child(2) > span.sp-info"
            )
            .text()
        );
        const bed = remove_text(
          $("body")
            .find(
              "#main > div > div > div:nth-child(1) > div.row.list-item.t-detail-s > div.col-lg-8 > div.bl-parameter-listing > ul > li:nth-child(1) > span.sp-info"
            )
            .text()
        );
        const lat = cutStr(body, '"latitude":', ",");
        const lon = cutStr(body, '"longitude":', ",");
        const duong_vao = "";
        const mat_tien = cutStr(body, '"formatSizeWidth":"', 'm"');
        const num_living = "";
        const noi_that = "";
        const chieu_dai = cutStr(body, '"formatSizeLength":"', 'm"');
        const chieu_ngang = cutStr(body, '"formatSizeWidth":"', 'm"');
        const toa_nha = "";
        const list_img = [];
        $(".tRes_60").each((index, item) => {
          list_img.push($(item).find("img").attr("src"));
        });
        const obj = {
          title: title,
          category: parseInt(category),
          site: site,
          link: link,
          address: add,
          price: price,
          area: parseFloat(area),
          description: desc,
          house_type: housing_type,
          house_direc: huongnha,
          house_balcony: huong_ban_cong,
          house_project: house_project,
          facade: parseFloat(mat_tien),
          road_house: parseFloat(duong_vao),
          lon: parseFloat(lon),
          lat: parseFloat(lat),
          num_floor: parseInt(so_tang),
          num_bed: parseInt(bed),
          num_bath: parseInt(toilet),
          num_living: parseInt(num_living),
          furniture: noi_that,
          juridical: phaply,
          width: parseFloat(chieu_ngang),
          length: parseFloat(chieu_dai),
          the_building: toa_nha,
          list_img: list_img,
        };

        resolve(obj);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function cutStr(str, start, end) {
  const startPos = str.indexOf(start);
  if (startPos >= 0) {
    let temp = str.slice(startPos + start.length);
    return temp.slice(0, temp.indexOf(end));
  } else return "";
}
