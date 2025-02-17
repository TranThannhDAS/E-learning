import Box from "@mui/material/Box";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { registerForm } from "@eproject4/services/auth";
import LoadingBackdrop from "@eproject4/components/LoadingBackdrop";
import { useNavigate } from "react-router-dom";

function Register() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { registerFormAction, loading, error, success } = registerForm();
  const navigate = useNavigate();

  const schema = yup.object().shape({
    username: yup
      .string()
      .min(6, "Tên tài khoản phải có ít nhất 6 ký tự")
      .required("Bạn phải nhập đầy đủ tên tài khoản"),
    password: yup
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .required("Bạn phải nhập đầy đủ mật khẩu"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Mật khẩu không khớp")
      .required("Bạn phải nhập đầy đủ mật khẩu xác nhận"),
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Bạn phải nhập đầy đủ email"),
    phoneNumber: yup
      .string()
      .matches(/^\d{9,11}$/, "Số điện thoại phải có từ 9 đến 11 chữ số")
      .required("Bạn phải nhập đầy đủ số điện thoại"),
    avatar: yup.mixed().notRequired(),
    // .test("fileType", "Only image files are allowed", (value) => {
    //   return value && value[0] && value[0].type.startsWith("image/");
    // }),
  });

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    setError,
    clearErrors,
    resetField,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await registerFormAction(data);
      navigate("/dang-nhap");
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    if (success) {
      navigate("/dang-nhap");
    }
  }, [success, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("avatar", {
          type: "manual",
          message: "Only image files are allowed",
        });
        setSelectedImage(null);
      } else {
        clearErrors("avatar");
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setSelectedImage(null);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    resetField("avatar");
    clearErrors("avatar");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <Box>
      <LoadingBackdrop open={loading} />
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "55%",
          margin: "0 auto",
          padding: "50px",
        }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Đăng ký
        </Typography>
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Tên tài khoản"
              variant="outlined"
              error={!!errors.username}
              helperText={errors.username?.message}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Mật khẩu"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Xác nhận mật khẩu"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              type="email"
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}
        />
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Số điện thoại"
              variant="outlined"
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
            />
          )}
        />
        <input
          className="mt-[10px]"
          accept="image/*"
          type="file"
          {...register("avatar")}
          id="avatar-upload"
          onChange={handleImageChange}
        />
        {errors.avatar && (
          <Typography color="error" variant="body2">
            {errors.avatar.message}
          </Typography>
        )}
        {selectedImage && (
          <Box>
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <img
                src={selectedImage}
                alt="Avatar"
                style={{ width: "100%", maxWidth: "150px", maxHeight: "150px" }}
              />
            </Box>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleRemoveImage}
              sx={{ mt: 2 }}>
              Xóa
            </Button>
          </Box>
        )}
        <Button
          type="submit"
          variant="contained"
          sx={{ color: "white", marginTop: "15px" }}>
          Đăng ký
        </Button>
      </Box>
    </Box>
  );
}

export default Register;
