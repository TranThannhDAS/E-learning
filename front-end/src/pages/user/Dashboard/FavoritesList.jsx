import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Typography,
  Box,
  Avatar,
  Pagination,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import seedData from "@eproject4/utils/seedData";
import StarIcon from "@mui/icons-material/Star";
import { useDispatch, useSelector } from "react-redux";
import {
  AddFavoriteSource,
  deleteFavoriteSource,
  getAllFavorite,
  getsourceFavoritebyuserid,
} from "@eproject4/services/favorite.service";
import {
  addFavoriteSuccess,
  removeFavoriteSuccess,
  setFavoriteStatus,
  setInitialFavorites,
} from "@eproject4/redux/slices/favoriteSlice";

const Allcourses = seedData();
const couresFive = Allcourses.slice(0, 5);
const length = couresFive.length;

export default function FavoritesList() {
  const dispatch = useDispatch();
  const { getAllFavoriteAction } = getAllFavorite();
  const { getsourceFavoritebyuseridAction } = getsourceFavoritebyuserid();
  const { addFavoriteSourceAction } = AddFavoriteSource();
  const { DeleteFavoriteSourceAction } = deleteFavoriteSource();
  const [getAll, SetGetAll] = useState();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(4);
  // Lấy danh sách yêu thích từ Redux store

  const favorites = useSelector((state) => state.favorites.favorites);
  console.log("favoritesData", favorites);
  // Lấy userId từ danh sách yêu thích nếu có
  const userId = favorites.length > 0 ? favorites[0].userId : null;
  console.log("userId:", userId);
  const [courseData, SetcourseData] = useState([]);

  console.log("courseData", courseData);
  // Hàm để lấy tất cả mục yêu thích từ cơ sở dữ liệu
  const fetchFavoriteData = async () => {
    try {
      const res = await getAllFavoriteAction();
      if (res.status === 200) {
        // Cập nhật Redux store với dữ liệu yêu thích từ cơ sở dữ liệu
        dispatch(setInitialFavorites(res.data));
        SetGetAll(res.data);
      } else {
        console.error("Failed to fetch initial favorites:", res);
      }
    } catch (err) {
      console.error("Error fetching favorites from database:", err);
    }
  };

  // Hàm để lấy các khóa học yêu thích cho người dùng hiện tại
  const fetchFavorites = async () => {
    if (userId) {
      try {
        const res = await getsourceFavoritebyuseridAction(
          userId,
          pageSize,
          pageIndex
        );
        if (res && res.data && res.data.sources) {
          // Cập nhật state với dữ liệu khóa học yêu thích
          SetcourseData(res.data.sources);
        } else {
          console.error("Failed to fetch favorite courses:", res);
        }
      } catch (e) {
        console.error("Error fetching favorite courses:", e);
      }
    }
  };

  // useEffect để gọi hàm fetchFavoriteData khi component được mount
  useEffect(() => {
    fetchFavoriteData();
  }, [dispatch]);

  // useEffect để gọi hàm fetchFavorites khi userId hoặc các tham số phân trang thay đổi
  useEffect(() => {
    fetchFavorites();
  }, [userId, pageSize, pageIndex]);

  // Hàm để thêm hoặc xóa một khóa học khỏi danh sách yêu thích
  const handleToggleFavorite = async (course) => {
    const isFavorited = !!favorites.find((fav) => fav.sourceId === course.id);
    if (isFavorited) {
      const favorite = favorites.find((fav) => fav.sourceId === course.id);
      if (!favorite) return;
      try {
        // Gọi API để xóa mục yêu thích
        const res = await DeleteFavoriteSourceAction(favorite.id);
        if (res.status !== 200) {
          throw new Error(res.data.message || "Failed to delete favorite");
        }
        // Cập nhật Redux store khi xóa thành công
        dispatch(removeFavoriteSuccess(favorite.id));
        dispatch(
          setFavoriteStatus({
            courseId: course.id,
            isFavorited: false,
            favoriteId: null,
          })
        );
      } catch (error) {
        console.error("Failed to delete favorite course:", error);
      }
    } else {
      try {
        // Gọi API để thêm mục yêu thích
        const res = await addFavoriteSourceAction(userId, course.id);
        if (res.status !== 200) {
          throw new Error(res.data.message || "Failed to add favorite");
        }
        // Cập nhật Redux store khi thêm thành công
        dispatch(
          addFavoriteSuccess({
            ...res.data,
            sourceId: course.id,
          })
        );
        dispatch(
          setFavoriteStatus({
            courseId: course.id,
            isFavorited: true,
            favoriteId: res.data.id,
          })
        );
      } catch (error) {
        console.error("Failed to add favorite course:", error);
      }
    }
  };

  // Hàm kiểm tra xem khóa học có trong danh sách yêu thích hay không
  const isCourseFavorited = (courseId) => {
    return !!favorites.find((fav) => fav.sourceId === courseId);
  };

  // Nếu không có mục yêu thích nào, hiển thị thông báo
  if (!favorites || favorites.length === 0) {
    return <div>Bạn chưa có khóa học yêu thích nào.</div>;
  }
  // Xử lý khi thay đổi trang pagination
  const handleChangePagination = (e, newPage) => {
    setPageIndex(newPage);
  };
  const uniqueCourses = getAll?.reduce((acc, course) => {
    if (
      !acc.some((existingCourse) => existingCourse.sourceId === course.sourceId)
    ) {
      acc.push(course);
    }
    return acc;
  }, []);

  return (
    <Box>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Danh sách yêu thích ({uniqueCourses?.length})
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow
              sx={{ color: "#4E5566", fontSize: "14px", fontWeight: 500 }}>
              <TableCell>Khóa học</TableCell>
              <TableCell align="right">Giá</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courseData.map((course, index) => (
              <TableRow key={index}>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    src={course.thumbnail}
                    variant="square"
                    sx={{ width: 160, height: 120, marginRight: 2 }}
                  />
                  <div>
                    <Box
                      sx={{ display: "flex", alignItems: "center" }}
                      gap="3px">
                      <StarIcon
                        sx={{ color: "#FD8E1F", width: "16px", height: "16px" }}
                      />{" "}
                      <Typography variant="body2" color="primary">
                        {course.rating}
                        {/* ({course.views.toLocaleString()} Review) */}
                      </Typography>
                    </Box>

                    <Typography variant="h6">{course.title}</Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ marginTop: "25px" }}>
                      Đăng bởi: {course.slug}
                    </Typography>
                  </div>
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="h6"
                    color="text.primary"
                    sx={{ color: "#FF6636" }}>
                    ${course.price}
                  </Typography>
                  {/* {course.originalPrice && (
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: "line-through",
                        color: "text.secondary",
                      }}>
                      ${course.originalPrice}
                    </Typography>
                  )} */}
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    sx={{
                      marginRight: 1,
                      width: "176px",
                      backgroundColor: "#F5F7FA",
                      color: "#1D2026",
                      fontSize: "16px",
                      fontWeight: 600,
                      height: "48px",
                      "&:hover": {
                        backgroundColor: "#FF6636", // Thay đổi màu nền khi hover
                        color: "#FFF", // Thay đổi màu chữ khi hover
                      },
                    }}>
                    Buy Now
                  </Button>
                  <Button
                    sx={{
                      backgroundColor: "#FF6636", // Thay đổi màu nền khi hover
                      color: "#FFF",
                      "&:hover": {
                        backgroundColor: "#FFEEE8",
                        color: "#FF6636",
                      },
                      height: "48px",
                    }}
                    variant="outlined">
                    Add To Cart
                  </Button>
                  <Button
                    onClick={() => handleToggleFavorite(course)}
                    color="error"
                    sx={{
                      marginLeft: 1,
                      backgroundColor: "#FFEEE8",
                      width: "48px",
                      height: "48px",
                    }}>
                    {isCourseFavorited(course.id) ? (
                      <FavoriteIcon />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center", // Căn giữa Pagination
            margin: "25px 0px",
          }}>
          <Pagination
            count={Math.ceil(getAll?.length / pageSize)}
            onChange={handleChangePagination}
            page={pageIndex}
          />
        </Box>
      </TableContainer>
    </Box>
  );
}
