import Footer from "./Footer";
import Header from "./Header";
import Box from "@mui/material/Box";
import ExampleRedux from "../../ExampleRedux.jsx";

function DefaultLayout({ children }) {
  return (
    <div className="flex flex-col h-[100vh]">
      <Header />
      {/*<ExampleRedux />*/}
      <Box sx={{ flex: 1 }}>
        <Box>{children}</Box>
      </Box>
      <Footer />
    </div>
  );
}

export default DefaultLayout;
