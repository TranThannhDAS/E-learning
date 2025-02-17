import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import NotFoundImg from "../assets/images/notfound.png";

function NotFound() {
  return (
    <Box sx={{ display: "flex", paddingX: "300px", alignItems: "center" }}>
      <Box
        sx={{
          width: "64%",
          marginRight: "100px",
        }}>
        <Typography
          component={"h1"}
          variant="h1"
          sx={{
            color: "#E9EAF0",
            fontWeight: 600,
            fontSize: "80px",
            marginBottom: "15px",
          }}>
          Error 404
        </Typography>
        <Typography
          component={"h3"}
          variant="h3"
          sx={{
            fontSize: "48px",
            fontWeight: 600,
            marginBottom: "20px",
          }}>
          Opps! page not found
        </Typography>
        <Typography
          sx={{ fontWeight: 400, fontSize: "20px", color: "#4E5566" }}
          component={"p"}>
          Something went wrong. It’s look that your requested could not be
          found. It's look like the link is broken or the page is removed.
        </Typography>
      </Box>
      <Box
        sx={{
          xs: { dipaly: "none" },
        }}>
        <img className="" src={NotFoundImg} alt="Error" />
      </Box>
    </Box>
  );
}

export default NotFound;
