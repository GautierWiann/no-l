import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {_id: 'RwvZNfRY3HthTWSual7hLQDK'},
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    _id: (state, action) => {
      state.value.id=action.payload;
    },
  },
});

export const { _id } = userSlice.actions;
export default userSlice.reducer;
