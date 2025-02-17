import useAxiosWithLoading from "@eproject4/utils/hooks/useAxiosWithLoading";

// Get all chapter
export const getAllChapters = () => {
  const { callApi } = useAxiosWithLoading();

  const getAllChaptersAction = async () => {
    try {
      const res = await callApi("/Chapter", "get", null, false);
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  return { getAllChaptersAction };
};

// Get chapter by source id
export const getChapterBySourceId = () => {
  const { callApi } = useAxiosWithLoading();

  const getChapterBySourceIdAction = async (sourceId) => {
    try {
      const res = await callApi(
        `/Chapter/GetChapterBySourceID?sourceID=${sourceId}`,
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

  return { getChapterBySourceIdAction };
};

// Create chapter
export const createChapter = () => {
  const { callApi } = useAxiosWithLoading();

  const createChapterAction = async (data) => {
    if (data?.title && data?.description && data?.sourceId && data?.index) {
      try {
        const res = await callApi(
          "/Chapter",
          "post",
          data,
          "Tạo chương thành công",
          true
        );
        return res;
      } catch (err) {
        throw new Error(err);
      }
    }
  };

  return { createChapterAction };
};

// Update chapter
export const updateChapter = () => {
  const { callApi } = useAxiosWithLoading();

  const updateChapterAction = async (data, id) => {
    try {
      const res = await callApi(
        `/Chapter/${id}`,
        "put",
        data,
        "Cập nhật chương thành công",
        true
      );
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  return { updateChapterAction };
};

// Delete chapter
export const deleteChapter = () => {
  const { callApi } = useAxiosWithLoading();

  const deleteChapterAction = async (id) => {
    try {
      const res = await callApi(
        `/Chapter/${id}`,
        "delete",
        null,
        "Xóa chương thành công",
        true
      );
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  return { deleteChapterAction };
};
