import React from "react";
import { Box, Divider } from "@mui/material";
import {
  AppBar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from "@mui/material";
import { logout } from "@eproject4/services/auth";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as LmsLogo } from "@eproject4/assets/images/logo.svg";
import { Link } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import FilterNoneOutlinedIcon from "@mui/icons-material/FilterNoneOutlined";
import Filter2OutlinedIcon from "@mui/icons-material/Filter2Outlined";

const routes = [
  { slug: "dashboard", icon: <DashboardIcon />, name: "Dashboard" },
  { slug: "user", icon: <PersonOutlineIcon />, name: "User" },
  { slug: "khoa-hoc", icon: <LayersOutlinedIcon />, name: "Khóa học" },
  {
    slug: "tao-khoa-hoc",
    icon: <AddCircleOutlineOutlinedIcon />,
    name: "Tạo khóa học",
  },
  { slug: "danh-muc", icon: <FilterNoneOutlinedIcon />, name: "Danh mục" },
  { slug: "danh-muc-con", icon: <Filter2OutlinedIcon />, name: "Danh mục con" },
];

function AdminLayout({ name, children }) {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { logoutAction } = logout();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    setAnchorElUser(null);
    await logoutAction();
    window.location.reload();
  };

  return (
    <Box sx={{ backgroundColor: "#F0F0F0", minHeight: "100vh" }}>
      <AppBar
        sx={{
          height: "70px",
          backgroundColor: "#FFFFFF",
          boxShadow: "none",
          width: "calc(100% - 240px)",
          position: "unset",
          marginLeft: "240px",
        }}
        open={true}>
        <Box
          sx={{
            width: "90%",
            margin: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <Box>
            <Typography
              variant="h4"
              sx={{ color: "black", fontSize: "20px", fontWeight: 600 }}>
              {name}
            </Typography>
          </Box>
          <Box>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}>
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography textAlign="center">Tài khoản</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography textAlign="center">Khóa học</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Typography textAlign="center">Đăng xuất</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </AppBar>
      <Box>
        <Drawer
          sx={{
            width: "240px",
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: "240px",
              boxSizing: "border-box",
              height: "100vh",
              backgroundColor: "#1D2026",
            },
          }}
          variant="permanent"
          anchor="left">
          <Box sx={{ display: "flex", alignItems: "center", padding: "20px" }}>
            <SvgIcon
              component={LmsLogo}
              inheritViewBox
              sx={{
                color: "#FFFFFF",
                display: { xs: "none", md: "flex" },
                mr: "10px",
              }}
            />
            <Link to="/" className="mr-[50px] hidden md:flex">
              <Typography
                variant="h6"
                noWrap
                href="#app-bar-with-responsive-menu"
                sx={{
                  fontSize: "20px",
                  display: { xs: "none", md: "flex" },
                  fontWeight: 500,
                  color: "#FFFFFF",
                }}>
                E-Learning
              </Typography>
            </Link>
          </Box>
          <Divider component={"div"} sx={{ borderColor: "#8C94A3" }} />
          <List>
            {routes.map((route, index) => (
              <Link key={index} to={`/admin/${route.slug}`}>
                <ListItem
                  sx={{
                    backgroundColor:
                      location.pathname.startsWith(`/admin/${route.slug}`) &&
                      (location.pathname == `/admin/${route.slug}` ||
                        location.pathname[`/admin/${route.slug}`.length] ===
                          "/")
                        ? "#FF6636"
                        : "transparent",
                    "&:hover": {
                      backgroundColor:
                        location.pathname === `/admin/${route.slug}`
                          ? "#FF6636"
                          : "#f4f4f4",
                    },
                  }}>
                  <Typography
                    sx={{
                      marginRight: "10px",
                      color:
                        location.pathname.startsWith(`/admin/${route.slug}`) &&
                        (location.pathname == `/admin/${route.slug}` ||
                          location.pathname[`/admin/${route.slug}`.length] ===
                            "/")
                          ? "#FFF"
                          : "#8C94A3",
                    }}>
                    {route.icon}
                  </Typography>
                  <ListItemText
                    primary={route.name}
                    sx={{
                      color:
                        location.pathname.startsWith(`/admin/${route.slug}`) &&
                        (location.pathname == `/admin/${route.slug}` ||
                          location.pathname[`/admin/${route.slug}`.length] ===
                            "/")
                          ? "#FFF"
                          : "#8C94A3",
                    }}
                  />
                </ListItem>
              </Link>
            ))}
          </List>
        </Drawer>
      </Box>
      <Box
        sx={{
          width: "calc(100% - 240px)",
          flexGrow: 1,
          marginLeft: "240px",
          marginTop: "70px",
          // marginBottom: "70px",
          paddingBottom: "40px",
          height: "100%",
        }}>
        {children}
      </Box>
    </Box>
  );
}

export default AdminLayout;
