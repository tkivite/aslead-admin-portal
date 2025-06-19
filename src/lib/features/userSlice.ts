import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
   username:"",
   password:"",
   role:""

  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser(state, action) {
      state.value = action.payload;
    },
    deleteUser(state) {
      state.value = {
        username:"",
        password:"",
        role:""
      };
    },
  },
});

export const { addUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;