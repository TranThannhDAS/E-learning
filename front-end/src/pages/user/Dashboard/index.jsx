// src/Dashboard.js

import React from "react";
import CustomTabPanel from "@eproject4/components/CustomTabPanel";
import {
  Container,
  Box,
  Typography,
  Avatar,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
} from "@mui/material";
import { styled } from "@mui/system";
import DashboardContent from "./DashboardContent";
import Course from "./Course";
import FavoritesList from "./FavoritesList";
import Setting from "./Setting";
import { getUser } from "@eproject4/helpers/authHelper";

// Taps
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
// ----------------------------------------------------------------

const HeaderBackground = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff4f2",
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(10),
  display: "flex",
  justifyContent: "center",
}));

const MainContent = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: "100%",
  marginTop: "-200px", // This makes the content overlap with the header background
}));

const ProfileCard = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
}));

const UserDashboard = () => {
  const [value, setValue] = React.useState(0);
  const user = getUser();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box>
      <HeaderBackground sx={{ height: "280px" }}></HeaderBackground>
      <Box sx={{ maxWidth: "1320px", margin: "auto" }}>
        <MainContent
          sx={{
            border: "1px solid #FFDDD1",
            boxShadow: "none",
            padding: "0px",
          }}>
          <ProfileCard sx={{ padding: "40px", margin: "0px" }}>
            <Avatar
              src="https://haycafe.vn/wp-content/uploads/2022/02/Avatar-trang.jpg"
              alt="Kevin Gilbert"
              sx={{ width: 110, height: 110, marginRight: 2 }}
            />
            <Box>
              <Typography variant="h6" sx={{ marginBottom: "14px" }}>
                {user?.username}
              </Typography>
              <Typography variant="body2">
                Web Designer & Best-Selling Instructor
              </Typography>
            </Box>
          </ProfileCard>
          <Box
            sx={{
              borderTop: "1px solid #FFDDD1",
              display: "flex",
              justifyContent: "center",
            }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example">
              <Tab label="Dashboard" {...a11yProps(0)} />
              <Tab label="Khóa học" {...a11yProps(1)} />
              <Tab label="Danh sách yêu thích" {...a11yProps(2)} />

              <Tab label="Cài đặt tài khoản" {...a11yProps(3)} />
            </Tabs>
          </Box>
        </MainContent>
        <Box>
          <CustomTabPanel value={value} index={0}>
            <DashboardContent />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Course />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <FavoritesList />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <Setting />
          </CustomTabPanel>
        </Box>
      </Box>
    </Box>
  );
};

export default UserDashboard;
