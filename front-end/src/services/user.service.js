import useAxiosWithLoading from "@eproject4/utils/hooks/useAxiosWithLoading";

// Get user by id
export const getUserById = () => {
  const { callApi } = useAxiosWithLoading();

  const getUserByIdAction = async (id) => {
    try {
      const res = await callApi(`/User/${id}`, "get", null, null, false);
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  return { getUserByIdAction };
};

// Get all users
export const getAllUsers = () => {
  const { callApi } = useAxiosWithLoading();

  const getAllUsersAction = async () => {
    try {
      const res = await callApi("/User/get-all-user", "get", null, null, false);
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  return { getAllUsersAction };
};
