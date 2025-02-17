import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  accessToken: "",
  refreshToken: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    clearUser: (state) => {
      state.user = {};
      state.accessToken = "";
      state.refreshToken = "";
    },
  },
});

export const { setUserInfo, clearUser } = userSlice.actions;
export default userSlice.reducer;
