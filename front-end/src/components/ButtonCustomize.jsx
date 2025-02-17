import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const ButtonCustomize = ({
  onClick,
  text = "",
  width = "130px",
  height = "40px",
  fontSize = "12px",
  backgroundColor = "main.primary",
  color = "white",
  variant = "contained",
  sx = {},
  navigateTo, // Thêm prop này để xác định URL điều hướng
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (navigateTo) {
      navigate(navigateTo); // Sử dụng navigate khi cần điều hướng
    } else if (onClick) {
      onClick(); // Sử dụng onClick khi không cần điều hướng
    }
  };

  return (
    <Box>
      <Button
        variant={variant}
        sx={{
          color: color,
          borderRadius: 0,
          boxShadow: "none",
          width: width,
          height: height,
          fontSize: fontSize,
          backgroundColor: backgroundColor,

          ...sx,
        }}
        onClick={handleClick}>
        {text}
      </Button>
    </Box>
  );
};

export default ButtonCustomize;
