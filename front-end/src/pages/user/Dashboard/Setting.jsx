import styled from "@emotion/styled";
import LoadingBackdrop from "@eproject4/components/LoadingBackdrop";
import { registerForm } from "@eproject4/services/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { PhotoCamera, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import * as yup from "yup";
const Input = styled("input")({
  display: "none",
});
export default function Setting() {
  const [file, setFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { registerFormAction, loading, error, success } = registerForm();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(URL.createObjectURL(file));
    }
  };

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
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  return (
    <Box>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Cài Đặt tài khoản
      </Typography>
      <Box>
        <Box
          component="form"
          // onSubmit={handleSubmit(onSubmit)}
          sx={{ p: 4, margin: "auto", maxWidth: "100%", flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <Card
                sx={{
                  display: "flex",
                  padding: "44px",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "22px",
                  width: "368px",
                  height: "412px",
                }}>
                <Avatar
                  src={file}
                  sx={{ width: "280px", height: "280px" }}
                  alt="Profile Picture"
                />
                <label htmlFor="icon-button-file">
                  <Input
                    accept="image/*"
                    id="icon-button-file"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span">
                    <PhotoCamera />
                  </IconButton>
                </label>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6E7485",
                    textAlign: "center",

                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "22px",
                    letterSpacing: "-0.14px",
                  }}>
                  Ảnh phải nhỏ hơn 1MB và tỷ lệ ảnh phải 1:1
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={7}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      marginBottom: "6px",
                      fontSize: "14px",
                      fontWeight: 400,
                    }}>
                    Họ và tên
                  </Typography>
                  <Box sx={{ display: "flex" }}>
                    {" "}
                    <TextField
                      sx={{ marginRight: " 10px" }}
                      fullWidth
                      label="Họ"
                      variant="outlined"
                    />
                    <TextField fullWidth label="Tên" variant="outlined" />
                  </Box>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "14px",
                    fontWeight: 400,
                  }}>
                  Tên tài khoản
                </Typography>
                <TextField fullWidth label="Tên tài khoản" variant="outlined" />
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "14px",
                    fontWeight: 400,
                  }}>
                  Email
                </Typography>
                <TextField fullWidth label="Email" variant="outlined" />
              </Box>
              <Button variant="contained" sx={{ mt: 2, color: "#fff" }}>
                Lưu
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <hr style={{ width: "100vw", margin: "0 calc(-50vw + 50%)" }} />

      {/* Doi mat khau */}

      <Box>
        <LoadingBackdrop open={loading} />
        <Box
          component="form"
          // onSubmit={handleSubmit(onSubmit)}
          sx={{
            width: "588px", // Chiều rộng cố định như hình ảnh
          }}>
          <Typography
            variant="h6"
            sx={{ marginBottom: "24px", marginTop: "40px" }} // Căn giữa tiêu đề
          >
            Đổi mật khẩu
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: "14px",
                fontWeight: 400,
              }}>
              Mật khẩu hiện tại
            </Typography>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mật khẩu "
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  fullWidth
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

            <Typography
              variant="h6"
              sx={{
                fontSize: "14px",
                fontWeight: 400,
              }}>
              Mật khẩu mới
            </Typography>
            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mật khẩu"
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  fullWidth
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
            <Typography
              variant="h6"
              sx={{
                fontSize: "14px",
                fontWeight: 400,
              }}>
              Xác nhận mật khẩu
            </Typography>
            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Xác nhận mật khẩu mới"
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  fullWidth
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
          </Box>
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2, color: "#fff" }} // Màu nút như trong hình
          >
            Đổi Mật Khẩu
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
