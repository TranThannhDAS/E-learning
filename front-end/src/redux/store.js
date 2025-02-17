import { configureStore } from "@reduxjs/toolkit";
import { exampleSlice } from "./slices/exampleSlice.js";
import userReducer from "./slices/userSlice.js";
import topicReducer from "./slices/topicSlice.js";
import subTopicsReducer from "./slices/subTopicSlice.js";
import { favoritesSlice } from "./slices/favoriteSlice.js";
import { enrollmentSlice } from "./slices/enrollmentSlice.js";
import orderSlide from "./slices/orderSlide.js";

export const store = configureStore({
  reducer: {
    favorites: favoritesSlice.reducer,
    example: exampleSlice.reducer,
    user: userReducer,
    topics: topicReducer,
    subTopics: subTopicsReducer,
    enrollment: enrollmentSlice.reducer,
    shoppingCart: orderSlide
  },
});
