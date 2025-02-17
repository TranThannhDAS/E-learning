import React, { useEffect, useState } from "react";
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
  Paper,
  Pagination,
} from "@mui/material";

import styled from "@emotion/styled";
import CardCourse from "@eproject4/components/CardCourse";
import CardCourseDb from "@eproject4/components/StDashboard/HorizontalCourseCard";
import HorizontalCourseCard from "@eproject4/components/StDashboard/HorizontalCourseCard";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { getAllOrdersPag } from "@eproject4/services/order.service";

export default function DashboardContent() {
  const [courseData, setCourseData] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(4);
  // const cleanDescription = DOMPurify.sanitize(courseData.description);
  function removeTags(description) {
    if (typeof description !== "string") {
      return ""; // Trả về chuỗi rỗng nếu description không phải là chuỗi
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(description, "text/html");
    return doc.body.textContent || "";
  }

  // Ví dụ sử dụng với dữ liệu của bạn
  // const cleanedDescription = removeTags(courseData.description);
  const { getAllOrdersPagAction } = getAllOrdersPag();

  useEffect(() => {
    const fetchAllOrderPageData = async () => {
      try {
        const res = await getAllOrdersPagAction(pageIndex, pageSize);
        console.log("All Orders:", res);
        if (res.status === 200) {
          setCourseData(res?.data);
        } else {
          console.error("Failed to fetch initial orders:", res);
        }
      } catch (err) {
        console.error("Error fetching all orders:", err);
      }
    };
    fetchAllOrderPageData();
  }, [pageIndex, pageSize]);
  const handleChangePagination = (e, newPage) => {
    setPageIndex(newPage);
  };

  const [sort, setSort] = React.useState("");
  const [status, setStatus] = React.useState("");
  // const Length = courses.length;

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const stats = [
    {
      icon: <PlayCircleOutlineIcon sx={{ color: "#FF6636", fontSize: 30 }} />,
      number: 957,
      description: "Khóa học đã mua",
      bg: "#FFEEE8",
    },
    {
      icon: <LibraryAddCheckIcon sx={{ color: "#6A5ACD", fontSize: 30 }} />,
      number: 6,
      description: "Khóa học đang học",
      bg: "#E6E6FA",
    },
    {
      icon: <EmojiEventsIcon sx={{ color: "#2E8B57", fontSize: 30 }} />,
      number: 951,
      description: "Khóa học hoàn thành",
      bg: "#98FB98",
    },
  ];

  return (
    <Box>
      <>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Dashboard
        </Typography>

        <Box sx={{ flexGrow: 1, padding: "24px 0px", width: "984px" }}>
          <Grid container spacing={2}>
            {stats.map((stat, index) => (
              <Grid item xs={4} key={index}>
                <Paper
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: 2,
                    backgroundColor: stat.bg,
                  }}
                  elevation={3}>
                  <Card
                    sx={{
                      width: "60px",
                      height: "60px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: "24px",
                    }}>
                    <Box>{stat.icon}</Box>
                  </Card>

                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        color: "#1D2026",
                        fontSize: "24px",
                        fontWeight: 400,
                      }}>
                      {stat.number}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#4E5566",
                        fontSize: "14px",
                        fontWeight: 400,
                      }}>
                      {stat.description}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between", // Căn giữa Pagination
            marginTop: "25px",
          }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Tiếp tục học
          </Typography>
          <Pagination
            count={Math.ceil(Number(courseData?.totalCount) / Number(pageSize))}
            onChange={handleChangePagination}
            page={pageIndex}
          />
        </Box>

        <Grid
          container
          spacing={2}
          sx={{ width: "calc(100% + 27px)", marginLeft: "-13px" }}>
          {courseData.map((course, index) => {
            const cleanedDescriptions = removeTags(course.description); // Mảng các mô tả đã được làm sạch
            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={index}
                sx={{ padding: "16px 5px  !important " }}>
                <HorizontalCourseCard
                  path={`/course-detail/${course.topicName}/${encodeURIComponent(course?.sourceTitle)}/${course?.souresID}`}
                  key={course.souresID}
                  title={course.sourceTitle}
                  subtitle={cleanedDescriptions} // Nối các mô tả thành chuỗi
                  image={course.thumbbnail}
                  progress={course.progress}
                />
              </Grid>
            );
          })}
        </Grid>
      </>
    </Box>
  );
}
