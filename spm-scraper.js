const axios = require("axios");
const cheerio = require("cheerio");

const getChildData = e => (e.children[0] ? e.children[0].data : e.children[0]);
const filterNotUsed = e => e !== undefined && !e.includes("\n");

for (let i = 1; i < 4; i++) {
  const url = `https://marknadssok.fi.se/publiceringsklient?Page=${i}`;
  axios(url).then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    const table = $(".table");

    const thead = table[0].children.find(c => c.name === "thead");
    const ths = thead.children
      .filter(c => c.name === "tr")[0]
      .children.filter(c => c.name === "th")
      .map(getChildData)
      .filter(filterNotUsed);

    const tbody = table[0].children.find(c => c.name === "tbody");
    const trs = tbody.children.filter(c => c.name === "tr");
    const formattedTrs = trs.map(tr => {
      const tds = tr.children.filter(trc => trc.name === "td");
      const formattedTds = tds
        .map(getChildData)
        .filter(filterNotUsed)
        .map((td, index) => ({
          [`${ths[index]}`]: td
        }));
      return Object.assign(...formattedTds);
    });
    console.log(formattedTrs);
  });
}
