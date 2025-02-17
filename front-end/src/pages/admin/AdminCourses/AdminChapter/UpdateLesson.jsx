import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { chunkedFile, updateLesson } from "@eproject4/services/lession.service";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  LinearProgress,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Controller, set, useForm } from "react-hook-form";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  video: Yup.mixed().required("Video is required"),
});

function UpdateLesson({
  openUpdateLessonModal,
  handleUpdateLessonModalClose,
  fetchDataAllLessonsOfChapter,
  lessonDetail,
}) {
  const chunkSize = 3 * 1024 * 1024;
  let isChunkedSuccess = false;
  const [showProgress, setShowProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { chunkedFileAction } = chunkedFile();
  const [defaultVideo, setDefaultVideo] = useState(null);
  const { updateLessonAction } = updateLesson();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: lessonDetail?.lesson?.title || "",
      description: lessonDetail?.lesson?.description || "",
      video: "video",
      videoUrl: lessonDetail?.lesson?.video || null,
    },
  });

  useEffect(() => {
    if (lessonDetail) {
      setDefaultVideo(lessonDetail?.lesson?.video);
      reset({
        title: lessonDetail?.lesson?.title,
        description: lessonDetail?.lesson?.description,
        video: "video",
        videoUrl: lessonDetail?.lesson?.video,
      });
    }
  }, [lessonDetail, reset]);

  const handleVideoFile = async (file) => {
    return new Promise((resolve, reject) => {
      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";

      videoElement.onloadedmetadata = function () {
        window.URL.revokeObjectURL(videoElement.src);
        resolve(videoElement.duration);
      };

      videoElement.onerror = function () {
        reject("Error loading video file.");
      };

      videoElement.src = URL.createObjectURL(file);
    });
  };

  const onSubmit = async (data) => {
    setShowProgress(true);
    if (data?.video == "video") {
      const dataUpdate = {
        id: lessonDetail?.lesson?.id,
        title: data?.title || lessonDetail?.lesson?.title,
        author: lessonDetail?.lesson?.author,
        videoDuration: lessonDetail?.lesson?.videoDuration,
        view: lessonDetail?.lesson?.view,
        description: data?.description || lessonDetail?.lesson?.description,
        status: true,
        chapterId: lessonDetail?.lesson?.chapterId,
        serialDto: {
          index: lessonDetail?.index,
          exam_ID: lessonDetail?.lesson?.examId,
        },
      };
      await updateLessonAction(dataUpdate);
      fetchDataAllLessonsOfChapter();
      handleUpdateLessonModalClose();
    } else {
      const file = data.file[0];

      const duration = await handleVideoFile(file);
      const fileGuid = uuidv4() + "." + file.name.split(".").pop();
      const totalChunks = Math.ceil(file.size / chunkSize);

      for (let i = 0; i < totalChunks; i++) {
        isChunkedSuccess = false;
        const chunkStart = i * chunkSize;
        const chunkEnd = Math.min(file.size, chunkStart + chunkSize);
        const chunk = file.slice(chunkStart, chunkEnd);
        await uploadChunk(chunk, i + 1, fileGuid, totalChunks);
        isChunkedSuccess = true;
      }

      if (isChunkedSuccess) {
        const dataUpdate = {
          id: lessonDetail?.lesson?.id,
          title: data?.title || lessonDetail?.lesson?.title,
          author: lessonDetail?.lesson?.author,
          videoDuration: String(duration),
          view: lessonDetail?.lesson?.view,
          description: data?.description || lessonDetail?.lesson?.description,
          fileVideoNameSource: fileGuid,
          status: true,
          chapterId: lessonDetail?.lesson?.chapterId,
          serialDto: {
            index: lessonDetail?.index,
            exam_ID: lessonDetail?.lesson?.examId,
          },
        };

        await updateLessonAction(dataUpdate);

        setTimeout(() => {
          fetchDataAllLessonsOfChapter();
          reset();
          handleUpdateLessonModalClose();
          setShowProgress(false);
        }, 1000);
      }
    }
  };

  const uploadChunk = async (chunk, counter, fileGuid, totalChunks) => {
    await chunkedFileAction(chunk, counter, fileGuid);
    const progress = (counter / totalChunks) * 100;
    setUploadProgress(progress);
  };

  return (
    <Box>
      <Modal
        open={openUpdateLessonModal}
        onClose={handleUpdateLessonModalClose}
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
          <Typography variant="h6">Thêm bài giảng</Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState: { error } }) => {
                return (
                  <TextField
                    {...field}
                    label="Nhập tiêu đề bài giảng..."
                    variant="outlined"
                    error={!!error}
                    helperText={error ? error.message : null}
                    sx={{
                      width: "100%",
                      marginTop: "25px",
                      marginBottom: "25px",
                    }}
                  />
                );
              }}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <CKEditor
                  editor={ClassicEditor}
                  data={field.value || ""}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setValue("description", data);
                  }}
                />
              )}
            />
            {errors.description && (
              <p
                style={{ color: "red" }}
                className="text-[0.75rem] text-[#d32f2f]">
                {errors.description.message}
              </p>
            )}
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              type="file"
              inputProps={{
                ...register("file", { required: true }),
              }}
              onChange={(e) => {
                setDefaultVideo(null);
                setValue("video", e.target.files[0]);
              }}
            />
            {defaultVideo && <video src={defaultVideo} controls alt="Error" />}
            {errors.video && (
              <p
                style={{ color: "red" }}
                className="text-[0.75rem] text-[#d32f2f]">
                {errors.video.message}
              </p>
            )}
            {showProgress && (
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{ height: 15 }}
              />
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              Upload
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default UpdateLesson;
