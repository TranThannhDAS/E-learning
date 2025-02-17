import {
  getCourseById,
  updateCourse,
} from "@eproject4/services/courses.service";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as yup from "yup";
import { getAllTopics } from "@eproject4/services/topic.service.js";
import { getSubTopics } from "@eproject4/services/subTopic.service.js";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { getUser } from "@eproject4/helpers/authHelper";

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
  courseDescription: yup
    .string()
    .required("Mô tả khóa học không được để trống"),
});

function UpdateCourse({
  openUpdateCourseModal,
  handleUpdateCourseModalClose,
  idQuery,
  fetchChapterOfCourse,
  fetchExamOfCourse,
  fetchCoursesData,
  fetchUserByIdData,
}) {
  const [courseDetail, setCourseDetail] = useState({});
  const { getCourseByIdAction } = getCourseById();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const { getAllTopicsAction } = getAllTopics();
  const { getSubTopicsAction } = getSubTopics();
  const benefitsArrayDefault = [];
  const benefitsArray = [];
  const requirementsArrayDefault = [];
  const requirementsArray = [];
  const { updateCourseAction } = updateCourse();
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    register,
    setValue,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      courseName: "",
      category: "",
      subcategory: "",
      language: "Tiếng Việt",
      status: "",
      paymentType: "free",
      price: null,
      thumbnail: null,
      videoIntro: null,
      courseDescription: "",
      courseBenefits: [{ text: "" }],
      courseRequirements: [{ text: "" }],
    },
  });

  const paymentType = watch("paymentType");
  const categorySelected = watch("category");

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

  // Get categories and subcatergories
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

  // Get course detail
  useEffect(() => {
    const fetchCourseDetail = async () => {
      const res = await getCourseByIdAction(idQuery);
      setCourseDetail(res.data);

      res?.data?.benefit?.forEach((benefit) => {
        benefitsArrayDefault.push({ text: benefit });
      });

      res?.data?.requirement?.forEach((requirement) => {
        requirementsArrayDefault.push({ text: requirement });
      });

      setThumbnailPreview(res?.data?.thumbnail);
      setVideoPreview(res?.data?.videoIntro);

      reset({
        courseName: res.data?.title || "",
        category: res.data?.topicId || "",
        subcategory: res.data?.subTopicId || "",
        language: res.data?.language || "Tiếng Việt",
        status: res.data?.status == 1 ? true : false,
        paymentType: res.data?.price > 0 ? "paid" : "free",
        price: res.data?.price || null,
        thumbnail: "thumbnail",
        thumbnailUrl: res?.data?.thumbnail || "",
        videoIntro: "video-intro",
        videoIntroUrl: res?.data?.videoIntro || "",
        courseDescription: res?.data?.description || "",
        courseBenefits: benefitsArrayDefault || [],
        courseRequirements: requirementsArrayDefault || [],
      });
    };

    fetchCourseDetail();
  }, []);

  const onSubmit = async (data) => {
    if (!thumbnailPreview) {
      setError("thumbnail", {
        type: "manual",
        message: "Thumbnail không được bỏ trống",
      });
      return;
    }

    if (!videoPreview) {
      setError("videoIntro", {
        type: "manual",
        message: "Video giới thiệu không được bỏ trống",
      });
      return;
    }

    data.courseBenefits.forEach((item) => {
      benefitsArray.push(item.text);
    });

    data.courseRequirements.forEach((item) => {
      requirementsArray.push(item.text);
    });

    if (data?.videoIntro == "video-intro" && data?.thumbnail == "thumbnail") {
      const formData = {
        title: data?.courseName,
        description: data?.courseDescription,
        slug: courseDetail?.slug,
        status: Boolean(data?.status),
        benefit: benefitsArray,
        requirement: requirementsArray,
        price: data?.price,
        userId: getUser()?.id,
        topicId: Number(data?.category),
        subTopicId: data?.subcategory,
        rating: courseDetail?.rating,
      };

      if (!data.price) {
        formData.price = 0;
      }
      if (!data.subcategory) {
        formData.subTopicId = null;
      }
      await updateCourseAction(idQuery, formData);
      fetchChapterOfCourse();
      fetchExamOfCourse();
      fetchCoursesData();
      fetchUserByIdData();
      handleUpdateCourseModalClose();
    }

    if (data?.videoIntro != "video-intro" && data?.thumbnail == "thumbnail") {
      const formData = {
        title: data?.courseName,
        description: data?.courseDescription,
        slug: courseDetail?.slug,
        status: Boolean(data?.status),
        benefit: benefitsArray,
        requirement: requirementsArray,
        price: data?.price,
        userId: getUser()?.id,
        topicId: Number(data?.category),
        subTopicId: data?.subcategory,
        rating: courseDetail?.rating,
        videoIntro: data?.videoIntro,
      };

      if (!data.price) {
        formData.price = 0;
      }
      if (!data.subcategory) {
        formData.subTopicId = null;
      }
      await updateCourseAction(idQuery, formData);
      fetchChapterOfCourse();
      fetchExamOfCourse();
      fetchCoursesData();
      fetchUserByIdData();
      handleUpdateCourseModalClose();
    }

    if (data?.videoIntro == "video-intro" && data?.thumbnail != "thumbnail") {
      const formData = {
        title: data?.courseName,
        description: data?.courseDescription,
        slug: courseDetail?.slug,
        status: Boolean(data?.status),
        benefit: benefitsArray,
        requirement: requirementsArray,
        price: data?.price,
        userId: getUser()?.id,
        topicId: Number(data?.category),
        subTopicId: data?.subcategory,
        rating: courseDetail?.rating,
        thumbnail: data?.thumbnail,
      };

      if (!data.price) {
        formData.price = 0;
      }
      if (!data.subcategory) {
        formData.subTopicId = null;
      }
      await updateCourseAction(idQuery, formData);
      fetchChapterOfCourse();
      fetchExamOfCourse();
      fetchCoursesData();
      fetchUserByIdData();
      handleUpdateCourseModalClose();
    }

    if (data?.videoIntro != "video-intro" && data?.thumbnail != "thumbnail") {
      const formData = {
        title: data?.courseName,
        description: data?.courseDescription,
        slug: courseDetail?.slug,
        status: Boolean(data?.status),
        benefit: benefitsArray,
        requirement: requirementsArray,
        price: data?.price,
        userId: getUser()?.id,
        topicId: Number(data?.category),
        subTopicId: data?.subcategory,
        rating: courseDetail?.rating,
        thumbnail: data?.thumbnail,
        videoIntro: data?.videoIntro,
      };

      if (!data.price) {
        formData.price = 0;
      }
      if (!data.subcategory) {
        formData.subTopicId = null;
      }
      await updateCourseAction(idQuery, formData);
      fetchChapterOfCourse();
      fetchExamOfCourse();
      fetchCoursesData();
      fetchUserByIdData();
      handleUpdateCourseModalClose();
    }
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
    <Box>
      <Modal
        open={openUpdateCourseModal}
        onClose={handleUpdateCourseModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            bgcolor: "background.paper",
            boxShadow: 24,
            overflowY: "auto",
            height: "700px",
          }}>
          <Box sx={{ width: "100%", paddingX: "27px", paddingY: "20px" }}>
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
                              if (
                                option?.topicId === Number(categorySelected)
                              ) {
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
              </Grid>

              <Grid container spacing={3} sx={{ marginTop: "15px" }}>
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
                        {...register("videoIntro", {
                          onChange: handleVideoChange,
                        })}
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
                    sx={{
                      fontSize: "18px",
                      fontWeight: 500,
                      marginBottom: "20px",
                    }}>
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
                    <p style={{ color: "red" }}>
                      {errors.courseDescription.message}
                    </p>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: 500,
                      marginBottom: "20px",
                    }}>
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
                    sx={{
                      fontSize: "18px",
                      fontWeight: 500,
                      marginBottom: "20px",
                    }}>
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
                    sx={{
                      boxShadow: "none",
                      borderRadius: 0,
                      color: "#FFF",
                    }}
                    type="submit"
                    variant="contained">
                    Lưu và tiếp tục
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default UpdateCourse;
