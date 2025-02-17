import { Grid, Box, Typography, Card, Button, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import CardCourse from "@eproject4/components/CardCourse";
import seedData from "@eproject4/utils/seedData";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Happy from "@eproject4/assets/images/happy.png";
import { useEffect, useState } from "react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import { debounce } from "lodash";
import "@eproject4/styles/styles.css";
import ButtonCustomize from "@eproject4/components/ButtonCustomize";
import CourseGrid from "@eproject4/components/CourseGrid";
import { searchFullText } from "@eproject4/services/search.service";
import "./index.css";
import { getAllCourses } from "@eproject4/services/courses.service";
function Home() {
  const navigate = useNavigate();
  const { getDataHome } = getAllCourses();
  const [Allcourses, setAllCourses] = useState([]);
  const [courses, setcourses] = useState([]);
  const [couresFive, setcouresFive] = useState([]);

  // const courses = Allcourses.slice(0, 10);
  // const couresFive = Allcourses.slice(0, 5);
  const [search, setSearch] = useState(""); // State lưu giá trị từ ô search
  const { searchDebounceAction } = searchFullText();
  const [dataToShow, setDataToShow] = useState([]);

  const handleCourseClick = (category, title, id) => {
    const formattedTitle = title.replace(/\s+/g, "-").toLowerCase();
    navigate(`/course-detail/${category}/${formattedTitle}/${id}`);
  };
  const handleChangesearch = (e) => {
    console.log(e.target.value + "test");
    if (e.target.value === "") {
      setSearch(" ");
    } else {
      setSearch(e.target.value);
    }
  };
  const debouncedSearch = debounce((searchTerm) => {
    searchDebounceAction(searchTerm).then((res) => {
      console.log(res.data);
      setDataToShow(res.data);
    });
  }, 500);

  useEffect(() => {
    if (search) {
      debouncedSearch(search);
    }
  }, [search]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDataHome();
        setAllCourses(res?.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    setcourses(Allcourses?.slice(0, 10));
    setcouresFive(Allcourses?.slice(0, 5));
  }, [Allcourses]);

  const handleViewAllClick = () => {
    // Xử lý logic khi nút "Xem tất cả" được click
    navigate("/khoa-hoc");
    // Ví dụ: có thể navigate tới trang khác, gọi API, thay đổi state, etc.
  };
  const sections = [
    {
      title: "Top khóa học bán chạy",
      courses: courses,
    },
    {
      title: "Khóa học đề xuất",
      courses: couresFive,
    },
  ];
  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
      }}>
      <>
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          className="mySwiper">
          {courses?.map((course, index) => (
            <SwiperSlide key={index}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  height: 300, // Adjust height as needed
                  background:
                    "linear-gradient(180deg, rgba(240, 242, 245, 0.00) 0.02%, #F0F2F5 220.8%)",
                }}>
                <Box
                  sx={{
                    width: "50%",
                    p: 3,
                    display: "flex",
                    justifyContent: "center",
                  }}>
                  <Box sx={{ textAlign: "justify" }}>
                    <Typography
                      variant="h4"
                      sx={{
                        color: "#1D2026",
                        fontSize: { md: "72px", sx: "22px" },
                        fontWeight: 600,
                      }}>
                      {course.topic}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: { md: "24px", sx: "14px" },
                        fontWeight: 400,
                        color: "#4E5566",
                        margin: "40px 0px",
                      }}
                      variant="subtitle1">
                      {course.title}
                    </Typography>
                    <ButtonCustomize text="Tạo tài khoản" />
                  </Box>
                </Box>
                <Box sx={{ width: "50%" }}>
                  <img
                    src={course.imageThumbnail}
                    alt="Banner"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
      <Box>
        {/* Search */}
        <Box className="text-center pt-[30px] relative flex justify-center CustomeBox">
          {" "}
          <div className="relative w-[513px]">
            <input
              type="search"
              name="search"
              placeholder="Search"
              className="border-1 border-gray-800 bg-[#EBEBEB] p-2 pl-10 rounded-[20px] mt-[35px] focus:outline-none w-full h-[54px]"
              onChange={handleChangesearch}
            />
            <SearchIcon className="absolute left-3 top-[70%] transform -translate-y-1/2 text-gray-600" />
          </div>
          <div>
            {dataToShow && dataToShow.length > 0 && (
              <div className="results">
                {dataToShow.map((item) =>
                  item.subTopic.map((sub) =>
                    sub.sources.map((source) => (
                      <div
                        key={source.id}
                        className="result-item"
                        onClick={() =>
                          handleCourseClick(
                            item.topicName,
                            source.title.input[0],
                            source.id
                          )
                        }
                        style={{ cursor: "pointer" }}>
                        <img
                          src={source.thumbnail}
                          alt={source.title.input[0]}
                          className="thumbnail"
                        />
                        <span className="title">{source.title.input[0]}</span>
                        <span className="price">
                          {source.price === 0 ? "Miễn phí" : `$${source.price}`}
                        </span>
                      </div>
                    ))
                  )
                )}
              </div>
            )}
          </div>
        </Box>
        {/* Danh Muc */}
        <Box className="text-center pt-[30px] ">
          <Typography
            sx={{ "font-size": "40px" }}
            variant="h6"
            className="text-black font-roboto text-xl font-medium leading-none mb-[34px] ">
            Danh mục khóa học
          </Typography>
          <Box
            sx={{
              width: "100%",
              overflow: "hidden",
              textAlign: "center",
              marginTop: "34px",
            }}>
            <Swiper
              spaceBetween={23} // Khoảng cách giữa các slides là 23px
              slidesPerView={4} // Hiển thị 4 items mỗi dòng
              loop={true}
              pagination={{ clickable: true }}
              navigation={true}
              modules={[Navigation]}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                1200: {
                  slidesPerView: 5,
                  spaceBetween: 30,
                },
              }}
              className="mySwiper w-[90%]">
              {courses?.map((course) => (
                <SwiperSlide
                  key={course.id}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <Card
                    sx={{
                      width: 312, // Chiều rộng mỗi card
                      height: 104, // Chiều cao mỗi card
                      border: "1px solid #9C9C9C",
                      bgcolor: "#FFF",
                      margin: "auto", // Đảm bảo card được căn giữa trong slide
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <Box>
                      <Typography
                        variant="h2"
                        sx={{
                          color: "#363636",
                          fontFamily: "Roboto",
                          fontSize: "25px",
                          fontStyle: "normal",
                          fontWeight: 500,
                          lineHeight: "30px",
                        }}>
                        {course.topic}
                      </Typography>
                      <Typography
                        variant="h1"
                        sx={{
                          width: "100%",
                          color: "#696969",
                          textAlign: "center",
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "22px", // Tương đương với 157.143% fontSize
                          letterSpacing: "-0.14px",
                        }}>
                        {course.views}
                      </Typography>
                    </Box>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Box>

        {/* đâsdsadas*/}
        <Box sx={{ marginTop: "50px" }}>
          {sections.map((section, index) => (
            <CourseGrid
              key={index}
              title={section.title}
              courses={section.courses}
              index={index}
              showViewAllButton={section?.courses?.length == 5}
              onViewAll={handleViewAllClick}
            />
          ))}
        </Box>

        {/* Learn From Everywhere */}
        <Box sx={{ backgroundColor: "#F5F7FA", marginTop: "34px" }}>
          <Box
            sx={{
              overflow: "hidden",
              borderRadius: 2,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "34px",
              maxWidth: "1320px",
              margin: "auto",
            }}>
            <Box
              component="img"
              src={Happy}
              sx={{
                width: { xs: "100%", md: "618px" },
                height: "412px",
                objectFit: "cover",
                padding: "80px",
              }}
              alt="Learn from everywhere"
            />
            <Box
              sx={{
                padding: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: { xs: "center", md: "flex-start" },
                width: { xs: "100%", md: "50%" },
              }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600 }}
                component="h2"
                gutterBottom>
                Learn From Everywhere
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Với E-Learning bạn có thể học ở mọi nơi và bất kì nào. Chỉ cần
                một thiết bị kết nối được với mạng, bạn có thể thỏa sức học tập.
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item>
                  <Typography variant="h5" component="div">
                    500+
                  </Typography>
                  <Typography variant="subtitle1">Enrolls</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h5" component="div">
                    10+
                  </Typography>
                  <Typography variant="subtitle1">Courses</Typography>
                </Grid>
              </Grid>
              <ButtonCustomize text="Hãy cùng học tập" width="158px" />
            </Box>
          </Box>
        </Box>
        {/* Email Send */}
        <Grid
          container
          spacing={2}
          sx={{
            p: 3,
            mt: { xs: 2, md: "34px" },
            maxWidth: "1320px",
            margin: "auto",
          }}>
          {/* Left column */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", alignItems: "flex-start" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: { xs: "center", md: "flex-start" },
                width: "100%", // Ensure the box takes full width of the grid item
              }}>
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{
                  pb: "25px",
                  color: "#000",
                  fontFamily: "Roboto",
                  fontSize: { xs: "28px", md: "36px" }, // Responsive font size
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: { xs: "20px", md: "44px" }, // Responsive line height
                }}>
                Liên hệ với chúng tôi
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  color: "#7A7A7A",
                  fontFamily: "Roboto",
                  fontSize: { xs: "14px", md: "16px" }, // Smaller on xs for better readability
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "25px",
                  width: "100%", // Full width on small devices
                  height: "auto", // Auto height for better text fitting
                }}>
                Chúng tôi luôn sẵn lòng giúp đỡ bạn 24/7. Luôn <br /> sẵn lòng
                cung cấp đầy đủ dịch vụ đến với bạn
              </Typography>
            </Box>
          </Grid>

          {/* Right column */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", alignItems: "flex-start" }}>
            <Box
              sx={{
                width: "100%", // Ensure the box takes full width of the grid item
              }}>
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{
                  pb: "25px",
                  color: "#000",
                  fontFamily: "Roboto",
                  fontSize: { xs: "20px", md: "25px" }, // Responsive font size
                  fontWeight: 600,
                  lineHeight: "16px", // Consistent line height
                }}>
                Email
              </Typography>
              <Box
                component="form"
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "baseline",
                  pt: "5px",
                }}
                noValidate
                autoComplete="off">
                <TextField
                  label="Email"
                  variant="outlined"
                  placeholder="Email..."
                  sx={{
                    width: { xs: "100%", md: "523px" }, // Make width responsive
                    height: "65px",
                    mb: { xs: 2, sm: 0 }, // Margin bottom on xs
                    borderRadius: "10px",
                  }}
                  required
                />
                <Box sx={{ paddingLeft: { xs: "0px", md: "27px" } }}>
                  <ButtonCustomize text="Liên hệ" width="128px" />
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Home;
