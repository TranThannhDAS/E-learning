import useAxiosWithLoading from "@eproject4/utils/hooks/useAxiosWithLoading";

// Get sub topics
export const getSubTopics = () => {
  const { callApi } = useAxiosWithLoading();

  const getSubTopicsAction = async () => {
    try {
      const res = await callApi("/SubTopic", "get", null, null, false);
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };
  return { getSubTopicsAction };
};

// Create sub topic
export const createSubTopic = () => {
  const { callApi } = useAxiosWithLoading();

  const createSubTopicAction = async (data) => {
    try {
      const res = await callApi(
        "/SubTopic",
        "post",
        data,
        "Tạo danh mục con thành công"
      );
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  return { createSubTopicAction };
};

// Delete sub topic
export const deleteSubTopic = () => {
  const { callApi } = useAxiosWithLoading();

  const deleteSubTopicAction = async (id) => {
    const res = await callApi(
      `/SubTopic/${id}`,
      "delete",
      null,
      "Xóa danh mục con thành công"
    );

    return res;
  };

  return { deleteSubTopicAction };
};

// Update sub topic
export const updateSubTopic = () => {
  const { callApi } = useAxiosWithLoading();

  const updateSubTopicAction = async (dataUpdate) => {
    try {
      const res = await callApi(
        `/SubTopic/${dataUpdate?.id}`,
        "put",
        dataUpdate,
        "Cập nhật danh mục con thành công"
      );
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  return { updateSubTopicAction };
};
