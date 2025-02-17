import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";

const HorizontalCourseCard = ({
  path = "#",
  title,
  image = "https://bom.so/vV4j7x",
  progress,
  subtitle,
}) => {
  const hasStarted = progress > 0;

  return (
    <Link to={path} style={{ textDecoration: "none" }}>
      {" "}
      {/* Remove underline and other link styles */}
      <Box sx={{ display: "inline-block", width: 1 }}>
        {" "}
        {/* Use inline-flex and width 1 for full parent width usage */}
        <Card
          sx={{
            width: "312px", // Take full width of the parent

            boxShadow: 3,
            overflow: "hidden",
            m: 1, // Add margin to avoid edge sticking
            padding: "0px !important",
          }}>
          <CardMedia
            component="img"
            sx={{ height: "220px", objectFit: "cover" }}
            image={image}
            alt="Error"
          />
          <CardContent>
            <Typography
              gutterBottom
              variant="subtitle1"
              component="div"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
              {title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                mb: 2,
              }}>
              {subtitle}
            </Typography>
          </CardContent>
          <Link to={path}>
            {" "}
            <Box
              sx={{
                px: 2,
                pb: 2,
                display: "flex",
                gap: 1,
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  backgroundColor: "#FFEEE8",
                  color: "#FF6636",
                  textTransform: "none",
                  flexGrow: 1,
                  maxWidth:
                    hasStarted && progress !== undefined ? "128px" : "auto",
                  "&:hover": {
                    backgroundColor: "#FF6636", // Thay đổi màu nền khi hover
                    color: "#FFF", // Thay đổi màu chữ khi hover
                  },
                }}>
                Watch Lecture
              </Button>
              {hasStarted && (
                <Typography
                  variant="outlined"
                  component="h2"
                  // color="primary"
                  sx={{
                    color: "#23BD33",
                    fontWeight: 500,
                    fontSize: "14px",
                    // width: "fit-content",
                  }}>
                  {progress}% Completed
                </Typography>
              )}
            </Box>
          </Link>
        </Card>
      </Box>
    </Link>
  );
};

export default HorizontalCourseCard;
