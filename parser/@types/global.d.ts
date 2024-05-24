declare namespace AceHardware {
  type PromoType = "Buy & Get";
  type ShippingType = "DirectShip" | "InStorePickup" | "Delivery";

  interface ListItem {
    aceRewards?: string;
    discount: string;
    itemName: string;
    link: string;
    mzProduct: string;
    price: string;
    promo?: PromoType | null;
    shipping: ShippingType[];
    url: string;
  }
}