import { updateChapter } from "@eproject4/services/chapter.service";
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
import * as yup from "yup";

const schema = yup.object().shape({
  chapter: yup.string().required("Tên chương không được để trống"),
  description: yup.string().required("Mô tả không được để trống"),
});

function UpdateChapter({
  openUpdateChapterModal,
  handleUpdateChapterModalClose,
  getChapterOfCourse,
  chapter,
}) {
  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(schema),
    chapter: "",
    description: "",
  });
  const { updateChapterAction } = updateChapter();

  useEffect(() => {
    if (chapter) {
      reset({
        chapter: chapter?.title,
        description: chapter?.description,
      });
    }
  }, [chapter, reset]);

  const onSubmit = async (data) => {
    if (
      chapter?.title === data.chapter &&
      chapter?.description === data.description
    ) {
      handleUpdateChapterModalClose();
      return;
    }

    const newChapter = {
      title: data.chapter,
      description: data.description,
      sourceId: chapter?.sourceId,
      index: chapter?.index,
    };

    await updateChapterAction(newChapter, chapter?.id);
    getChapterOfCourse(chapter?.sourceId);
    handleUpdateChapterModalClose();
    reset();
  };

  return (
    <Box>
      <Modal
        open={openUpdateChapterModal}
        onClose={handleUpdateChapterModalClose}
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
              Cập nhật chương
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
                onClick={handleUpdateChapterModalClose}
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
                Sửa
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default UpdateChapter;
