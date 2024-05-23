import { snakeCase } from "lodash";
import { writeFileSync } from "fs";


let i = 0;
async function loadAllProducts() {
  cy.scrollTo('bottom');
  cy.get('#loadMoreBtn').click();
  cy.scrollTo('bottom');
}

it('scan', async () => {
  const { department, brand, baseUrl} = Cypress.env();

  cy.visit('/');
  cy.visit(`/departments/${department}/${brand}`);

  // const p = new Promise<void>((resolve) => {
  //   loadAllProducts(resolve);
  // });

  // await p;

  cy.scrollTo('bottom');
  cy.wait(2000);
  const listItems = await getListItems([]);
  console.log(listItems);

  writeFileSync('listItems.json', JSON.stringify(listItems, null, 2));
});

export const PromoTypes = {
  buyAndGet: "Buy & Get",
}

export const ShippingTypes = {
  direct: "DirectShip",
  inStorePickup: "InStorePickup",
  delivery: "Delivery",
} as const;

export const listItemClass = ".mz-productlist-item";
export const linkClass = ".mz-productlisting-title";

export const listItemDataAttributes = ['discount', 'item-name', 'mz-product', 'price', 'shipping'];

interface ListItem {
  discount: string;
  link: string;
  itemName: string;
  mzProduct: string;
  price: string;
  shipping: typeof ShippingTypes[keyof typeof ShippingTypes];
}

export const itemPageManufacturerSku = "mfrCode"

export async function getListItems(currentListItems: ListItem[]) {
  const currentItemIds = currentListItems.map(({ mzProduct }) => mzProduct);

  return new Promise(() => {
    return cy.document().then((doc) => {
      const listItems = [];

      doc.querySelectorAll(listItemClass).forEach((el) => {
        if (!currentItemIds.includes(el.getAttribute('data-mz-product'))) {
          listItems.push(getListItemDataAttributes(el));
        }
      })

      return [...currentListItems, ...listItems];
    })
  })
}

export function getListItemDataAttributes(el: Element): ListItem {
  const listItem = listItemDataAttributes.reduce((acc, attr) => ({ ...acc, [snakeCase(attr)]: el.getAttribute(`data-${attr}`) }), {} as ListItem);

  listItem.link = el.querySelector(linkClass)?.getAttribute('href') || '';

  return listItem;
}