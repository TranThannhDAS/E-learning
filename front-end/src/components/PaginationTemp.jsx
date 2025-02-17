import React from "react";
import { Pagination, Stack, createTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";

const PaginationTemp = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: "##FF6636", // Màu cam
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Stack
        spacing={2}
        sx={{
          justifyContent: "center",
          alignItems: "center",
          margin: "30px 0px",
        }}>
        <Pagination count={10} color="primary" />
      </Stack>
    </ThemeProvider>
  );
};

export default PaginationTemp;
