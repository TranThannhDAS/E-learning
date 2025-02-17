import useAxiosWithLoading from "@eproject4/utils/hooks/useAxiosWithLoading";
import axios from "axios";

// create course
export const createCourse = () => {
  const { callApi } = useAxiosWithLoading();

  const createCoursesAction = async (dataForm) => {
    if (
      dataForm?.title &&
      dataForm?.description &&
      dataForm?.thumbnail &&
      dataForm?.slug &&
      dataForm?.status &&
      dataForm?.benefit &&
      dataForm?.requirement &&
      dataForm?.videoIntro &&
      dataForm?.userId &&
      dataForm?.topicId
    ) {
      const formData = new FormData();
      formData.append("title", dataForm.title);
      formData.append("description", dataForm.description);
      formData.append("thumbnail", dataForm.thumbnail);
      formData.append("slug", dataForm.slug);
      formData.append("status", dataForm.status);
      formData.append("rating", "1");
      if (dataForm?.benefit.length > 0) {
        dataForm.benefit.map((item) => {
          formData.append("benefit", item);
        });
      } else {
        formData.append("benefit", dataForm.benefit);
      }

      if (dataForm?.requirement.length > 0) {
        dataForm.requirement.map((item) => {
          formData.append("requirement", item);
        });
      } else {
        formData.append("requirement", dataForm.requirement);
      }
      formData.append("videoIntro", dataForm.videoIntro);
      formData.append("price", dataForm.price);
      formData.append("userId", dataForm.userId);
      formData.append("topicId", dataForm.topicId);
      formData.append("subTopicId", dataForm.subTopicId);

      try {
        const res = await callApi(
          "/Source",
          "post",
          formData,
          "Tạo khóa học thành công",
          true
        );

        return res;
      } catch (err) {
        throw new Error(err);
      }
    }
  };

  return { createCoursesAction };
};

// Get courses
export const getAllCourses = () => {
  const { callApi } = useAxiosWithLoading();

  const getCoursesAction = async () => {
    try {
      const res = await callApi("/Source", "get", null, null, false);
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };
  const getCourseActionGroupByTopic = async () => {
    try {
      const res = await callApi(
        "/Source/groupbytopic",
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
  const getDataHome = async () => {
    try {
      const res = await callApi(
        "/Search/getDataHome",
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
  const getDataHome2 = async () => {
    try {
      const res = await callApi(
        "/Search/getDataHome2",
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
  const getTopicandSubtopic = async () => {
    try {
      const res = await callApi(
        "/Search/getTopicandSubtopic",
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

  return {
    getCoursesAction,
    getCourseActionGroupByTopic,
    getDataHome,
    getDataHome2,
    getTopicandSubtopic,
  };
};

// Get course pagination
export const getCoursesPagination = () => {
  const { callApi } = useAxiosWithLoading();

  const getCoursesPaginationAction = async (pageIndex, pageSize) => {
    try {
      const res = await callApi(
        `/Source/pagination?PageIndex=${pageIndex}&PageSize=${pageSize}`, // Sửa thành dấu backticks và đóng dấu ngoặc kép
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

  return { getCoursesPaginationAction };
};

// Get course by id
export const getCourseById = () => {
  const { callApi } = useAxiosWithLoading();

  const getCourseByIdAction = async (id) => {
    try {
      const res = await callApi(`/Source/${id}`, "get", null, null, false);
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  return { getCourseByIdAction };
};

// Delete source
export const deleteCourse = () => {
  const { callApi } = useAxiosWithLoading();

  const deleteCourseAction = async (id) => {
    try {
      const res = await callApi(
        `/Source/${id}`,
        "delete",
        null,
        "Xóa khóa học thành công",
        true
      );
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  return { deleteCourseAction };
};

//Kiểm tra course đã order
export const CourseOrder = () => {
  const { callApi } = useAxiosWithLoading();
  const CheckCourseOrder = async (userid, sourceID) => {
    try {
      const res = await callApi(
        `/Source/CheckOrderSource?userId=${userid}&sourceId=${sourceID}`,
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
  return { CheckCourseOrder };
};

// Update course
export const updateCourse = () => {
  try {
    const updateCourseAction = async (id, data) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("slug", data.slug);
      formData.append("status", data.status);
      formData.append("rating", data.rating);
      if (data?.benefit.length > 0) {
        data.benefit.map((item) => {
          formData.append("benefit", item);
        });
      } else {
        formData.append("benefit", formData.benefit);
      }

      if (data?.requirement.length > 0) {
        data.requirement.map((item) => {
          formData.append("requirement", item);
        });
      } else {
        formData.append("requirement", formData.requirement);
      }
      formData.append("price", data.price);
      formData.append("userId", data.userId);
      formData.append("topicId", data.topicId);
      formData.append("subTopicId", data.subTopicId);

      if (data?.videoIntro) {
        formData.append("videoIntro", data.videoIntro);
      }
      if (data?.thumbnail) {
        formData.append("thumbnail", data.thumbnail);
      }

      const res = await axios.put(
        `http://localhost:5187/api/Source/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res;
    };

    return { updateCourseAction };
  } catch (err) {
    throw new Error(err);
  }
};
