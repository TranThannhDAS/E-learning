import { Box } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Modal, TextField, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { createTopic } from "@eproject4/services/topic.service";

const schema = yup.object().shape({
  name: yup.string().required("Tên danh mục không được để trống"),
});

function CreateTopic({
  open,
  handleClose,
  existingTopics,
  onTopicAdded,
  pageSize,
  pageIndex,
}) {
  const { handleSubmit, control, setError, reset } = useForm({
    resolver: yupResolver(schema),
  });
  const { createTopicAction } = createTopic();

  const onSubmit = async (data) => {
    const isExisting = existingTopics.some(
      (topic) => topic.topicName === data.name
    );
    if (isExisting) {
      setError("name", {
        type: "manual",
        message: "Danh mục đã tồn tại",
      });
      return;
    }
    const newTopic = { topicName: data.name };
    await createTopicAction(newTopic);
    reset();
    handleClose();
    onTopicAdded(pageIndex, pageSize);
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
            boxShadow: 24,
            p: 4,
          }}>
          <Typography id="modal-title" variant="h6" component="h2">
            Thêm danh mục mới
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
            <Button type="submit" variant="contained" sx={{ color: "#FFF" }}>
              Thêm
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default CreateTopic;
