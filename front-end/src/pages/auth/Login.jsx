import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Typography, Box } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loginForm } from "@eproject4/services/auth";
import LoadingBackdrop from "@eproject4/components/LoadingBackdrop";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { useState } from "react";

const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const { loginFormAction, loading, error, success, data } = loginForm();
  const [showPassword, setShowPassword] = useState(false);


  const onSubmit = async (dataForm) => {
    await loginFormAction(dataForm);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <Box>
      <LoadingBackdrop open={loading}/>
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
          Đăng nhập
        </Typography>
        <Controller
          name="username"
          control={control}
          defaultValue=""
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
          defaultValue=""
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
                      {showPassword ? <VisibilityOff/> : <Visibility/>}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{ color: "white", marginTop: "15px" }}>
          Đăng nhập
        </Button>
      </Box>
    </Box>
  );
}

export default Login;
