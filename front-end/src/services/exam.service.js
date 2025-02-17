import useAxiosWithLoading from "@eproject4/utils/hooks/useAxiosWithLoading";
import axios from "axios";

export const createQuestionExam = () => {
  const createQuestionExamAction = async (data) => {
    const resdata = data?.questions?.map(async (question) => {
      try {
        if (
          question?.text &&
          question?.options &&
          question?.correctOption !== undefined
        ) {
          const completeOption = question?.options?.map((option, index) => {
            return {
              Answer: option,
              IsCorrect: index == question?.correctOption,
            };
          });

          const dataForm = new FormData();
          dataForm.append("Question", question.text);
          dataForm.append("Options", JSON.stringify(completeOption));

          const res = await axios.post(
            "http://localhost:5187/api/Exam/createquestion",
            dataForm,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          return res?.data;
        }
      } catch (err) {
        throw new Error(err);
      }
    });

    return Promise.all(resdata);
  };

  return { createQuestionExamAction };
};

// Create Exam
export const createExam = () => {
  const { callApi } = useAxiosWithLoading();

  const createExamAction = async (data) => {
    try {
      const res = await callApi(
        "/Exam",
        "post",
        data,
        "Tạo bài kiểm tra thành công",
        true
      );
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  return { createExamAction };
};

// Connect exam with question
export const connectExamWithQuestion = () => {
  const { callApi } = useAxiosWithLoading();

  const connectExamWithQuestionAction = async (data) => {
    try {
      const res = await callApi(
        "/Exam/connectexamquestion",
        "post",
        data,
        null,
        null
      );
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  return { connectExamWithQuestionAction };
};

// Get All Exam
export const getAllExam = () => {
  const { callApi } = useAxiosWithLoading();

  const getAllExamAction = async () => {
    try {
      const res = await callApi("/Exam", "get", null, null, null);
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  return { getAllExamAction };
};

// Delete Exam
export const deleteExam = () => {
  const { callApi } = useAxiosWithLoading();

  const deleteExamAction = async (id) => {
    try {
      const res = await callApi(
        `/Exam/${id}`,
        "delete",
        null,
        "Xóa bài kiểm tra thành công",
        true
      );
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  return { deleteExamAction };
};

// Get Exam By Id
export const getExamById = () => {
  const { callApi } = useAxiosWithLoading();

  const getExamByIdAction = async (id) => {
    try {
      const res = await callApi(`/Exam/detail/${id}`, "get", null, null, null);
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  return { getExamByIdAction };
};

// Update question
export const updateQuestions = () => {
  const { callApi } = useAxiosWithLoading();
  const { connectExamWithQuestionAction } = connectExamWithQuestion();
  const idQuestionExam = [];

  const updateQuestionAction = async (data, examId) => {
    const resdata = data?.questions?.map(async (question) => {
      if (question?.questionId) {
        try {
          if (
            question?.text &&
            question?.idOptions &&
            question?.correctOption !== undefined
          ) {
            const completeOption = question?.idOptions?.map((option, index) => {
              return {
                id: Number(option?.id),
                Answer: option?.answer,
                IsCorrect: index == question?.correctOption,
                QuestionId: Number(question?.questionId),
              };
            });

            const dataUpdate = {
              questionId: Number(question?.questionId),
              content: question?.text,
              options: JSON.stringify(completeOption),
            };

            const res = await callApi(
              "/Exam/updatequestion",
              "put",
              dataUpdate,
              "Cập nhật câu hỏi thành công",
              true
            );
            return res?.data;
          }
        } catch (err) {
          throw new Error(err);
        }
        return;
      } else {
        try {
          if (
            question?.text &&
            question?.idOptions &&
            question?.correctOption !== undefined
          ) {
            const completeOption = question?.idOptions?.map((option, index) => {
              return {
                Answer: option?.answer,
                IsCorrect: index == question?.correctOption,
              };
            });

            const dataForm = new FormData();
            dataForm.append("Question", question.text);
            dataForm.append("Options", JSON.stringify(completeOption));

            const res = await axios.post(
              "http://localhost:5187/api/Exam/createquestion",
              dataForm,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            const resQuestion = res?.data;

            idQuestionExam.push(resQuestion?.questionID);

            const dataConnect = {
              examID: examId,
              questionId: idQuestionExam,
            };

            await connectExamWithQuestionAction(dataConnect);
          }
        } catch (err) {
          throw new Error(err);
        }
      }
    });

    return Promise.all(resdata);
  };

  return { updateQuestionAction };
};

// Update Exam
export const updateExam = () => {
  const { callApi } = useAxiosWithLoading();

  const updateExamAction = async (id, data) => {
    try {
      const res = await callApi(
        `/Exam/${id}`,
        "put",
        data,
        "Cập nhật bài kiểm tra thành công",
        true
      );
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };
  return { updateExamAction };
};

// Delete question
export const deleteQuestion = () => {
  const { callApi } = useAxiosWithLoading();

  const deleteQuestionAction = (id) => {
    try {
      const res = callApi(`/Question/${id}`, "delete", null, null, false);
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  return { deleteQuestionAction };
};

// End Exam
export const endExamm = () => {
  const { callApi } = useAxiosWithLoading();

  const endExamAction = async (id, userId) => {
    try {
      const res = await callApi(
        `/Exam/end/${id}?userId=${userId}`,
        "post",
        null,
        null,
        false
      );
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  return { endExamAction };
};

// Calculate Score Exam
export const calculateScoreExam = () => {
  const { callApi } = useAxiosWithLoading();

  const calculateScoreExamAction = async (id, data) => {
    try {
      const res = await callApi(
        `/Exam/${id}/calculatescore`,
        "post",
        data,
        null,
        null
      );
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  return { calculateScoreExamAction };
};

// Create Answer
export const createAnswer = () => {
  const { callApi } = useAxiosWithLoading();

  const createAnswerAction = async (data) => {
    try {
      const res = await callApi("/Answer", "post", data, null, null);
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  return { createAnswerAction };
};

// Get Answer
export const getAnswer = () => {
  const { callApi } = useAxiosWithLoading();

  const getAnswerAction = async () => {
    try {
      const res = await callApi("/Answer", "get", null, null, null);
      return res;
    } catch (err) {
      throw new Error(err);
    }
  };
  return { getAnswerAction };
};
