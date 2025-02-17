import useAxiosWithLoading from "@eproject4/utils/hooks/useAxiosWithLoading";

export const getAllFavorite = () => {
  const { callApi } = useAxiosWithLoading();
  const getAllFavoriteAction = async () => {
    try {
      const res = await callApi(
        "/FavoriteSource/getall",
        "get",
        null,
        null,
        false
      );
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  return { getAllFavoriteAction };
};

export const AddFavoriteSource = () => {
  const { callApi } = useAxiosWithLoading();
  const addFavoriteSourceAction = async (userid, sourceId) => {
    try {
      const res = await callApi(
        `/FavoriteSource?userId=${userid}&sourceId=${sourceId}`,
        "POST",
        null,
        null,
        false
      );
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };
  return {
    addFavoriteSourceAction,
  };
};

export const deleteFavoriteSource = () => {
  const { callApi } = useAxiosWithLoading();
  const DeleteFavoriteSourceAction = async (id) => {
    try {
      const res = await callApi(
        `/FavoriteSource/?favoriteId=${id}`,
        "DELETE",
        null,
        null,
        false
      );
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };
  return { DeleteFavoriteSourceAction };
};
export const getsourceFavoritebyuserid = () => {
  const { callApi } = useAxiosWithLoading();
  const getsourceFavoritebyuseridAction = async (
    userid,
    PageSize,
    PageIndex
  ) => {
    try {
      const res = await callApi(
        `/FavoriteSource/getsourcefavoritebyuserid/${userid}?PageSize=${PageSize}&PageIndex=${PageIndex}`,
        "get",
        null,
        null,
        false
      );
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };
  return { getsourceFavoritebyuseridAction };
};
