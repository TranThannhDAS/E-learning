import useAxiosWithLoading from "@eproject4/utils/hooks/useAxiosWithLoading";

// Get topics
export const getTopics = () => {
  const { callApi } = useAxiosWithLoading();

  const getTopicsAction = async (pageIndex, pageSize) => {
    try {
      const res = await callApi(
        `/Topic?PageIndex=${pageIndex}&PageSize=${pageSize}`,
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
  return { getTopicsAction };
};

// Get all topics
export const getAllTopics = () => {
  const { callApi } = useAxiosWithLoading();

  const getAllTopicsAction = async () => {
    try {
      const res = await callApi("/Topic", "get", null, null, false);
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  return { getAllTopicsAction };
};

//Get Topic By Id

export const getTopicById = () => {
  const { callApi } = useAxiosWithLoading();

  const getTopicByIdAction = async (id) => {
    try {
      const res = await callApi(`/Topic/${id}`, "get", null, null, false);
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };
  return { getTopicByIdAction };
};

// Create topic
export const createTopic = () => {
  const { callApi } = useAxiosWithLoading();

  const createTopicAction = async (data) => {
    try {
      const res = await callApi(
        "/Topic",
        "post",
        data,
        "Tạo danh mục thành công",
        true
      );
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };
  return { createTopicAction };
};

// delete topic
export const deleteTopic = () => {
  const { callApi } = useAxiosWithLoading();

  const deleteTopicAction = async (id) => {
    const res = await callApi(
      `/Topic/${id}`,
      "delete",
      null,
      "Xóa danh mục thành công",
      true
    );

    return res;
  };
  return { deleteTopicAction };
};

// update topics
export const updateTopic = () => {
  const { callApi } = useAxiosWithLoading();

  const updateTopicAction = async (dataUpdate) => {
    try {
      const res = await callApi(
        `/Topic/${dataUpdate?.id}`,
        "put",
        dataUpdate,
        "Cập nhật danh mục thành công"
      );
    } catch (err) {
      throw new Error(err);
    }
  };
  return { updateTopicAction };
};
