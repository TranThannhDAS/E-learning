import { createChapter } from "@eproject4/services/chapter.service";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Divider,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import * as yup from "yup";

const schema = yup.object().shape({
  chapter: yup.string().required("Tên chương không được để trống"),
  description: yup.string().required("Mô tả không được để trống"),
});

function CreateChapter({
  openChapterModal,
  handleChapterModalClose,
  getChapterOfCourse,
  chapterOfCourse,
}) {
  const [searchParams] = useSearchParams();
  const idCourse = searchParams.get("id-course");
  const { createChapterAction } = createChapter();
  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(schema),
  });

  // create index when create chapter
  const addIndexChapter = (chapters) => {
    if (chapters.length === 0) {
      return 1;
    }
    const lastIndex = chapters[chapters.length - 1].index;
    return lastIndex + 1;
  };

  useEffect(() => {
    getChapterOfCourse(idCourse);
  }, []);

  const onSubmit = async (data) => {
    const newIndex = addIndexChapter(chapterOfCourse);
    const newChapter = {
      title: data?.chapter,
      description: data?.description,
      sourceId: idCourse,
      index: newIndex,
    };

    await createChapterAction(newChapter);
    reset();
    getChapterOfCourse(idCourse);
    handleChapterModalClose();
  };

  return (
    <Box>
      <Modal
        open={openChapterModal}
        onClose={handleChapterModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
          }}>
          <Box sx={{ p: 2 }}>
            <Typography sx={{ fontSize: "16px", fontWeight: 500 }}>
              Thêm chương
            </Typography>
          </Box>
          <Divider sx={{ width: "100%" }} />
          <Box sx={{ p: 2 }} component="form" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="chapter"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Nhập tên chương..."
                  variant="outlined"
                  error={!!error}
                  helperText={error ? error.message : null}
                  sx={{ width: "100%", marginTop: "15px" }}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Nhập mô tả..."
                  variant="outlined"
                  error={!!error}
                  helperText={error ? error.message : null}
                  sx={{ width: "100%", marginTop: "15px" }}
                />
              )}
            />

            <Box
              sx={{
                display: "flex",
                marginTop: "25px",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
              <Button
                onClick={handleChapterModalClose}
                variant="contained"
                sx={{
                  backgroundColor: "#F5F7FA",
                  color: "#1D2026",
                  width: "100px",
                  height: "48px",
                  borderRadius: 0,
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "#e8e9eb",
                    boxShadow: "none",
                  },
                }}>
                Trở lại
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  borderRadius: 0,
                  boxShadow: "none",
                  color: "white",
                  width: "78px",
                  height: "48px",
                }}>
                Thêm
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default CreateChapter;
