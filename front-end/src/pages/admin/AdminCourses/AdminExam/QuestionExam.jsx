import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";

function QuestionExam({ question, index, remove }) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <Box mb={3} p={2} border={1} borderRadius={2} borderColor="grey.300">
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
        render={({ field }) => {
          return (
            <TextField
              {...field}
              label="Nội dung câu hỏi"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors?.questions?.[index]?.text}
              helperText={errors?.questions?.[index]?.text?.message}
            />
          );
        }}
      />
      <FormControl component="fieldset" margin="normal" sx={{ width: "95%" }}>
        <FormLabel component="legend">Các lựa chọn</FormLabel>
        <RadioGroup>
          {question.options.map((option, optIndex) => {
            return (
              <Box
                key={optIndex}
                display="flex"
                alignItems="center"
                width="100%"
                justifyContent="space-between">
                <Controller
                  name={`questions.${index}.options.${optIndex}`}
                  control={control}
                  rules={{ required: "Lựa chọn không được bỏ trống" }}
                  render={({ field }) => {
                    return (
                      <TextField
                        {...field}
                        label={`Lựa chọn ${optIndex + 1}`}
                        sx={{
                          marginRight: "15px",
                        }}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        error={
                          !!errors?.questions?.[index]?.options?.[optIndex]
                        }
                        helperText={
                          errors?.questions?.[index]?.options?.[optIndex]
                            ?.message
                        }
                      />
                    );
                  }}
                />
                <Controller
                  name={`questions.${index}.correctOption`}
                  control={control}
                  defaultValue=""
                  render={({ field }) => {
                    return (
                      <FormControlLabel
                        control={<Radio {...field} value={optIndex} />}
                        label="Đúng"
                      />
                    );
                  }}
                />
              </Box>
            );
          })}
        </RadioGroup>
      </FormControl>
    </Box>
  );
}

export default QuestionExam;
