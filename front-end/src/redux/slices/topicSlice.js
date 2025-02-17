import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  topics: [],
  topicDetail: {},
  total: 0,
};

const topicSlice = createSlice({
  name: "topic",
  initialState,
  reducers: {
    setTopics: (state, action) => {
      state.topics = [...action.payload];
    },
    setTotalCount: (state, action) => {
      state.total = action.payload;
    },
    deleteTopicReducer: (state, action) => {
      state.topics = state.topics.filter((item) => {
        return item.id !== action.payload;
      });
    },
  },
});

export const { setTopics, deleteTopicReducer, setTotalCount } =
  topicSlice.actions;
export default topicSlice.reducer;
