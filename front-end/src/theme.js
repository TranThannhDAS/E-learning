import { experimental_extendTheme as extendTheme } from "@mui/material/styles";

const theme = extendTheme({
  palette: {
    primary: {
      main: "#FF6636",
      background: "#FFFFFF",
      secondary: "#F5F7FA",
      layout: "#0E1640",
      gray: "#1D2026",
      search: "#EBEBEB",
      gray_500: "#8C94A3",
      white: "#FFFFFF"
    },
  },
});

export default theme;
