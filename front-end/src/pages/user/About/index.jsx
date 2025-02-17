import React from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";

const statistics = [
  {
    title: "200+",
    description: "Courses",
  },
  {
    title: "30+",
    description: "Instructors",
  },
  {
    title: "4000+",
    description: "Students",
  },
];

const reviews = [
  {
    date: "OUR VISION",
    text: "Cursus blandit eget duis proin orci cursus id faucibus id a amet egestas nullam eget ridiculus pellentesque arcu ac vel eu nunc.",
    name: "Est cras vulputate vitae varius mauris et tristique nibh mauris, elementum, pulvinar ultricies enim vel sed et laoreet ultricies leo ac fringilla id pretium dictumst nibh urna dictum vestibulum in quis venenatis vestibulum in lacus, at ut eget vel in mauris facilisis et mattis elementum.",
  },
  {
    date: "OUR MISSION",
    text: "Malesuada elementum ante mattis ipsum faucibus turpis at scelerisque elit turpis augue elit nisl sit nibh risus accumsan vitae euismod amet, nibh sed velit.",
    name: "Tristique quam augue ac mi ut habitasse id molestie ultrices dignissim elit consectetur ac eget eleifend id id et vestibulum posuere condimentum hendrerit senectus vel dolor mattis et eget vulputate nisl elit.",
  },
];

const instructors = [
  {
    name: "Đăng Tây",
    role: "Web Development Instructor",
    image:
      "https://scontent.fhan2-3.fna.fbcdn.net/v/t39.30808-6/241521873_1136720363525352_608366653185968406_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_ohc=h0b0-bsLVtgQ7kNvgGmxRKi&_nc_ht=scontent.fhan2-3.fna&oh=00_AYBjubvOIcNQUmq9bQ5boIhSBogSz6W-Xcx0gW55vAGcXA&oe=66806F00",
    social: {
      facebook: "#",
      twitter: "#",
      youtube: "#",
    },
  },
  {
    name: "Xuân Sơn",
    role: "Game Development Instructor",
    image:
      "https://scontent.fhan5-6.fna.fbcdn.net/v/t1.6435-9/133623750_1112261565874253_7020905658337468863_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=5f2048&_nc_ohc=YR2spQJJ5nwQ7kNvgH59kjx&_nc_ht=scontent.fhan5-6.fna&oh=00_AYAF2YEBYwYK0XG6tfmxxCM62rpNp3noFv4wxedfKQQRJw&oe=667D08D1",
    social: {
      facebook: "#",
      twitter: "#",
      youtube: "#",
    },
  },
  {
    name: "Đạt 09",
    role: "Backend Learning Instructor",
    image:
      "https://scontent.fhan2-3.fna.fbcdn.net/v/t39.30808-6/297492400_1073112033568717_689076714172404748_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_ohc=osfqvBhdIzgQ7kNvgHRmMLb&_nc_ht=scontent.fhan2-3.fna&oh=00_AYBvXrOynbdvnoI4cdJOQzHlZccPB7lhZZkeKGw9vdHZsw&oe=6680820E",
    social: {
      facebook: "#",
      twitter: "#",
      youtube: "#",
    },
  },
  {
    name: "Đăng Gay",
    role: "Data Science Instructor",
    image:
      "https://photo.znews.vn/w660/Uploaded/unvjuas/2020_05_15/EYBgoZdUwAAslBr.jpg",
    social: {
      facebook: "#",
      twitter: "#",
      youtube: "#",
    },
  },
];

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
}));

const BackgroundBox = styled(Box)(({ theme }) => ({
  width: "100%",
  backgroundImage:
    "url(https://websitedemos.net/online-coding-course-02/wp-content/uploads/sites/713/2020/10/online-programming-course-hero-section-bg.svg)", // Đường dẫn tới ảnh nền
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: theme.spacing(8, 2),
  textAlign: "center",
  position: "relative",
  zIndex: 1,
  color: "#fff",
}));
const SocialIcons = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  "& > *": {
    margin: theme.spacing(0.5),
  },
}));

const About = () => {
  return (
    <>
      <BackgroundBox>
        <Container>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontSize: "56px", fontWeight: 500 }}>
            About Us
          </Typography>
          <Typography
            component="p"
            gutterBottom
            sx={{ fontSize: "18px", fontWeight: 400, marginBottom: "20px" }}>
            <p>
              Porta platea eget tincidunt nunc massa sed fermentum felis, vel,
              egestas nec interdum et <br /> scelerisque blandit nunc faucibus
              et adipiscing diam cursus aenean nulla.
            </p>
          </Typography>

          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: 0,
              paddingBottom: "56.25%",
              marginTop: 2,
              marginBottom: 4,
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "#000",
            }}>
            <Box
              component="img"
              src="https://websitedemos.net/online-coding-course-02/wp-content/uploads/sites/713/2020/10/online-coding-course-team-video-thumb-img.jpg"
              alt="About Us"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",

                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </Box>
        </Container>
      </BackgroundBox>

      <Container>
        <Typography
          sx={{ mt: 6, fontSize: "32px", fontWeight: "600" }}
          variant="h4"
          component="h2"
          gutterBottom
          align="center"
          color="primary">
          Let Numbers Talk
        </Typography>

        <Grid container spacing={4} justifyContent="center" mb={6}>
          {statistics.map((item, index) => (
            <Grid item xs={12} sm={4} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography
                    variant="h4"
                    component="h2"
                    align="center"
                    color="primary">
                    {item.title}
                  </Typography>
                  <Typography variant="body1" align="center">
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box my={6}>
          <Typography
            sx={{ fontSize: "32px", fontWeight: "600" }}
            variant="h4"
            component="h2"
            gutterBottom
            align="center"
            color="primary">
            Introduction
          </Typography>
          {reviews.map((review, index) => (
            <StyledPaper elevation={3} key={index} sx={{ mb: 6 }}>
              <Box p={2}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {review.date}
                </Typography>
                <Typography variant="body1" paragraph>
                  {review.text}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {review.name}
                </Typography>
              </Box>
            </StyledPaper>
          ))}
        </Box>

        <Box textAlign="center" mb={6}>
          <Typography
            sx={{ fontSize: "32px", fontWeight: "600" }}
            variant="h4"
            component="h2"
            gutterBottom
            color="primary">
            Meet The Instructors
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {instructors.map((instructor, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box sx={{ textAlign: "center" }}>
                <Avatar
                  alt={instructor.name}
                  src={instructor.image}
                  sx={{ width: 268, height: 268, margin: "auto" }}
                />
                <Typography variant="h6" component="h3" mt={2}>
                  {instructor.name}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {instructor.role}
                </Typography>
                <SocialIcons mt={2}>
                  <IconButton href={instructor.social.facebook} color="primary">
                    <FacebookIcon />
                  </IconButton>
                  <IconButton href={instructor.social.twitter} color="primary">
                    <TwitterIcon />
                  </IconButton>
                  <IconButton href={instructor.social.youtube} color="primary">
                    <YouTubeIcon />
                  </IconButton>
                </SocialIcons>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
      <BackgroundBox sx={{ marginTop: "80px" }}>
        <Container>
          <Typography
            component="h6"
            gutterBottom
            sx={{ fontSize: "13px", fontWeight: 600 }}>
            SUBSCRIBE
          </Typography>
          <Typography
            component="h2"
            gutterBottom
            sx={{ fontSize: "56px", fontWeight: 600 }}>
            All Access Membership
          </Typography>
          <Typography
            component="p"
            gutterBottom
            sx={{ fontSize: "18px", fontWeight: 400, marginBottom: "20px" }}>
            <p>
              Dictum enim vel in consectetur arcu nunc habitasse mattis vitae
              accumsan, etiam ultrices eget non tincidunt.
            </p>
          </Typography>
        </Container>
      </BackgroundBox>
    </>
  );
};

export default About;
