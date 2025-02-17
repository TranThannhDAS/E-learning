import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { ReactComponent as Logo } from "@eproject4/assets/images/logo.svg";
import { SvgIcon, Typography } from "@mui/material";

function Footer() {
  return (
    <Container maxWidth={false} disableGutters={true}>
      <Box
        height={{ xs: "auto", md: "329px" }}
        sx={{
          backgroundColor: (theme) => theme.palette.primary.layout,
          paddingY: "59px",
        }}>
        <Box
          width={"85%"}
          sx={{
            marginX: "auto",
            display: "flex",
            justifyContent: "space-around",
            flexDirection: { xs: "column", md: "row" },
          }}>
          <Box
            sx={{
              flex: 1,
              marginRight: { xs: 0, md: "20px" },
              marginBottom: { xs: "20px", md: 0 },
            }}>
            <Box className="flex items-center">
              <SvgIcon
                component={Logo}
                inheritViewBox
                sx={{
                  color: "#FFFFFF",
                  display: "flex",
                  mr: "20px",
                  width: "53px",
                  height: "34px",
                }}
              />
              <Typography
                variant="h6"
                noWrap
                href="#app-bar-with-responsive-menu"
                sx={{
                  fontSize: { xs: "24px", md: "36px" },
                  fontWeight: 500,
                  color: "#FFFFFF",
                }}>
                E-Learning
              </Typography>
            </Box>
            <Box sx={{ marginTop: "19px" }}>
              <Typography
                sx={{ fontWeight: 400, fontSize: "14px", color: "#D9DCDE" }}
                component="p"
                color="primary.white">
                Điện thoại: 09876543212{" "}
              </Typography>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: "14px",
                  color: "#D9DCDE",
                  marginTop: "10px",
                }}
                component="p"
                color="primary.white">
                Email: lmsproject@gmail.com
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              marginRight: { xs: 0, md: "20px" },
              marginBottom: { xs: "20px", md: 0 },
              marginTop: { xs: "20px", md: 0 },
            }}>
            <Box>
              <Typography
                variant="h6"
                color={(theme) => theme.palette.primary.white}
                sx={{ fontSize: { xs: "18px", md: "18px" }, fontWeight: 400 }}>
                Top 3 danh mục
              </Typography>
              <Typography
                color={(theme) => theme.palette.primary.white}
                component={"p"}
                sx={{ fontSize: "13px", fontWeight: 200, marginTop: "15px" }}>
                Development
              </Typography>
              <Typography
                sx={{ fontSize: "13px", fontWeight: 200, marginTop: "10px" }}
                color={(theme) => theme.palette.primary.white}
                component={"p"}>
                Kinh doanh
              </Typography>
              <Typography
                sx={{ fontSize: "13px", fontWeight: 200, marginTop: "10px" }}
                color={(theme) => theme.palette.primary.white}
                component={"p"}>
                Thiết kế
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              marginRight: { xs: 0, md: "20px" },
              marginBottom: { xs: "20px", md: 0 },
              marginTop: { xs: "20px", md: 0 },
            }}>
            <Box>
              <Typography
                variant="h6"
                color={(theme) => theme.palette.primary.white}
                sx={{ fontSize: { xs: "18px", md: "18px" }, fontWeight: 400 }}>
                Hỗ trợ
              </Typography>
              <Typography
                color={(theme) => theme.palette.primary.white}
                component={"p"}
                sx={{ fontSize: "13px", fontWeight: 200, marginTop: "15px" }}>
                Về chúng tôi
              </Typography>
              <Typography
                sx={{ fontSize: "13px", fontWeight: 200, marginTop: "10px" }}
                color={(theme) => theme.palette.primary.white}
                component={"p"}>
                Điều khoản
              </Typography>
              <Typography
                sx={{ fontSize: "13px", fontWeight: 200, marginTop: "10px" }}
                color={(theme) => theme.palette.primary.white}
                component={"p"}>
                Bảo mật
              </Typography>
              <Typography
                sx={{ fontSize: "13px", fontWeight: 200, marginTop: "10px" }}
                color={(theme) => theme.palette.primary.white}
                component={"p"}>
                Cơ hội việc làm
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              marginBottom: { xs: "20px", md: 0 },
              marginTop: { xs: "20px", md: 0 },
            }}>
            <Box>
              <Typography
                variant="h6"
                color={(theme) => theme.palette.primary.white}
                sx={{ fontSize: { xs: "18px", md: "18px" }, fontWeight: 400 }}>
                Link
              </Typography>
              <Typography
                color={(theme) => theme.palette.primary.white}
                component={"p"}
                sx={{ fontSize: "13px", fontWeight: 200, marginTop: "15px" }}>
                Liên hệ
              </Typography>
              <Typography
                sx={{ fontSize: "13px", fontWeight: 200, marginTop: "10px" }}
                color={(theme) => theme.palette.primary.white}
                component={"p"}>
                Công việc
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flex: 1, marginTop: { xs: "20px", md: 0 } }}>
            <Box>
              <Typography
                variant="h6"
                color={(theme) => theme.palette.primary.white}
                sx={{ fontSize: { xs: "18px", md: "18px" }, fontWeight: 400 }}>
                Hệ thống giáo dục E-Learning
              </Typography>
              <Typography
                color={(theme) => theme.palette.primary.white}
                component={"p"}
                sx={{ fontSize: "13px", fontWeight: 200, marginTop: "15px" }}>
                Mã số thuế: 0109922901
              </Typography>
              <Typography
                sx={{ fontSize: "13px", fontWeight: 200, marginTop: "10px" }}
                color={(theme) => theme.palette.primary.white}
                component={"p"}>
                Ngày thành lập: 02/05/2024
              </Typography>
              <Typography
                sx={{ fontSize: "13px", fontWeight: 200, marginTop: "10px" }}
                color={(theme) => theme.palette.primary.white}
                component={"p"}>
                Lĩnh vực: Công nghệ, giáo dục
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default Footer;
