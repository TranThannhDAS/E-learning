import { createSlice } from "@reduxjs/toolkit";

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    favorites: [],
    favoritedCourses: {},
  },
  reducers: {
    setInitialFavorites: (state, action) => {
      state.favorites = action.payload;
      action.payload.forEach((favorite) => {
        state.favoritedCourses[favorite.sourceId] = {
          isFavorite: favorite.isFavorite,
          favoriteId: favorite.id,
        };
      });

      // console.log("State: " + JSON.stringify(state, null, 2));
      // console.log("Action: " + JSON.stringify(action, null, 2));
    },
    addFavoriteSuccess: (state, action) => {
      // console.log("State: " + JSON.stringify(state, null, 2));
      // console.log("Action: " + JSON.stringify(action, null, 2));
      state.favorites.push(action.payload);
      state.favoritedCourses[action.payload.sourceId] = {
        isFavorite: true,
        favoriteId: action.payload.id,
      }; // Cập nhật trạng thái yêu thích
    },

    removeFavoriteSuccess: (state, action) => {
      state.favorites = state.favorites.filter(
        (favorite) => favorite.id !== action.payload
      );
      delete state.favoritedCourses[action.payload];

      // Sử dụng JSON.stringify để log chi tiết
      // console.log("State: " + JSON.stringify(state, null, 2));
      // console.log(
      //   "Action: " +
      //     JSON.stringify(state.favoritedCourses[action.payload], null, 2)
      // );
    },
    setFavoriteStatus: (state, action) => {
      const { courseId, isFavorited, favoriteId } = action.payload;
      state.favoritedCourses[courseId] = {
        isFavorite: isFavorited,
        favoriteId,
      };
      // console.log(
      //   "State: " +
      //     JSON.stringify(
      //       (state.favoritedCourses[courseId] = {
      //         isFavorite: isFavorited,
      //         favoriteId,
      //       }),
      //       null,
      //       2
      //     )
      // );
      // console.log("Action: " + JSON.stringify(action.payload));
    },
  },
});

export const {
  addFavoriteSuccess,
  removeFavoriteSuccess,
  setFavoriteStatus,
  setInitialFavorites,
} = favoritesSlice.actions;
