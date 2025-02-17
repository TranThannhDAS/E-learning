import { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import {
  Button,
  Grid,
  IconButton,
  Typography,
  Paper,
  Box,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { createCourse } from "@eproject4/services/courses.service";
import { getUser } from "@eproject4/helpers/authHelper";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object().shape({
  thumbnail: Yup.mixed()
    .required("Bạn phải tải lên hình ảnh")
    .test("fileType", "Chỉ được tải lên hình ảnh (jpg, jpeg, png)", (value) => {
      return (
        value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
      );
    }),
  videoIntro: Yup.mixed()
    .required("Bạn phải tải lên video giới thiệu")
    .test("fileType", "Chỉ được tải lên video (mp4)", (value) => {
      return value && ["video/mp4"].includes(value.type);
    }),
  courseDescription: Yup.string().required(
    "Mô tả khóa học không được để trống"
  ),
});

function removeVietnameseAccents(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu diacritic
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function createSlug(title) {
  return removeVietnameseAccents(title)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

function AdvancedInfoTab({ onBack, basicInfo }) {
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const { createCoursesAction } = createCourse();
  const benefitsArray = [];
  const requirementsArray = [];
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      thumbnail: null,
      videoIntro: null,
      courseDescription: "",
      courseBenefits: [{ text: "" }],
      courseRequirements: [{ text: "" }],
    },
  });

  const {
    fields: benefitFields,
    append: appendBenefit,
    remove: removeBenefit,
  } = useFieldArray({
    control,
    name: "courseBenefits",
  });

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({
    control,
    name: "courseRequirements",
  });

  const onSubmit = async (data) => {
    data.courseBenefits.forEach((item) => {
      benefitsArray.push(item.text);
    });

    data.courseRequirements.forEach((item) => {
      requirementsArray.push(item.text);
    });

    const formData = {
      title: basicInfo.courseName,
      description: data.courseDescription,
      thumbnail: data.thumbnail,
      slug: createSlug(basicInfo.courseName),
      status: basicInfo.status,
      benefit: benefitsArray || [],
      requirement: requirementsArray || [],
      videoIntro: data.videoIntro,
      price: basicInfo.price,
      userId: getUser()?.id,
      topicId: basicInfo.categoryId,
      subTopicId: basicInfo.subCategoryId || null,
    };

    try {
      await createCoursesAction(formData);
    } catch (err) {
      throw new Error(err);
    }
    navigate("/admin/khoa-hoc", { replace: true });
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setThumbnailPreview(URL.createObjectURL(file));
      setValue("thumbnail", file);
    } else {
      setThumbnailPreview("");
      setValue("thumbnail", null);
    }
  };

  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoPreview(URL.createObjectURL(file));
      setValue("videoIntro", file);
    } else {
      setVideoPreview("");
      setValue("videoIntro", null);
    }
  };

  const removeVideo = () => {
    setVideoPreview("");
    setValue("videoIntro", null);
  };

  const removeThumbnail = () => {
    setThumbnailPreview("");
    setValue("thumbnail", null);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Box
              sx={{
                border: "1px dashed grey",
                padding: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 140,
              }}>
              <Button variant="outlined" component="label">
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/jpeg, image/png, image/jpg"
                  {...register("thumbnail", {
                    onChange: handleThumbnailChange,
                  })}
                />
              </Button>
            </Box>
            {thumbnailPreview && (
              <>
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  style={{ width: "100%", marginTop: "10px" }}
                />
                <Button
                  variant="outlined"
                  sx={{ marginTop: "10px" }}
                  onClick={removeThumbnail}>
                  Xóa
                </Button>
              </>
            )}
            {errors.thumbnail && (
              <p style={{ color: "red" }}>{errors.thumbnail.message}</p>
            )}
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                border: "1px dashed grey",
                padding: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 140,
              }}>
              <Button variant="outlined" component="label">
                Upload Video
                <input
                  type="file"
                  hidden
                  accept="video/mp4"
                  {...register("videoIntro", { onChange: handleVideoChange })}
                />
              </Button>
            </Box>
            {videoPreview && (
              <>
                <video
                  src={videoPreview}
                  controls
                  style={{ width: "100%", marginTop: "10px" }}
                />
                <Button
                  variant="outlined"
                  sx={{ marginTop: "10px" }}
                  onClick={removeVideo}>
                  Xóa
                </Button>
              </>
            )}
            {errors.videoIntro && (
              <p style={{ color: "red" }}>{errors.videoIntro.message}</p>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography
              sx={{ fontSize: "18px", fontWeight: 500, marginBottom: "20px" }}>
              Mô tả khóa học
            </Typography>
            <Controller
              name="courseDescription"
              control={control}
              render={({ field }) => (
                <CKEditor
                  editor={ClassicEditor}
                  data={field.value}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setValue("courseDescription", data);
                  }}
                />
              )}
            />
            {errors.courseDescription && (
              <p style={{ color: "red" }}>{errors.courseDescription.message}</p>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography
              sx={{ fontSize: "18px", fontWeight: 500, marginBottom: "20px" }}>
              Lợi ích của khóa học
            </Typography>
            {benefitFields.map((item, index) => (
              <Box key={item.id} display="flex" alignItems="center">
                <TextField
                  sx={{ marginBottom: "10px" }}
                  {...register(`courseBenefits.${index}.text`)}
                  fullWidth
                  variant="outlined"
                />
                <IconButton onClick={() => removeBenefit(index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() => appendBenefit({ text: "" })}>
              Thêm
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography
              sx={{ fontSize: "18px", fontWeight: 500, marginBottom: "20px" }}>
              Yêu cầu của khóa học
            </Typography>
            {requirementFields.map((item, index) => (
              <Box key={item.id} display="flex" alignItems="center">
                <TextField
                  sx={{ marginBottom: "10px" }}
                  {...register(`courseRequirements.${index}.text`)}
                  fullWidth
                  variant="outlined"
                />
                <IconButton onClick={() => removeRequirement(index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={() => appendRequirement({ text: "" })}>
              Thêm
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              sx={{ boxShadow: "none", borderRadius: 0, marginRight: "10px" }}
              variant="outlined"
              onClick={() => {
                onBack();
              }}>
              Trở lại
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                boxShadow: "none",
                borderRadius: 0,
                marginRight: "10px",
                color: "white",
              }}>
              Lưu và Tiếp Tục
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

export default AdvancedInfoTab;
