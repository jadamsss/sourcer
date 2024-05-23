const { JSDOM } = require('jsdom');
const { mkdirSync, readFileSync, readdirSync, writeFileSync } = require('fs');

const listItemDataAttributes = ['discount', 'item-name', 'mz-product', 'price', 'shipping'];

function parseListItem(element) {
  const li = listItemDataAttributes.reduce((acc, attr) => ({
    ...acc,
    [attr]: element.getAttribute(`data-${attr}`)
  }), {});

  li.promo = element.querySelector('.promo-message')?.textContent;

  return li;
}

function getListItemsFromDom(document) {
  return Array.from(document.querySelectorAll('.mz-productlist-item')).map(parseListItem);
}

async function parseMilwaukeeData(date) {
  const files = readdirSync(`../scrapy_sourcer/output/${date}/Milwaukee`);

  const data = files.map(async (file) => {
    const dom = await JSDOM.fromFile(`../scrapy_sourcer/output/${date}/Milwaukee/${file}`)
    return getListItemsFromDom(dom.window.document);
  });

  const output = (await Promise.all(data)).flat();

  writeFileSync(`./output/Milwaukee/${date}.json`, JSON.stringify(output, null, 2));
}

parseMilwaukeeData('2024-05-22')
