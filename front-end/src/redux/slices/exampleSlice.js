import { createSlice } from "@reduxjs/toolkit";

const initialState = { username: "", email: "" };

export const exampleSlice = createSlice({
  name: "example",
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    resetUser(state) {
      state.username = initialState.username;
      state.email = initialState.email;
    },
  },
});

export const { setUsername, setEmail, resetUser } = exampleSlice.actions;
