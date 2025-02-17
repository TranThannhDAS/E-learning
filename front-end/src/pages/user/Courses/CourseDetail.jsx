import * as React from "react";
import DOMPurify from "dompurify";
import PropTypes from "prop-types";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Modal,
  Tab,
  Tabs,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import Typography from "@mui/material/Typography";

import CardCourse from "@eproject4/components/CardCourse.jsx";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";

import "swiper/css";
import "swiper/css/navigation";
import { useEffect, useState } from "react";
import ButtonCustomize from "@eproject4/components/ButtonCustomize";
import {
  getAllCourses,
  getCourseById,
  CourseOrder,
} from "@eproject4/services/courses.service";
import { getAllTopics, getTopicById } from "@eproject4/services/topic.service";
import {
  AddFavoriteSource,
  deleteFavoriteSource,
  getAllFavorite,
} from "@eproject4/services/favorite.service";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavoriteSuccess,
  removeFavoriteSuccess,
  setFavoriteStatus,
  setInitialFavorites,
} from "@eproject4/redux/slices/favoriteSlice";
import { favoriteSelector } from "@eproject4/redux/selectors";
// import SourceDetail from "@eproject4/components/SourceDetail";
import {
  getAllOrder,
  getOrderforFree,
} from "@eproject4/services/order.service";
import {
  addEnrollment,
  setEnrollmentStatus,
  setInitialEnrollments,
} from "@eproject4/redux/slices/enrollmentSlice";
import { getUser } from "@eproject4/helpers/authHelper";
import { cartServices } from "@eproject4/services/cart.service";
import { setShoppingCartRender } from "@eproject4/redux/slices/orderSlide";
import useCustomSnackbar from "@eproject4/utils/hooks/useCustomSnackbar";

// Tabs
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && (
        <Box
          sx={{
            padding: "24px 0px",
            textAlign: "justify",
          }}>
          <Typography
            sx={{ fontSize: "24px", fontWeight: 600, color: "#1D2026" }}>
            {children}
          </Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const CourseDetail = () => {
  const { addCart } = cartServices();
  const { getCourseByIdAction } = getCourseById();
  const { getCoursesAction } = getAllCourses();
  const { getAllTopicsAction } = getAllTopics();
  const { getTopicByIdAction } = getTopicById();
  const { getOrderforFreeAction } = getOrderforFree();
  const { showSnackbar } = useCustomSnackbar();
  const { getAllOrderAction } = getAllOrder();
  const { CheckCourseOrder } = CourseOrder();
  const user = getUser();

  const { getAllFavoriteAction } = getAllFavorite();
  const { addFavoriteSourceAction } = AddFavoriteSource();
  const { DeleteFavoriteSourceAction } = deleteFavoriteSource();

  const [isInCart, setIsInCart] = useState(false); // Trạng thái đã thêm vào giỏ hàng

  // const [orderData, SetOrderData] = useParams();
  const { category, title, id } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const isEnrolled =
    useSelector((state) => state.enrollment.enrolledCourses[id]?.isEnrolled) ||
    false;

  console.log(isEnrolled);
  const [courseData, SetcourseData] = useState([]);

  // Lấy danh sách các khóa học đã đăng ký từ Redux store
  const enrollments = useSelector((state) => state.enrollment.enrolledCourses);
  console.log("enrollments:", enrollments);

  console.log(courseData);
  const [courseDetail, setCourseDetail] = useState(null); // Đối tượng để lưu chi tiết khóa học

  const navigate = useNavigate(); // Khởi tạo useNavigate

  const favoriteData = useSelector(
    (state) => state.favorites.favoritedCourses[id]
  );
  const isFavorited = favoriteData ? favoriteData.isFavorite : false;
  const favoriteId = favoriteData ? favoriteData.favoriteId : null;

  const dispatch = useDispatch();
  const favorites = useSelector(favoriteSelector);
  console.log("favorites", favorites);

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [subTopicName, setSubTopicName] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [coursesWithSubTopicName, setCoursesWithSubTopicName] = useState([]);
  const [checkCourse, setCheckCourse] = useState(false);
  const handleCardClick = (item) => {
    const path = `/course-detail/${item?.topicName}/${encodeURIComponent(item?.source?.title)}/${item?.source.id}`;
    window.location.href = path;
  };

  const cleanDescription = DOMPurify.sanitize(courseData.description);

  //Button
  const buttonStyle = {
    color: "gray",
    backgroundColor: "#f0f0f0",
    margin: "5px",
    minWidth: "48px",
    height: "48px",
    "& .MuiButton-startIcon": {
      margin: 0,
    },
  };

  // Rating
  const labels = {
    0.5: "Useless",
    1: "Useless+",
    1.5: "Poor",
    2: "Poor+",
    2.5: "Ok",
    3: "Ok+",
    3.5: "Good",
    4: "Good+",
    4.5: "Excellent",
    5: "Excellent+",
  };
  const [value1, setValue1] = React.useState(2);
  const [hover, setHover] = React.useState(-1);

  function getLabelText(value1) {
    return `${value1} Star${value1 !== 1 ? "s" : ""}, ${labels[value1]}`;
  }

  // Tabs
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  //Check Course
  const CheckCourseIsOrder = async () => {
    const user = getUser();
    console.log("Course", courseData);
    const res = await CheckCourseOrder(user.id, id);
    console.log("OrderCheck", res);
    setCheckCourse(res.data);
  };
  //Get all Favorite

  useEffect(() => {
    const fetchFavoriteData = async () => {
      try {
        const res = await getAllFavoriteAction();
        if (res.status === 200) {
          dispatch(setInitialFavorites(res.data));
        } else {
          throw new Error("Failed to fetch favorite data");
        }
      } catch (err) {
        throw new Error(err);
      }
    };
    fetchFavoriteData();
  }, [dispatch]);
  const handleAddCart = async () => {
    //kiểm tra Login
    var checkUser = getUser();
    if (checkUser == null) {
      navigate("/dang-nhap");
    }
    if (
      courseData &&
      courseData.title &&
      courseData.price &&
      courseData.thumbnail
    ) {
      const data = {
        sourceName: courseData.title,
        price: courseData.price,
        userid: checkUser.id,
        sourceId: courseData.id == null ? 11 : courseData.id,
        username: checkUser.username,
        email: checkUser.email,
        Thumbnail: courseData.thumbnail,
      };
      const res = await addCart(data);
      console.log("test", res);
      if (res.data.code == 200) {
        showSnackbar(res.data.mess, "success");
        dispatch(setShoppingCartRender({ status: true }));
      } else {
        showSnackbar(res.data.mess, "error");
      }
    }
  };

  // Get Course by Id
  useEffect(() => {
    const fetchCourseDetailData = async () => {
      try {
        const res = await getCourseByIdAction(id);

        SetcourseData(res?.data);
        setCourseDetail(res?.data);

        if (res?.data?.subTopicId) {
          const subTopicRes = await getTopicByIdAction(res.data.subTopicId);

          setSubTopicName(subTopicRes?.data?.topicName || "");
        }
      } catch (err) {
        throw new Error(err);
      }
    };
    if (id) {
      // Chỉ gọi hàm fetchCourseDetailData khi id tồn tại
      fetchCourseDetailData();
      CheckCourseIsOrder();
    }
  }, [id]);

  useEffect(() => {
    const FetchData = async () => {
      try {
        // gọi Api song song
        const [coursesResponse, topicsResponse] = await Promise.all([
          getCoursesAction(),
          getAllTopicsAction(),
        ]);
        const courses = coursesResponse?.data;
        const topics = topicsResponse?.data?.items;

        const topicMap = topics.reduce((acc, topic) => {
          acc[topic.id] = topic.topicName;
          return acc;
        }, {});
        // Kết hợp dữ liệu từ hai API
        const combinedData = courses.map((course) => ({
          ...course,
          topicName: topicMap[course.topicId] || "Unknown SubTopic",
        }));

        setCoursesWithSubTopicName(combinedData);
      } catch (error) {
        throw new Error(error);
      }
    };
    FetchData();
  }, []);

  // Lọc các khóa học theo chủ đề khi topicName hoặc newItems thay đổi
  useEffect(() => {
    const filter = coursesWithSubTopicName
      .filter((c) => c.topicName === category && c.source.status === 1)
      .slice(0, 5);
    setFilteredData(filter);
  }, [coursesWithSubTopicName, category]);

  // Fetch favorite status
  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!user.id) {
        return;
      }
      try {
        const res = await addFavoriteSourceAction(user.id, id);

        if (res.status === 200 && res.data) {
          const isFavorite = res.data.isFavorite; // Giả sử isFavorite là boolean
          dispatch(
            setFavoriteStatus({
              courseId: id,
              isFavorited: isFavorite,
              favoriteId: res.data.id,
            })
          );
        } else {
          dispatch(
            setFavoriteStatus({
              courseId: id,
              isFavorited: false,
              favoriteId: null,
            })
          );
        }
      } catch (e) {
        throw new Error(e);
      }
    };

    if (courseDetail?.userId) {
      fetchFavoriteStatus();
    }
  }, [id, dispatch]);

  const handleAddFavorite = async () => {
    if (isFavorited) return;
    try {
      const res = await addFavoriteSourceAction(user.id, id);
      if (res.status !== 200) {
        throw new Error(res.data.message || "Failed to add favorite");
      }
      dispatch(addFavoriteSuccess({ ...res.data, sourceId: id }));
      dispatch(
        setFavoriteStatus({
          courseId: id,
          isFavorited: true,
          favoriteId: res.data.id,
        })
      );
    } catch (e) {
      throw new Error(e);
    }
  };

  const handleRemoveFavorite = async () => {
    if (!isFavorited || !favoriteId) return;
    try {
      const res = await DeleteFavoriteSourceAction(favoriteId);
      if (res.status !== 200) {
        throw new Error(res.data.message || "Failed to delete favorite");
      }
      dispatch(removeFavoriteSuccess(favoriteId));
      dispatch(
        setFavoriteStatus({
          courseId: id,
          isFavorited: false,
          favoriteId: null,
        })
      );
    } catch (e) {
      console.error("Error removing favorite:", e);
    }
  };

  //Order Data Check

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const res = await getAllOrderAction();
        if (res.status === 200) {
          dispatch(setInitialEnrollments(res.data));
        } else {
          console.error("Failed to fetch all orders:", res);
        }
      } catch (error) {
        console.error("Error fetching all orders:", error);
      }
    };

    fetchAllOrders();
  }, [dispatch]);

  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      try {
        const res = await getOrderforFreeAction(courseData.userId, id);
        if (res.data && res.data.status) {
          dispatch(setEnrollmentStatus({ courseId: id, isEnrolled: true }));
        } else {
          dispatch(setEnrollmentStatus({ courseId: id, isEnrolled: false }));
        }
      } catch (error) {
        console.error("Error checking enrollment status:", error);
      }
    };
    if (courseData.userId && isInitialLoad) {
      checkEnrollmentStatus();
      setIsInitialLoad(false);
    }
  }, [id, dispatch, isInitialLoad]);

  const handleRegisterClick = async () => {
    if (isEnrolled) {
      navigate(`/watch-course/${title}/${id}/`);
    } else if (courseData.price > 0) {
      await handleAddCart();
      navigate("/checkoutCart");
    } else {
      setIsModalOpen(true);
    }
  };

  const handleConfirmEnroll = async () => {
    try {
      const res = await getOrderforFreeAction(courseData.userId, id);
      if (res.status === 200) {
        dispatch(addEnrollment({ userId: courseData.userId, courseId: id }));
        dispatch(setEnrollmentStatus({ courseId: id, isEnrolled: true }));
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
    setIsModalOpen(false);
  };

  return (
    <Box>
      <Box sx={{ backgroundColor: "#F5F7FA" }}>
        <Box
          sx={{
            maxWidth: "1320px",
            margin: "auto",
            padding: "40px 0",
          }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/">
              Home
            </Link>
            <Link underline="hover" color="inherit" href="/development">
              {category}
            </Link>
            <Link underline="hover" color="inherit" href="/web-development">
              Web{category}
            </Link>
          </Breadcrumbs>
          <Typography variant="h4" sx={{ margin: "24px 0px", fontWeight: 500 }}>
            {title}
          </Typography>
          <Typography
            variant="p"
            sx={{
              color: "var(--Gray-700, #4E5566)", // Using CSS custom properties with fallback
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "32px", // Line height as a string to include unit
            }}>
            3 in 1 Course: Learn to design websites with Figma, build with
            Webflow, and make a living freelancing.
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              maxWidth: "930px",
              marginTop: "24px",
            }}>
            <Box
              sx={{
                color: "var(--Gray-60, #6E7485)", // Using CSS custom properties with fallback
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "22px",
              }}>
              <Typography
                variant="p"
                sx={{
                  paddingRight: "10px", // Line height as a string to include unit
                }}>
                Tạo bởi:
              </Typography>
              <Typography variant="p">{category}</Typography>
            </Box>

            <Box
              sx={{
                width: 200,
                display: "flex",
                alignItems: "center",
              }}>
              <Rating
                name="hover-feedback"
                value1={value1}
                precision={0.5}
                getLabelText={getLabelText}
                onChange={(event, newValue1) => {
                  setValue1(newValue1);
                }}
                onChangeActive={(event, newHover) => {
                  setHover(newHover);
                }}
                emptyIcon={
                  <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                }
              />
              {value1 !== null && (
                <Box sx={{ ml: 2 }}>
                  {labels[hover !== -1 ? hover : value1]}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      {/* ................ */}
      {/* All list */}
      <Box sx={{ maxWidth: "1320px", margin: "auto" }}>
        {" "}
        <Box sx={{ marginTop: "40px", textAlign: "center" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}>
            <Box>
              {" "}
              <CardMedia
                sx={{ width: "835px", height: "471px", objectFit: "cover" }}
                component="video"
                controls
                src={courseData.videoIntro}>
                Your browser does not support the video tag.
              </CardMedia>
              <Box sx={{ width: "100%", marginTop: "40px" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example">
                    <Tab label="Tổng quan" {...a11yProps(0)} />
                    <Tab label=" Nội dung bài Học" {...a11yProps(1)} />
                  </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                  Tổng quan
                  <Typography
                    component="div"
                    sx={{
                      textAlign: "justify",
                      color: "#4E5566",
                      fontSize: "14px",
                      fontWeight: 400,
                      paddingTop: "20px",
                      maxWidth: "872px",
                    }}
                    dangerouslySetInnerHTML={{ __html: cleanDescription }}
                  />
                </CustomTabPanel>

                <CustomTabPanel value={value} index={1}>
                  Noi dung
                </CustomTabPanel>
              </Box>
            </Box>

            {/* Crad */}
            <Box>
              {" "}
              <Card sx={{ maxWidth: "424px" }}>
                <CardContent sx={{ textAlign: "justify" }}>
                  <Typography variant="h5" component="div">
                    {courseData.price !== 0 && <p> {courseData.price}</p>}
                  </Typography>
                  <Divider
                    sx={{
                      width: "100vw",
                      backgroundColor: "#F5F7FA",
                      margin: "24px 0",
                      marginLeft: "calc(-50vw + 50%)",
                    }}
                  />
                  {/* sdadđ */}
                  <Box
                    sx={{
                      fontSize: "14px ",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "22px",
                      letterSpacing: "-0.14px",
                      color: "#6E7485",
                    }}>
                    <Box
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px 0px",
                      }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#1D2026",
                          fontSize: "14px ",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "22px",
                          letterSpacing: "-0.14px",
                          display: "flex",
                          alignItems: "center",
                        }}>
                        <ListItemIcon
                          sx={{ minWidth: "12px", paddingRight: "12px" }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none">
                            <path
                              d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                              stroke="#A1A5B3"
                            />
                            <path d="M12 6.75V12H17.25" stroke="#A1A5B3" />
                          </svg>
                        </ListItemIcon>
                        Thời gian khóa học
                      </Typography>
                      <Typography variant="p">23 giờ</Typography>
                    </Box>
                    <Box
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px 0px",
                      }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#1D2026",
                          fontSize: "14px ",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "22px",
                          letterSpacing: "-0.14px",
                          display: "flex",
                          alignItems: "center",
                        }}>
                        <ListItemIcon
                          sx={{ minWidth: "12px", paddingRight: "12px" }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none">
                            <path
                              d="M8.25 15C10.9424 15 13.125 12.8174 13.125 10.125C13.125 7.43261 10.9424 5.25 8.25 5.25C5.55761 5.25 3.375 7.43261 3.375 10.125C3.375 12.8174 5.55761 15 8.25 15Z"
                              stroke="#A1A5B3"
                            />
                            <path
                              d="M14.5703 5.43161C15.2408 5.24269 15.9441 5.19966 16.6326 5.3054C17.3212 5.41114 17.9791 5.66321 18.562 6.04462C19.1449 6.42604 19.6393 6.92795 20.012 7.51654C20.3846 8.10513 20.6268 8.76673 20.7221 9.45679C20.8175 10.1469 20.764 10.8493 20.565 11.517C20.366 12.1846 20.0263 12.8018 19.5687 13.327C19.1111 13.8523 18.5463 14.2734 17.9123 14.562C17.2782 14.8506 16.5897 14.9999 15.8931 15"
                              stroke="#A1A5B3"
                            />
                            <path
                              d="M1.5 18.5059C2.26138 17.4229 3.27215 16.539 4.44698 15.9288C5.62182 15.3186 6.92623 15.0001 8.25008 15C9.57393 14.9999 10.8784 15.3184 12.0532 15.9285C13.2281 16.5386 14.239 17.4225 15.0004 18.5054"
                              stroke="#A1A5B3"
                            />
                            <path
                              d="M15.8926 15C17.2166 14.999 18.5213 15.3171 19.6962 15.9273C20.8712 16.5375 21.8819 17.4218 22.6426 18.5054"
                              stroke="#A1A5B3"
                            />
                          </svg>
                        </ListItemIcon>
                        Số học viên tham gia khóa học
                      </Typography>
                      <Typography variant="p">69,419,618</Typography>
                    </Box>
                    <Box
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "16px 0px",
                      }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#1D2026",
                          fontSize: "14px ",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "22px",
                          letterSpacing: "-0.14px",
                          display: "flex",
                          alignItems: "center",
                        }}>
                        <ListItemIcon
                          sx={{ minWidth: "12px", paddingRight: "12px" }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none">
                            <path d="M7.5 7.5H13.5" stroke="#A1A5B3" />
                            <path d="M7.5 10.5H13.5" stroke="#A1A5B3" />
                            <path
                              d="M16.5 0.75H1.5C1.08579 0.75 0.75 1.08579 0.75 1.5V16.5C0.75 16.9142 1.08579 17.25 1.5 17.25H16.5C16.9142 17.25 17.25 16.9142 17.25 16.5V1.5C17.25 1.08579 16.9142 0.75 16.5 0.75Z"
                              stroke="#A1A5B3"
                            />
                            <path d="M4.5 0.75V17.25" stroke="#A1A5B3" />
                          </svg>
                        </ListItemIcon>
                        Ngôn ngữ
                      </Typography>
                      <Typography variant="p">Vietnam</Typography>
                    </Box>
                    <Divider
                      sx={{
                        width: "100vw",
                        backgroundColor: "#F5F7FA",
                        margin: "24px 0",
                        marginLeft: "calc(-50vw + 50%)",
                      }}
                    />
                  </Box>
                  {/* Hiển thị nút nếu courseData.price khác 0 */}
                  {courseData.price !== 0 && !checkCourse && (
                    <ButtonCustomize
                      text={
                        isInCart ? "Chuyển đến giỏ hàng" : "Thêm vào giỏ hàng"
                      }
                      width="100%"
                      height="56px"
                      sx={{ marginBottom: "15px" }}
                      onClick={
                        isInCart
                          ? () => navigate("/checkoutCart")
                          : handleAddCart
                      }
                    />
                  )}
                  <>
                    <ButtonCustomize
                      text={
                        isEnrolled
                          ? "Chuyển đến khóa học"
                          : courseData.price > 0
                            ? "Mua khóa học"
                            : "Đăng Ký Ngay"
                      }
                      width="100%"
                      height="56px"
                      backgroundColor="#FFEEE8"
                      sx={{ marginBottom: "15px", color: "#FF6636" }}
                      onClick={handleRegisterClick}
                    />
                    <Modal
                      open={isModalOpen}
                      onClose={() => setIsModalOpen(false)}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description">
                      <Box
                        sx={{
                          padding: 2,
                          backgroundColor: "white",
                          margin: "auto",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          position: "absolute",
                          outline: "none",
                        }}>
                        <Typography
                          id="modal-modal-title"
                          variant="h6"
                          component="h2">
                          Xác nhận đăng ký
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          Bạn có chắc chắn muốn đăng ký khóa học này không?
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}>
                          <Button
                            onClick={handleConfirmEnroll}
                            sx={{ mt: 2, color: "#FFF" }}
                            variant="contained">
                            Xác nhận
                          </Button>
                          <Button
                            onClick={() => setIsModalOpen(false)}
                            sx={{ mt: 2 }}
                            variant="outlined">
                            Hủy
                          </Button>
                        </Box>
                      </Box>
                    </Modal>
                  </>
                  <ButtonCustomize
                    text={
                      isFavorited
                        ? "Xóa khỏi danh sách yêu thích "
                        : "Thêm vào danh sách yêu thích"
                    }
                    onClick={
                      isFavorited ? handleRemoveFavorite : handleAddFavorite
                    }
                    height="40px"
                    backgroundColor={isFavorited ? "#FF6636" : "#FFF"}
                    color={isFavorited ? "#FFF" : "#4E5566"}
                    fontSize="10px"
                    sx={{
                      marginBottom: "15px",
                      // color: "#4E5566",
                      border: "1px solid",
                      width: "213px",
                      "&:hover": {
                        backgroundColor: isFavorited ? "#FF4A24" : "#F0F0F0",
                        color: isFavorited ? "#FFF" : "#3C434A",
                        borderColor: isFavorited ? "#FF4A24" : "#3C434A",
                      },
                    }}
                  />
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#1D2026",
                        fontSize: "14px ",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "22px",
                        letterSpacing: "-0.14px",
                      }}>
                      Note:
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: "#8C94A3",
                        padding: "0 5px",
                      }}
                      variant="p">
                      Tất cả khóa học sẽ được hoàn tiền trong 30 ngày
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{ fontSize: "16px", fontWeight: 500 }}
                      component="div">
                      Khóa học này bao gồm
                    </Typography>
                    <List
                      sx={{
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#4E5566",
                      }}>
                      <ListItem sx={{ padding: "8px" }}>
                        <ListItemIcon
                          sx={{ minWidth: "12px", paddingRight: "12px" }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none">
                            <path
                              d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                              stroke="#FF6636"
                            />
                            <path d="M12 6.75V12H17.25" stroke="#FF6636" />
                          </svg>
                        </ListItemIcon>
                        <ListItemText primary="Sử dụng trọn đời" />
                      </ListItem>
                      <ListItem sx={{ padding: "8px" }}>
                        <ListItemIcon
                          sx={{ minWidth: "12px", paddingRight: "12px" }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none">
                            <path d="M12 2.25V4.5" stroke="#FF6636" />
                            <path d="M12 19.5V21.75" stroke="#FF6636" />
                            <path
                              d="M17.25 8.25C17.25 7.75754 17.153 7.26991 16.9645 6.81494C16.7761 6.35997 16.4999 5.94657 16.1517 5.59835C15.8034 5.25013 15.39 4.97391 14.9351 4.78545C14.4801 4.597 13.9925 4.5 13.5 4.5H10.125C9.13044 4.5 8.17661 4.89509 7.47335 5.59835C6.77009 6.30161 6.375 7.25544 6.375 8.25C6.375 9.24456 6.77009 10.1984 7.47335 10.9017C8.17661 11.6049 9.13044 12 10.125 12H14.25C15.2446 12 16.1984 12.3951 16.9017 13.0983C17.6049 13.8016 18 14.7554 18 15.75C18 16.7446 17.6049 17.6984 16.9017 18.4017C16.1984 19.1049 15.2446 19.5 14.25 19.5H9.75C8.75544 19.5 7.80161 19.1049 7.09835 18.4017C6.39509 17.6984 6 16.7446 6 15.75"
                              stroke="#FF6636"
                            />
                          </svg>
                        </ListItemIcon>
                        <ListItemText primary="Hoàn tiền trong 30 ngày" />
                      </ListItem>
                      <ListItem sx={{ padding: "8px" }}>
                        <ListItemIcon
                          sx={{ minWidth: "12px", paddingRight: "12px" }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none">
                            <path d="M10.5 10.5H16.5" stroke="#FF6636" />
                            <path d="M10.5 13.5H16.5" stroke="#FF6636" />
                            <path
                              d="M19.5 3.75H4.5C4.08579 3.75 3.75 4.08579 3.75 4.5V19.5C3.75 19.9142 4.08579 20.25 4.5 20.25H19.5C19.9142 20.25 20.25 19.9142 20.25 19.5V4.5C20.25 4.08579 19.9142 3.75 19.5 3.75Z"
                              stroke="#FF6636"
                            />
                            <path d="M7.5 3.75V20.25" stroke="#FF6636" />
                          </svg>
                        </ListItemIcon>
                        <ListItemText primary="Làm các bài kiểm tra" />
                      </ListItem>
                      <ListItem sx={{ padding: "8px" }}>
                        <ListItemIcon
                          sx={{ minWidth: "12px", paddingRight: "12px" }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none">
                            <path
                              d="M4.5 18L19.5 18C20.3284 18 21 17.3284 21 16.5V6C21 5.17157 20.3284 4.5 19.5 4.5L4.5 4.5C3.67157 4.5 3 5.17157 3 6V16.5C3 17.3284 3.67157 18 4.5 18Z"
                              stroke="#FF6636"
                            />
                            <path d="M15 21H9" stroke="#FF6636" />
                          </svg>
                        </ListItemIcon>
                        <ListItemText primary="Truy cập các thiết bị có kết nối mạng" />
                      </ListItem>
                      <ListItem sx={{ padding: "8px" }}>
                        <ListItemIcon
                          sx={{ minWidth: "12px", paddingRight: "12px" }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none">
                            <path
                              d="M3 16.5L12 21.75L21 16.5"
                              stroke="#FF6636"
                            />
                            <path d="M3 12L12 17.25L21 12" stroke="#FF6636" />
                            <path
                              d="M3 7.5L12 12.75L21 7.5L12 2.25L3 7.5Z"
                              stroke="#FF6636"
                            />
                          </svg>
                        </ListItemIcon>
                        <ListItemText primary="100% học trực tuyến" />
                      </ListItem>
                    </List>
                    <Divider />
                    <Typography variant="h6" component="div" sx={{ mt: 2 }}>
                      Chia sẻ:
                    </Typography>

                    <Button
                      sx={{
                        color: "gray",
                        backgroundColor: "#f0f0f0",
                        margin: "5px",
                        width: "150px",
                        height: "48px",
                        fontSize: "14px",
                        fontWeight: 500,

                        "& .MuiButton-startIcon": {
                          margin: 0,
                        },
                      }}
                      startIcon={<FileCopyIcon />}>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          fontSize: "14px",
                          fontWeight: 500,
                          padding: "5px",
                        }}>
                        Sao chép link
                      </Typography>
                    </Button>

                    {/* Facebook Button */}
                    <Button sx={buttonStyle} startIcon={<FacebookIcon />} />

                    {/* Twitter Button */}
                    <Button sx={buttonStyle} startIcon={<TwitterIcon />} />

                    {/* Email Button */}
                    <Button sx={buttonStyle} startIcon={<EmailIcon />} />

                    {/* WhatsApp Button */}
                    <Button sx={buttonStyle} startIcon={<WhatsAppIcon />} />
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
        <Divider
          sx={{
            width: "100vw",
            backgroundColor: "#F5F7FA",
            margin: "40px 0",
            marginLeft: "calc(-50vw + 50%)",
          }}
        />
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "40px",
              alignItems: "center",
            }}>
            <Typography
              variant="h4"
              sx={{ color: "#1D2026", fontSize: "40px", fontWeight: 600 }}>
              Các khóa học liên quan
            </Typography>

            <ButtonCustomize
              text="Xem Thêm"
              backgroundColor="#FFEEE8"
              sx={{ color: "#FF6636" }}
              navigateTo={`/course-list/${category}`}
            />
          </Box>
          {/* Top5 */}
          <Box sx={{ marginBottom: "50px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: "25px",
                flexWrap: "wrap",
              }}>
              {filteredData.map((item, i) => (
                <Box key={i} onClick={() => handleCardClick(item)}>
                  <CardCourse
                    title={item?.source?.title}
                    category={item?.topicName}
                    price={
                      item?.source?.price === 0
                        ? "Miễn phí"
                        : item?.source?.price
                    }
                    image={
                      item?.source?.thumbnail
                        ? item?.source?.thumbnail
                        : "https://bom.so/vV4j7x"
                    }
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CourseDetail;
