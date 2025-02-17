import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  subTopics: [],
};

const subTopicsSlice = createSlice({
  name: "subTopics",
  initialState,
  reducers: {
    setSubTopics: (state, action) => {
      state.subTopics = [...action.payload];
    },
    deleteSubTopicReducer: (state, action) => {
      state.subTopics = state.subTopics.filter((item) => {
        return item.id !== action.payload;
      });
    },
  },
});

export const { setSubTopics, deleteSubTopicReducer } = subTopicsSlice.actions;
export default subTopicsSlice.reducer;
