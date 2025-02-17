import { Box } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Modal, TextField, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { updateTopic } from "@eproject4/services/topic.service";

const schema = yup.object().shape({
  name: yup.string().required("Tên danh mục không được để trống"),
});

function UpdateTopic({
  open,
  handleClose,
  existingTopics,
  topic,
  onTopicUpdated,
  pageSize,
  pageIndex,
}) {
  const { handleSubmit, control, setError, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: topic?.nameTopic,
    },
  });
  const { updateTopicAction } = updateTopic();

  const onSubmit = async (data) => {
    const isExisting = existingTopics.some(
      (existingTopic) =>
        existingTopic.topicName === data.name && existingTopic.id !== topic.id
    );
    if (isExisting) {
      setError("name", {
        type: "manual",
        message: "Danh mục đã tồn tại",
      });
      return;
    }
    const newTopic = { ...topic, topicName: data.name };
    await updateTopicAction(newTopic);
    reset();
    handleClose();
    onTopicUpdated(pageIndex, pageSize);
  };

  return (
    <Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description">
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}>
          <Typography id="modal-title" variant="h6" component="h2">
            Cập nhật danh mục
          </Typography>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                margin="normal"
                label="Tên danh mục"
                fullWidth
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={handleClose} variant="outlined">
              Hủy
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Cập nhật
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default UpdateTopic;
