import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import type { PayloadAction } from '@reduxjs/toolkit';
export type CartItem = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  type: string;
  size: number;
  count: number;
};

interface CartSliceState {
  totalPrice: number;
  items: CartItem[];
}

const initialState: CartSliceState = {
  items: [],
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const findItem = state.items.filter((obj) => obj.id === action.payload.id);
      if (findItem.length > 0) {
        const findItemId = findItem.find(
          (obj) => obj.size === action.payload.size && obj.type === action.payload.type,
        );
        if (findItemId) {
          findItemId.count++;
        } else {
          state.items.push({
            ...action.payload,
            count: 1,
          });
        }
      } else {
        state.items.push({
          ...action.payload,
          count: 1,
        });
      }
      state.totalPrice = state.items.reduce((sum, obj) => {
        return obj.price * obj.count + sum;
      }, 0);
    },
    plusItem(state, action) {
      const findItem = state.items.find(
        (obj) =>
          obj.title === action.payload.title &&
          obj.size === action.payload.size &&
          obj.type === action.payload.type,
      );
      if (findItem) findItem.count++;

      state.totalPrice = state.items.reduce((sum, obj) => {
        return obj.price * obj.count + sum;
      }, 0);
    },

    minusItem(state, action) {
      const findItem = state.items.find(
        (obj) =>
          obj.id === action.payload.id &&
          obj.type === action.payload.type &&
          obj.size === action.payload.size,
      );
      if (findItem)
        if (findItem.count > 0) {
          console.log([findItem.size, findItem.id, findItem.type]);
          findItem.count--;
        } else {
          removeItem(findItem);
        }
      state.totalPrice = state.items.reduce((sum, obj) => {
        return obj.price * obj.count + sum;
      }, 0);
    },
    removeItem(state, action) {
      state.items = state.items.filter(
        (obj) =>
          obj.id === action.payload.id &&
          obj.size === action.payload.size &&
          obj.title === action.payload.titte,
      );
      state.totalPrice = state.items.reduce((sum, obj) => {
        return obj.price * obj.count + sum;
      }, 0);
    },
    clearItems(state) {
      state.items = [];
      state.totalPrice = 0;
    },
  },
});

export const selectCart = (state: RootState) => state.cart;

export const { addItem, removeItem, minusItem, clearItems, plusItem } = cartSlice.actions;

export default cartSlice.reducer;
