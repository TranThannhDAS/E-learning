import { getSubTopics } from "@eproject4/services/subTopic.service";
import { getAllTopics } from "@eproject4/services/topic.service";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Button,
  Grid,
  FormHelperText,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
  courseName: yup.string().required("Tên khóa học không được để trống"),
  category: yup.string().required("Danh mục không được để trống"),
  language: yup.string().required("Ngôn ngữ không được để trống"),
  status: yup.string().required("Trạng thái không được để trống"),
  paymentType: yup.string().required("Lựa chọn giá không được để trống"),
  price: yup.number().when("paymentType", {
    is: "paid",
    then: (schema) =>
      schema.typeError("Giá phải là số").required("Giá không được để trống"),
    otherwise: (schema) => schema.nullable(),
  }),
});

function BasicInfoTab({ onNext, setBasicInfo, basicInfo }) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      courseName: basicInfo.courseName || "",
      category: basicInfo.categoryId || "",
      subcategory: basicInfo.subCategoryId || "",
      language: basicInfo.language || "Tiếng Việt",
      status: basicInfo.status || "",
      paymentType: basicInfo.paymentType || "free",
      price: basicInfo.price || null,
    },
  });
  const { getAllTopicsAction } = getAllTopics();
  const { getSubTopicsAction } = getSubTopics();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const paymentType = watch("paymentType");
  const categorySelected = watch("category");

  useEffect(() => {
    const fetchTopicData = async () => {
      const res = await getAllTopicsAction();
      setCategories(res?.data?.items);
    };

    const fetchSubTopicData = async () => {
      const res = await getSubTopicsAction();
      setSubcategories(res?.data);
    };

    fetchTopicData();
    fetchSubTopicData();
  }, []);

  const onSubmit = (data) => {
    const basicInfo = {
      courseName: data.courseName,
      categoryId: data.category,
      subCategoryId: data.subcategory,
      language: data.language,
      status: data.status,
      price: data.price,
      paymentType: data.paymentType,
    };
    if (!data.price) {
      basicInfo.price = 0;
    }
    if (!data.subcategory) {
      basicInfo.subCategoryId = null;
    }
    setBasicInfo(basicInfo);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            name="courseName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                id="outlined-basic"
                defaultValue=""
                label="Nhập tiêu đề"
                variant="outlined"
                error={!!error}
                helperText={error ? error.message : null}
                sx={{ marginTop: "10px", width: "100%" }}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="category"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl fullWidth error={!!error}>
                <InputLabel>Danh mục</InputLabel>
                <Select {...field} label="Danh mục" defaultValue="">
                  {categories.map((option, index) => (
                    <MenuItem key={index} value={option?.id}>
                      {option.topicName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{error?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="subcategory"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl
                fullWidth
                error={!!error}
                disabled={!categorySelected}>
                <InputLabel>Danh mục con</InputLabel>
                <Select {...field} label="Danh mục con" defaultValue="">
                  {categorySelected &&
                    subcategories.map((option, index) => {
                      if (option?.topicId === Number(categorySelected)) {
                        return (
                          <MenuItem key={index} value={option.id}>
                            {option.subTopicName}
                          </MenuItem>
                        );
                      }
                    })}
                </Select>
                <FormHelperText>{error?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="language"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                defaultValue=""
                select
                label="Ngôn ngữ"
                fullWidth
                error={!!errors.language}
                helperText={errors.language?.message}>
                <MenuItem value="Tiếng Việt">Tiếng Việt</MenuItem>
              </TextField>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                defaultValue=""
                label="Trạng thái"
                fullWidth
                error={!!errors.status}
                helperText={errors.status?.message}>
                <MenuItem value="false">Private</MenuItem>
                <MenuItem value="true">Public</MenuItem>
              </TextField>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="paymentType"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Miễn phí hoặc trả phí"
                defaultValue=""
                fullWidth
                error={!!errors.paymentType}
                helperText={errors.paymentType?.message}>
                <MenuItem value="free">Miễn phí</MenuItem>
                <MenuItem value="paid">Trả phí</MenuItem>
              </TextField>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                defaultValue=""
                label="Giá"
                fullWidth
                disabled={paymentType !== "paid"}
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            )}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "end",
            marginTop: "15px",
          }}>
          <Button
            sx={{ boxShadow: "none", borderRadius: 0, color: "#FFF" }}
            type="submit"
            variant="contained">
            Lưu và tiếp tục
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default BasicInfoTab;
