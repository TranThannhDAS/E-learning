import { updateSubTopic } from "@eproject4/services/subTopic.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import {
  Box,
  Button,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";

const schema = yup.object().shape({
  name: yup.string().required("Tên danh mục con không được để trống"),
  topicId: yup.string().required("Danh mục không được để trống"),
});

function UpdateSubTopic({
  open,
  handleClose,
  existingSubTopics,
  existingTopics,
  subTopic,
  onSubTopicUpdated,
}) {
  const { handleSubmit, control, setError, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: subTopic?.nameSubTopic,
      topicId: subTopic?.topicId,
    },
  });
  const { updateSubTopicAction } = updateSubTopic();

  const onSubmit = async (data) => {
    const isExisting = existingSubTopics.subTopics.some((item) => {
      return (
        item?.subTopicName === data.name &&
        item?.topicId === Number(data?.topicId)
      );
    });
    if (isExisting) {
      setError("name", {
        type: "manual",
        message: "Danh mục con đã tồn tại trong danh mục này",
      });
      return;
    }

    const newSubTopic = {
      ...subTopic,
      subTopicName: data.name,
      topicId: data.topicId,
    };
    await updateSubTopicAction(newSubTopic);
    reset();
    handleClose();
    onSubTopicUpdated();
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
            Cập nhật danh mục con
          </Typography>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                margin="normal"
                label="Tên danh mục con"
                fullWidth
                error={!!error}
                helperText={error ? error.message : null}
              />
            )}
          />
          <Controller
            name="topicId"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                select
                margin="normal"
                label="Danh mục"
                fullWidth
                error={!!error}
                helperText={error ? error.message : null}>
                {existingTopics.map((topic, index) => {
                  return (
                    <MenuItem key={index} value={topic.id}>
                      {topic.topicName}
                    </MenuItem>
                  );
                })}
              </TextField>
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

export default UpdateSubTopic;
