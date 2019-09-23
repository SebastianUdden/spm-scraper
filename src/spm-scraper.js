const axios = require("axios");
const cheerio = require("cheerio");

const getChildData = e => (e.children[0] ? e.children[0].data : e.children[0]);
const filterNotUsed = e => e !== undefined && !e.includes("\n");

const getPublicationData = async page => {
  const url = `https://marknadssok.fi.se/publiceringsklient?Page=${page}`;
  return axios(url).then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    const table = $(".table");

    const thead = table[0].children.find(c => c.name === "thead");
    const ths = thead.children
      .filter(c => c.name === "tr")[0]
      .children.filter(c => c.name === "th");
    const formatedThs = ths.map(getChildData).filter(filterNotUsed);
    console.log("FTHS", formatedThs);

    const tbody = table[0].children.find(c => c.name === "tbody");
    const trs = tbody.children.filter(c => c.name === "tr");
    const formatedTrs = trs.map(tr => {
      const tds = tr.children.filter(trc => trc.name === "td");
      const formatedTds = tds
        .map(getChildData)
        .map(c => {
          if (c !== undefined && c.includes("\n")) return undefined;
          return c;
        })
        .map((td, index) => ({
          [`${formatedThs[index]}`]: td
        }));
      console.log("FTDS", formatedTds);
      return Object.assign(...formatedTds);
    });
    return formatedTrs;
  });
};

export default getPublicationData;
