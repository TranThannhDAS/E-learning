/* eslint-disable indent */
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { getUser } from "@eproject4/helpers/authHelper";
import LinearProgress from "@mui/material/LinearProgress";
import {
  chunkedFile,
  createLesson,
  getAllLessionsByChapterId,
} from "@eproject4/services/lession.service";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  video: Yup.mixed().required("Video is required"),
});

const chunkSize = 3 * 1024 * 1024;

function CreateLession({ chapter, handleClose, fetchDataAllLessonsOfChapter }) {
  const { chunkedFileAction } = chunkedFile();
  const [uploadProgress, setUploadProgress] = useState(0);
  let isChunkedSuccess = false;
  const [lessionByChapterId, setLessionByChapterId] = useState("");
  const { getAllLessionsByChapterIdAction } = getAllLessionsByChapterId();
  const { createLessonAction } = createLesson();
  const [showProgress, setShowProgress] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const fetchDataLessonsByChapterId = async () => {
      const res = await getAllLessionsByChapterIdAction(chapter?.id);

      setLessionByChapterId(res?.data);
    };

    fetchDataLessonsByChapterId();
  }, []);

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
    const file = data.file[0];
    if (!file) return;
    try {
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
        const dataCreateLesson = {
          title: data?.title,
          author: getUser()?.username,
          videoDuration: String(duration),
          view: 0,
          status: false,
          chapterId: chapter?.id,
          fileVideoNameSource: fileGuid,
          description: data?.description,
          index: addIndexLesson(lessionByChapterId),
          exam_ID: null,
        };

        await createLessonAction(dataCreateLesson);
        setTimeout(() => {
          setShowProgress(false);
          handleClose();
          reset();
          fetchDataAllLessonsOfChapter();
        }, 1000);
      }
    } catch (error) {
      setShowProgress(false);
      throw new Error(error);
    }
  };

  const uploadChunk = async (chunk, counter, fileGuid, totalChunks) => {
    await chunkedFileAction(chunk, counter, fileGuid);
    const progress = (counter / totalChunks) * 100;
    setUploadProgress(progress);
  };

  const addIndexLesson = (lessons) => {
    if (lessons.length === 0) {
      return 1;
    }
    const lastIndex =
      lessons.lessons.length > 0
        ? lessons.lessons[lessons.lessons.length - 1].lesson[
            lessons.lessons[lessons.lessons.length - 1].lesson.length - 1
          ]?.index
        : 1;

    return lastIndex + 1;
  };

  return (
    <Box>
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
                sx={{ width: "100%", marginTop: "25px", marginBottom: "25px" }}
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
              data={field.value}
              onChange={(event, editor) => {
                const data = editor.getData();
                setValue("description", data);
              }}
            />
          )}
        />
        {errors.description && (
          <p style={{ color: "red" }} className="text-[0.75rem] text-[#d32f2f]">
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
            setValue("video", e.target.files[0]);
          }}
        />
        {errors.video && (
          <p style={{ color: "red" }} className="text-[0.75rem] text-[#d32f2f]">
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
  );
}

export default CreateLession;
