import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {menuChoice : "Session de travail"},
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    menuChoice: (state, action) => {
      state.value=action.payload;
    },
  },
});

export const { menuChoice} = menuSlice.actions;
export default menuSlice.reducer;
