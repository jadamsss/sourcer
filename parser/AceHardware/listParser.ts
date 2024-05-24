import { JSDOM } from 'jsdom';
import { mkdirSync, readdirSync, writeFileSync } from 'fs';

const listItemDataAttributes = ['discount', 'item-name', 'mz-product', 'price', 'shipping'];

function parseListItem(element: Element): AceHardware.ListItem {
  const li: AceHardware.ListItem = listItemDataAttributes.reduce((acc, attr) => ({
    ...acc,
    [attr]: element.getAttribute(`data-${attr}`)
  }), {} as AceHardware.ListItem);

  li.promo = element.querySelector('.promo-message')?.textContent as AceHardware.PromoType;
  li.aceRewards = element.querySelector('.ace-rewards-amt')?.textContent?.split(' ')[0].substring(1);
  li.url = element.querySelector('.mz-productlisting-title')?.getAttribute('href') as string;
  li.shipping = (li.shipping as any).split(', ')

  return li;
}

function getListItemsFromDom(document: Document): AceHardware.ListItem[] {
  return Array.from(document.querySelectorAll('.mz-productlist-item')).map(parseListItem);
}

async function parse(htmlOutputPath: string): Promise<void> {
  const [_scrappySourcer, _output, store, date] = htmlOutputPath.split('/');
  const brands = readdirSync(htmlOutputPath);

  brands.map(async (brand) => {
    const files = readdirSync(`${htmlOutputPath}/${brand}`);

    const data = files.map(async (file) => {
      const dom = await JSDOM.fromFile(`${htmlOutputPath}/${brand}/${file}`);

      return getListItemsFromDom(dom.window.document);
    });

    const output = (await Promise.all(data)).flat();
    const outputDir = `./parser/output/${store}/${date}`;

    mkdirSync(outputDir, { recursive: true });
    writeFileSync(`${outputDir}/${brand}.json`, JSON.stringify(output, null, 2));
  });
}

const htmlOutputPath = process.argv[process.argv.length - 1];

if (htmlOutputPath) {
  parse(htmlOutputPath);
} else {
  console.error('No path provided');
}
