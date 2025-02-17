import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function LoadingBackdrop({ open }) {
  return (
    <Box>
      <Backdrop open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}

export default LoadingBackdrop;
