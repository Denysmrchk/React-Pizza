import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Sort } from './filterSlice';

export type SearchPizzaParams = {
  searchValue: string;
  categoryId: number;
  sort: Sort;
  search: string;
  sortType: string;
};

export const fetchPizza = createAsyncThunk<Pizza[], SearchPizzaParams>(
  'pizza/fetchByUserId',
  async (params) => {
    const { search, sortType, categoryId } = params;
    const { data } = await axios.get<Pizza[]>(
      `https://63e4e80c8e1ed4ccf6e8d272.mockapi.io/rp2/pizzas?${
        categoryId > 0 ? `category=${categoryId}` : ''
      }&sortBy=${sortType}${search}`,
    );
    return data;
  },
);
export type Pizza = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  types: number[];
  sizes: number[];
  count: number;
};

interface PizzaSliceState {
  items: Pizza[];
  status: 'loading' | 'success' | 'error';
}

const initialState: PizzaSliceState = {
  items: [],
  status: 'loading',
};

const pizzaSlice = createSlice({
  name: 'pizza',
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<Pizza[]>) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPizza.pending, (state) => {
        state.status = 'loading';
        state.items = [];
      })
      .addCase(fetchPizza.fulfilled, (state, action) => {
        state.status = 'success';
        state.items = action.payload;
      })
      .addCase(fetchPizza.rejected, (state) => {
        state.status = 'error';
        state.items = [];
      });
  },
});

export const { setItems } = pizzaSlice.actions;

export default pizzaSlice.reducer;
