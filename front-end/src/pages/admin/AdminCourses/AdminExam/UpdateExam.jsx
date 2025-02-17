import { useEffect } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Modal,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  deleteQuestion,
  updateExam,
  updateQuestions,
} from "@eproject4/services/exam.service";
import { useSearchParams } from "react-router-dom";

const defaultQuestion = {
  text: "",
  idOptions: [
    { id: "", answer: "" },
    { id: "", answer: "" },
    { id: "", answer: "" },
    { id: "", answer: "" },
  ],
  correctOption: null,
};

function UpdateExam({
  openUpdateExamModal,
  handleUpdateExamModalClose,
  lesson,
  fetchDataExamDetail,
  examDetail,
  fetchDataAllLessonsOfChapter,
}) {
  const methods = useForm({
    defaultValues: {
      title: "",
      duration: "30",
      questions: [],
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const { updateQuestionAction } = updateQuestions();
  const { updateExamAction } = updateExam();
  const { deleteQuestionAction } = deleteQuestion();

  const [searchParams] = useSearchParams();
  const idCourse = searchParams.get("id-course");

  useEffect(() => {
    if (lesson?.id && openUpdateExamModal) {
      fetchDataExamDetail(lesson.id);
    }
  }, [lesson, openUpdateExamModal]);

  useEffect(() => {
    if (examDetail) {
      const questions = examDetail?.exam?.questions?.map((question) => {
        let correctOption = null;
        return {
          text: question?.questionText,
          questionId: question?.questionID,
          idOptions: question?.options?.map((option, index) => {
            if (option?.isCorrect) {
              correctOption = index;
            }
            return {
              id: option?.id,
              answer: option?.answer,
            };
          }) || [
            { id: "", answer: "" },
            { id: "", answer: "" },
            { id: "", answer: "" },
            { id: "", answer: "" },
          ],
          correctOption: correctOption,
        };
      });

      reset({
        title: examDetail?.exam?.title || "",
        duration: examDetail?.exam?.timeLimit || "30",
        questions: questions,
      });
    }
  }, [examDetail, reset]);

  const onSubmit = async (data) => {
    const originalQuestionIds =
      examDetail?.exam?.questions.map((q) => q.questionID) || [];
    const newQuestionIds = data.questions.map((q) => q.questionId);

    const questionsToDelete = originalQuestionIds.filter(
      (id) => !newQuestionIds.includes(id)
    );
    const questionsToAdd = newQuestionIds.filter(
      (id) => !originalQuestionIds.includes(id)
    );

    const questionsChanged =
      questionsToDelete.length > 0 || questionsToAdd.length > 0;

    if (questionsChanged) {
      await Promise.all(
        questionsToDelete.map(async (id) => {
          await deleteQuestionAction(id);
        })
      );

      await updateQuestionAction(data, examDetail?.exam?.id);
    } else {
      await updateQuestionAction(data, examDetail?.exam?.id);
    }
    const examData = {
      title: data?.title,
      timeLimit: data?.duration,
      maxQuestion: 0,
      status: false,
      sourceId: idCourse,
    };
    await updateExamAction(examDetail?.exam?.id, examData);

    handleUpdateExamModalClose();
    fetchDataAllLessonsOfChapter();
  };

  return (
    <Box>
      <Modal
        open={openUpdateExamModal}
        onClose={handleUpdateExamModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 650,
            height: 700,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            overflowY: "auto",
          }}>
          <FormProvider {...methods}>
            <Typography variant="h6" align="center" gutterBottom>
              Cập nhật Bài Kiểm Tra
            </Typography>
            <Container maxWidth="md">
              <Controller
                name="title"
                control={control}
                rules={{ required: "Tiêu đề không được bỏ trống" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tiêu đề"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    error={!!methods.formState.errors.title}
                    helperText={methods.formState.errors.title?.message}
                  />
                )}
              />

              <Controller
                name="duration"
                control={control}
                rules={{
                  required: "Thời gian làm bài không được bỏ trống",
                  pattern: {
                    value: /^[1-9]\d*$/,
                    message: "Thời gian làm bài phải là số nguyên dương",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Thời gian làm bài (phút)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="number"
                    error={!!methods.formState.errors.duration}
                    helperText={methods.formState.errors.duration?.message}
                  />
                )}
              />
            </Container>
            <Container maxWidth="md">
              <Box component="form" onSubmit={handleSubmit(onSubmit)} mt={3}>
                {fields.map((question, index) => (
                  <Box
                    key={question.id} // Use question.id here to ensure React tracks each item correctly
                    mb={3}
                    p={2}
                    border={1}
                    borderRadius={2}
                    borderColor="grey.300">
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="h6">{`Câu ${index + 1}`}</Typography>
                      <IconButton onClick={() => remove(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Controller
                      name={`questions.${index}.text`}
                      control={control}
                      rules={{ required: "Câu hỏi không được bỏ trống" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Nội dung câu hỏi"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          error={!!errors?.questions?.[index]?.text}
                          helperText={errors?.questions?.[index]?.text?.message}
                        />
                      )}
                    />
                    <FormControl
                      component="fieldset"
                      margin="normal"
                      sx={{ width: "95%" }}>
                      <FormLabel component="legend">Các lựa chọn</FormLabel>
                      <RadioGroup>
                        {question.idOptions.map((option, optIndex) => (
                          <Box
                            key={optIndex}
                            display="flex"
                            alignItems="center"
                            width="100%"
                            justifyContent="space-between">
                            <Controller
                              name={`questions.${index}.idOptions.${optIndex}.answer`}
                              control={control}
                              rules={{
                                required: "Lựa chọn không được bỏ trống",
                              }}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  sx={{ marginRight: "15px" }}
                                  label={`Lựa chọn ${optIndex + 1}`}
                                  variant="outlined"
                                  fullWidth
                                  margin="normal"
                                  error={
                                    !!errors?.questions?.[index]?.idOptions?.[
                                      optIndex
                                    ]?.answer
                                  }
                                  helperText={
                                    errors?.questions?.[index]?.idOptions?.[
                                      optIndex
                                    ]?.answer?.message
                                  }
                                />
                              )}
                            />
                            <Controller
                              name={`questions.${index}.correctOption`}
                              control={control}
                              render={({ field }) => (
                                <FormControlLabel
                                  control={
                                    <Radio
                                      {...field}
                                      value={optIndex}
                                      checked={field.value == optIndex}
                                    />
                                  }
                                  label="Đúng"
                                />
                              )}
                            />
                          </Box>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Box>
                ))}
                <Button
                  variant="contained"
                  sx={{ color: "#FFF" }}
                  onClick={() => {
                    append({ ...defaultQuestion });
                  }}
                  fullWidth>
                  Thêm Câu Hỏi
                </Button>
                <Box mt={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    fullWidth>
                    Lưu Bài Kiểm Tra
                  </Button>
                </Box>
              </Box>
            </Container>
          </FormProvider>
        </Box>
      </Modal>
    </Box>
  );
}

export default UpdateExam;
