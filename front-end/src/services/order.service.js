import useAxiosWithLoading from "@eproject4/utils/hooks/useAxiosWithLoading";

export const getOrderforFree = () => {
  const { callApi } = useAxiosWithLoading();

  const getOrderforFreeAction = async (userID, sourceID) => {
    try {
      const payload = {
        userID: userID,
        sourceID: sourceID,
      };

      const res = await callApi(
        "/Order/insert-source-free",
        "post",
        payload,
        null,
        false
      );
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  return { getOrderforFreeAction };
};
export const OrderPaid = () => {
  const { callApi, loading } = useAxiosWithLoading();
  const createOrder = async (data) => {
    try {
      const res = await callApi(
        "/Order/create-order",
        "post",
        data,
        null,
        false
      );
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };
  const confirmPayment = async (data) => {
    try {
      const res = await callApi(
        "/Order/confirm-payment",
        "post",
        data,
        null,
        false
      );
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };
  return { createOrder, confirmPayment, loading };
};

// get all order
export const getAllOrder = () => {
  const { callApi } = useAxiosWithLoading();

  const getAllOrderAction = async () => {
    try {
      const res = await callApi(
        "/Order/get-all-order",
        "get",
        null,
        null,
        null
      );
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  return { getAllOrderAction };
};
export const getAllOrdersPag = () => {
  const { callApi } = useAxiosWithLoading();

  const getAllOrdersPagAction = async (pageIndex, pageSize) => {
    try {
      const res = await callApi(
        `/Order/get-all-order-pagination?PageIndex=${pageIndex}&PageSize=${pageSize}`,
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

  return { getAllOrdersPagAction };
};
