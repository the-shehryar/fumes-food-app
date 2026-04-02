import {
  CartCustomization,
  CartItemType,
  Coupon,
  ItemSize,
} from "@/types/type";
import * as Crypto from "expo-crypto";
import { create } from "zustand";

interface CartStore {
  items: CartItemType[];
  deliveryCharges: number;
  discountValue: number;
  isCouponApplied: boolean;
  index?: number;
  coupon?: Coupon;
  customizations: CartItemType[];
  setCouponApplied: (value: boolean) => void;
  setCoupon: (coupon: Coupon) => void;
  addItem: (item: CartItemType) => void;
  removeItem: (id: string, customizations: CartCustomization[]) => void;
  increaseQty: (id: string, customizations: CartCustomization[]) => void;
  decreaseQty: (id: string, customizations: CartCustomization[]) => void;
  updateCustomizations: (
    id: string,
    customizations: CartCustomization[],
  ) => void;
  updateItem: (item: ItemSize[], uid: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// function areCustomizationsEqual(
//   a: CartCustomization[] = [],
//   b: CartCustomization[] = []
// ): boolean {
//   // 1. Quick exit: If lengths differ, they aren't the same.
//   if (a.length !== b.length) return false;

//   // 2. Sort to ensure we are comparing apples to apples.
//   // Using a standard comparison to avoid locale-specific sorting quirks.
//   const sortFn = (x: CartCustomization, y: CartCustomization) =>
//     x.id > y.id ? 1 : x.id < y.id ? -1 : 0;

//   const aSorted = [...a].sort(sortFn);
//   const bSorted = [...b].sort(sortFn);

//   // 3. Compare both the ID and the Checked status.
//   return aSorted.every((item, idx) => {
//     const match = bSorted[idx];
//     return item.id === match.id && item.checked === match.checked;
//   });
// }

function areCustomizationsEqual(
  a: CartCustomization[] = [],
  b: CartCustomization[] = [],
): boolean {
  // 1. Length check is the fastest way to find a mismatch
  if (a.length !== b.length) return false;

  // 2. Sort both arrays by ID to ensure order doesn't matter.
  // We create a shallow copy ([...a]) to avoid mutating the original array.
  const sortFn = (x: CartCustomization, y: CartCustomization) =>
    x.id > y.id ? 1 : x.id < y.id ? -1 : 0;

  const aSorted = [...a].sort(sortFn);
  const bSorted = [...b].sort(sortFn);

  // 3. Deep check: Every item must have the same ID AND same checked status
  return aSorted.every((item, idx) => {
    const match = bSorted[idx];
    return item.id === match.id && item.checked === match.checked;
  });
}
export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  coupon: { code: "", discount: 0 },
  discountValue: 0,
  deliveryCharges: 20,
  isCouponApplied: false,
  customizations: [],
  setCoupon: (coupon) => {
    set({ coupon });
  },
  updateItem: (value, uid) => {
    set({
      items: get().items.map((i) =>
        i.uid === uid ? { ...i, sizes: value } : i,
      ),
    });
  },
  setCouponApplied: (value) => {
    set({ isCouponApplied: value });
  },
  addItem: (item) => {
    const customizations = item.customizations ?? [];

    const existing = get().items.find(
      (i) =>
        i.id === item.id &&
        areCustomizationsEqual(i.customizations ?? [], customizations),
    );

    if (existing) {
      set({
        items: get().items.map((i) =>
          i.id === item.id &&
          areCustomizationsEqual(i.customizations ?? [], customizations)
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        ),
      });
    } else {
      set({
        items: [
          ...get().items,
          {
            ...item,
            quantity: item.quantity,
            customizations,
            uid: Crypto.randomUUID(),
          },
        ],
      });
    }
    console.log("Cart Items:", get().items);
  },
  updateCustomizations: (id, customizations) => {
    set({
      items: get().items.map((i) =>
        i.id === id ? { ...i, customizations } : i,
      ),
    });
  },

  removeItem: (id, customizations = []) => {
    set({
      items: get().items.filter(
        (i) =>
          !(
            i.id === id &&
            areCustomizationsEqual(i.customizations ?? [], customizations)
          ),
      ),
    });
  },

  increaseQty: (id, customizations = []) => {
    set({
      items: get().items.map((i) =>
        i.id === id &&
        areCustomizationsEqual(i.customizations ?? [], customizations)
          ? { ...i, quantity: i.quantity + 1 }
          : i,
      ),
    });
  },

  decreaseQty: (id, customizations = []) => {
    set({
      items: get()
        .items.map((i) =>
          i.id === id &&
          areCustomizationsEqual(i.customizations ?? [], customizations)
            ? { ...i, quantity: i.quantity - 1 }
            : i,
        )
        .filter((i) => i.quantity > 0),
    });
  },

  clearCart: () =>
    set({
      items: [],
      coupon: { code: "", discount: 0 },
      isCouponApplied: false,
      discountValue: 0,
    }),

  getTotalItems: () =>
    get().items.reduce((total, item) => total + item.quantity, 0),

  getTotalPrice: () =>
    get().items.reduce((total, item) => {
      const base = item.sizes;
      let selectedPrice = base.find((s) => s.isSelected)?.price ?? 0;
      const customPrice =
        item.customizations?.reduce(
          (s: number, c: CartCustomization) => (c.checked ? s + c.price : s),
          0,
        ) ?? 0;
      return total + item.quantity * (selectedPrice + customPrice);
    }, 0),
}));
