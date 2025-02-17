import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { Card, CardContent, CardMedia } from "@mui/material";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import StarIcon from "@mui/icons-material/Star";

const CardCourse = ({
  path = "#",
  category = "",
  price = "",
  title = "",
  rating = 1,
  students = 0,
  image = "https://bom.so/vV4j7x",
}) => {
  return (
    <Box>
      <Link to={path}>
        <Box sx={{ display: "inline-block" }}>
          <Card sx={{ maxWidth: "244px", borderRadius: 0 }}>
            <CardContent sx={{ padding: 0, paddingBottom: "13px !important" }}>
              <CardMedia
                component="img"
                sx={{ height: "183px", width: "244px" }}
                image={image}
                alt="Error"
              />
              <Box sx={{ padding: "14px" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                  <Paper
                    elevation={0}
                    sx={{
                      backgroundColor: "#eaeaea",
                      borderRadius: 0,
                      fontSize: "10px",
                      display: "inline-block",
                      padding: "5px",
                      color: "#727171",
                    }}>
                    {category}
                  </Paper>
                  <Typography
                    variant={"h5"}
                    component={"span"}
                    sx={{
                      fontSize: "18px",
                      fontWeight: 600,
                      color: "#FF6636",
                    }}>
                    {price}
                  </Typography>
                </Box>
                <Tooltip title={title}>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      marginTop: "13px",
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                    }}
                    variant="h5"
                    component="h2"
                    color="#1D2026"
                    gutterBottom>
                    {title}
                  </Typography>
                </Tooltip>
              </Box>
              <Divider
                sx={{
                  borderColor: "#E9EAF0",
                  opacity: "0.7",
                }}
              />
              <Box
                sx={{
                  paddingX: "14px",
                  paddingTop: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <Box sx={{ display: "flex", alignItems: "center" }} gap="3px">
                  <StarIcon
                    sx={{ color: "#FD8E1F", width: "16px", height: "16px" }}
                  />{" "}
                  <Typography sx={{ fontSize: "14px" }}>{rating}</Typography>
                </Box>
                <Box>
                  <Typography
                    variant="h4"
                    component={"span"}
                    sx={{ fontSize: "15px", fontWeight: 500 }}>
                    {students}
                  </Typography>
                  <Typography
                    component={"span"}
                    sx={{
                      marginLeft: "4px",
                      fontSize: "14px",
                      color: "#8C94A3",
                      fontWeight: 400,
                    }}>
                    students
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Link>
    </Box>
  );
};

export default CardCourse;
