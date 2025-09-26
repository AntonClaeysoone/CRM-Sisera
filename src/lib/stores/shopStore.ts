import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Shop = 'sisera' | 'boss';

interface ShopStore {
  selectedShop: Shop;
  setSelectedShop: (shop: Shop) => void;
  getShopName: (shop: Shop) => string;
  getShopDisplayName: () => string;
}

export const useShopStore = create<ShopStore>()(
  persist(
    (set, get) => ({
      selectedShop: 'sisera',

      setSelectedShop: (shop: Shop) => {
        set({ selectedShop: shop });
      },

      getShopName: (shop: Shop) => {
        return shop === 'sisera' ? 'Sisera' : 'Boss';
      },

      getShopDisplayName: () => {
        const { selectedShop, getShopName } = get();
        return getShopName(selectedShop);
      }
    }),
    {
      name: 'shop-storage',
      partialize: (state) => ({ selectedShop: state.selectedShop }),
    }
  )
);



