import { Box, Button, Container, TextField, Typography } from "@mui/material";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import QuestionExam from "./QuestionExam";
import {
  connectExamWithQuestion,
  createExam,
  createQuestionExam,
} from "@eproject4/services/exam.service";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getAllLessionsByChapterId,
  updateLesson,
} from "@eproject4/services/lession.service";
import useCustomSnackbar from "@eproject4/utils/hooks/useCustomSnackbar";

const defaultQuestion = {
  text: "",
  options: ["", "", "", ""],
};

function CreateExam({
  handleClose,
  chapter,
  fetchDataAllLessonsOfChapter,
  fetchDataAllExam,
}) {
  const questionArray = [];
  const methods = useForm({
    defaultValues: {
      title: "",
      duration: "30",
      questions: [defaultQuestion],
    },
  });
  const { handleSubmit, control } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });
  const { createQuestionExamAction } = createQuestionExam();
  const { createExamAction } = createExam();
  const { connectExamWithQuestionAction } = connectExamWithQuestion();
  const { updateLessonAction } = updateLesson();
  const [searchParams] = useSearchParams();
  const idCourse = searchParams.get("id-course");
  const idQuestionExam = [];
  const { getAllLessionsByChapterIdAction } = getAllLessionsByChapterId();
  const [lessionsOfChapter, setLessionsOfChapter] = useState([]);
  const { showSnackbar } = useCustomSnackbar();

  useEffect(() => {
    const fetchDataListLessons = async () => {
      const res = await getAllLessionsByChapterIdAction(chapter?.id);
      setLessionsOfChapter(res?.data?.lessons);
    };

    fetchDataListLessons();
  }, []);

  const onSubmit = async (data) => {
    let maxIndex1 = 0;
    lessionsOfChapter?.forEach(async (item) => {
      for (const l of item?.lesson || []) {
        if (l?.index > maxIndex1) {
          maxIndex1 = l?.index;
        }
      }

      for (const l of item?.lesson || []) {
        if (l?.index === maxIndex1) {
          if (l?.examID !== null) {
            showSnackbar("Bài học đã có bài kiểm tra", "error");
            return;
          }
        }
      }

      // create question
      const resQuestion = await createQuestionExamAction(data);
      resQuestion.map((item) => {
        questionArray.push(item);
      });
      // create exam
      const examData = {
        title: data?.title,
        timeLimit: data?.duration,
        maxQuestion: 0,
        status: false,
        sourceId: idCourse,
      };
      const resExam = await createExamAction(examData);
      questionArray.forEach((item) => {
        idQuestionExam.push(item?.questionID);
      });
      const dataConnect = {
        examID: resExam?.data?.id,
        questionId: idQuestionExam,
      };
      // connect exam with question
      await connectExamWithQuestionAction(dataConnect);

      let maxIndex = 0;
      await Promise.all(
        lessionsOfChapter?.map(async (item) => {
          item?.lesson?.forEach((l) => {
            if (l?.index > maxIndex) {
              maxIndex = l?.index;
            }
          });

          item?.lesson?.forEach(async (l) => {
            if (l?.index === maxIndex) {
              const dataLessonUpdate = {
                id: l?.id,
                title: l?.title,
                author: l?.author,
                description: l?.description,
                videoDuration: l?.videoDuration,
                view: Number(l?.view),
                status: false,
                chapterId: Number(chapter?.id),
                serialDto: {
                  index: l?.index,
                  exam_ID: Number(resExam?.data?.id),
                },
              };
              await updateLessonAction(dataLessonUpdate);
            }
          });
        })
      );
      fetchDataAllExam();
      fetchDataAllLessonsOfChapter();
    });
    handleClose();
  };

  return (
    <FormProvider {...methods}>
      <Typography variant="h6" align="center" gutterBottom>
        Tạo Bài Kiểm Tra
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
            <QuestionExam
              key={index}
              question={question}
              index={index}
              remove={remove}
            />
          ))}
          <Button
            variant="contained"
            sx={{ color: "#FFF" }}
            onClick={() => append(defaultQuestion)}
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
  );
}

export default CreateExam;
