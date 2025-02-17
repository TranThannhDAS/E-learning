import useAxiosWithLoading from "@eproject4/utils/hooks/useAxiosWithLoading";
import axios from "axios";

// Get all lessions by chapter id
export const getAllLessionsByChapterId = () => {
  const { callApi } = useAxiosWithLoading();

  const getAllLessionsByChapterIdAction = async (chapterId) => {
    try {
      const res = await callApi(
        `/Lesson/GetAllLessonsByChapterID?chapterID=${chapterId}`,
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

  return { getAllLessionsByChapterIdAction };
};

// Chunked file
export const chunkedFile = () => {
  const chunkedFileAction = async (chunk, counter, fileGuid) => {
    try {
      const res = await axios.post(
        `http://localhost:5187/api/Lesson/Chukedfile?id=${counter}&fileName=${fileGuid}`,
        chunk,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  return { chunkedFileAction };
};

// Create lesson
export const createLesson = () => {
  const createLessonAction = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:5187/api/Lesson",
        {
          ...data,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res?.data;
    } catch (err) {
      throw new Error(err);
    }
  };

  return { createLessonAction };
};

// Delete lesson
export const deleteLesson = () => {
  const { callApi } = useAxiosWithLoading();

  const deleteLessonAction = async (id) => {
    try {
      const res = await callApi(
        `/Lesson/${id}`,
        "delete",
        null,
        "Xóa bài giảng thành công",
        true
      );
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  return { deleteLessonAction };
};

// update lesson
export const updateLesson = () => {
  const { callApi } = useAxiosWithLoading();

  const updateLessonAction = async (data) => {
    try {
      const res = await callApi(
        "/Lesson/UpdateLesson",
        "put",
        data,
        "Cập nhật bài giảng thành công",
        true
      );
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  return { updateLessonAction };
};

// Get lesson by id
export const getLessonById = () => {
  const { callApi } = useAxiosWithLoading();

  const getLessonByIdAction = async (id) => {
    try {
      const res = await callApi(`/Lesson/${id}`, "get", null, null, null);
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  return { getLessonByIdAction };
};

// Update view of lesson
export const updateViewOfLesson = () => {
  const { callApi } = useAxiosWithLoading();

  const updateViewOfLessonAction = async (id) => {
    try {
      const res = await callApi(
        `/Lesson/updateview/${id}`,
        "put",
        null,
        null,
        null
      );
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  return { updateViewOfLessonAction };
};
