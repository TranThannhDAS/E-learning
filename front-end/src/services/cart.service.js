import useAxiosWithLoading from "@eproject4/utils/hooks/useAxiosWithLoading";
export const cartServices = () => {
  const { callApi, loading } = useAxiosWithLoading();

  const addCart = async (data) => {
    try {
      const res = await callApi(`/Cart/addCart`, "post", data, null, false);
      return res;
    } catch (err) {
      console.log(err);
    }
  };
  const GetCardByUserID = async (data) => {
    try {
      const res = await callApi(
        `/Cart/GetCart?userID=${data}`,
        "get",
        data,
        null,
        false
      );
      return res;
    } catch (err) {
      console.log(err);
    }
  };
  const DeleteCart = async (sourceID, userID) => {
    try {
      const res = await callApi(
        `/Cart/DeletCart?SourceID=${sourceID}&userid=${userID}`,
        "delete",
        null,
        null,
        false
      );
      return res;
    } catch (err) {
      console.log(err);
    }
  };
  return { addCart, GetCardByUserID, DeleteCart, loading };
};
