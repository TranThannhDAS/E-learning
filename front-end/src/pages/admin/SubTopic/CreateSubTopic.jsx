import { Box } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { createSubTopic } from "@eproject4/services/subTopic.service";
import { subTopicsSelector } from "@eproject4/redux/selectors";
import { Button, MenuItem, Modal, TextField, Typography } from "@mui/material";

const schema = yup.object().shape({
  name: yup.string().required("Tên danh mục con không được để trống"),
  topicId: yup.string().required("Danh mục không được để trống"),
});

function CreateSubTopic({
  open,
  handleClose,
  existingTopics,
  onSubTopicAdded,
}) {
  const { handleSubmit, control, setError, reset } = useForm({
    resolver: yupResolver(schema),
  });
  const { createSubTopicAction } = createSubTopic();
  const dataSubTopics = useSelector(subTopicsSelector);

  const onSubmit = async (data) => {
    const isExisting = dataSubTopics.subTopics.some((item) => {
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
    const newSubTopic = { subTopicName: data.name, topicId: data.topicId };
    try {
      await createSubTopicAction(newSubTopic);
      reset();
      handleClose();
      onSubTopicAdded();
    } catch (error) {
      setError("name", {
        type: "manual",
        message: error.response?.data?.message || "Lỗi khi tạo danh mục con",
      });
    }
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
          subTopicsSelector
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
            Thêm danh mục con mới
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
                    <MenuItem key={index} value={topic?.id}>
                      {topic?.topicName}
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
            <Button type="submit" variant="contained" sx={{ color: "#FFF" }}>
              Thêm
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default CreateSubTopic;
