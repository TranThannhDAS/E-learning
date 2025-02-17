import { useEffect, useState } from "react";
import { Box, Grid, Typography, Pagination } from "@mui/material";
import { useParams } from "react-router-dom";

import CardCourse from "@eproject4/components/CardCourse.jsx";
import FilterPanel from "@eproject4/components/FilterPanel";
import { getCoursesPagination } from "@eproject4/services/courses.service";
import { getAllTopics } from "@eproject4/services/topic.service";
import { getSubTopics } from "@eproject4/services/subTopic.service";

const Category = () => {
  // Các hàm lấy dữ liệu từ API
  const { getCoursesPaginationAction } = getCoursesPagination();
  const { getAllTopicsAction } = getAllTopics();
  const { getSubTopicsAction } = getSubTopics();

  // Lấy topicName từ URL params
  const { topicName } = useParams();

  // Khai báo các state
  const [allCourses, setAllCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [newItems, setNewItems] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(8);
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // Hàm loại bỏ các phần tử trùng lặp trong mảng
  const removeDuplicate = (arr) => {
    return Array.from(new Set(arr));
  };

  // Tạo mảng chứa các chủ đề từ newItems
  const courseTopics = [];
  newItems.forEach((course) => {
    courseTopics.push(course?.topics);
  });

  // Loại bỏ các chủ đề trùng lặp và sắp xếp
  const topics = removeDuplicate(courseTopics);

  // Sắp xếp các khóa học theo số lượng view và lấy top 5
  const ViewStudent = filteredData.sort((a, b) => b.views - a.views);
  const TopCourse = ViewStudent.slice(0, 5);

  // Lấy dữ liệu khóa học, chủ đề và chuyên mục khi component được render
  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        let allData = [];
        let totalPages = 1;
        for (let i = 1; i <= totalPages; i++) {
          const res = await getCoursesPaginationAction(i, 100);
          allData = [...allData, ...res.data.items];
          totalPages = Math.ceil(res.data.totalCount / 100);
        }
        setAllCourses(allData);
      } catch (err) {
        throw new Error(err);
      }
    };

    const fetchTopicData = async () => {
      try {
        const res = await getAllTopicsAction();
        setCategories(res?.data?.items || []);
      } catch (err) {
        throw new Error(err);
      }
    };

    const fetchSubTopicData = async () => {
      try {
        const res = await getSubTopicsAction();
        setSubcategories(res?.data || []);
      } catch (err) {
        throw new Error(err);
      }
    };

    fetchTopicData();
    fetchSubTopicData();
    fetchCoursesData();
  }, []);

  // Lọc các khóa học theo chủ đề khi topicName hoặc newItems thay đổi
  useEffect(() => {
    const filtered = newItems.filter((course) => course.topics === topicName);
    setFilteredData(filtered);
  }, [topicName, newItems]);

  // Kết hợp dữ liệu subtopics với các khóa học
  const joinSubtopicToCourses = (courses, subCategories) => {
    return courses.map((course) => {
      const subTopics = subCategories.find(
        (subCategory) => subCategory.id === course?.source?.subTopicId
      );
      return {
        ...course,
        subTopics: subTopics ? subTopics?.subTopicName : "Unknown",
      };
    });
  };

  // Kết hợp dữ liệu topics với các khóa học
  const joinTopicToCourses = (courses, categories) => {
    return courses.map((course) => {
      const topics = categories.find(
        (category) => category.id === course?.topicId
      );
      return {
        ...course,
        topics: topics ? topics?.topicName : "Unknown",
      };
    });
  };

  // Kết hợp dữ liệu các khóa học, chủ đề và chuyên mục khi tất cả dữ liệu đã được lấy
  useEffect(() => {
    if (allCourses.length && categories.length && subcategories.length) {
      const combinedData = joinTopicToCourses(
        joinSubtopicToCourses(allCourses, subcategories),
        categories
      );
      setNewItems(combinedData);
    }
  }, [allCourses, categories, subcategories]);

  // Xử lý khi nhấn vào nút filter
  const handleClickFilter = () => {
    setIsShowFilter(!isShowFilter);
  };

  // Xử lý khi thay đổi trang pagination
  const handleChangePagination = (e, newPage) => {
    setPageIndex(newPage);
  };

  // Xử lý kết quả tìm kiếm
  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  // Xác định dữ liệu hiển thị (tìm kiếm hoặc dữ liệu đã lọc)
  const displayData = searchResults.length > 0 ? searchResults : filteredData;
  const paginatedData = displayData
    .slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
    .filter((item) => item.source.status === 1);

  return (
    <Box sx={{ maxWidth: "1320px", margin: "auto", paddingBottom: "50px" }}>
      <Box>
        {/* Top 5 Courses */}
        <Box
          sx={{
            width: "100vw",
            backgroundColor: "#F5F7FA",
            padding: "40px 0",
            marginLeft: "calc(-50vw + 50%)",
          }}>
          <Typography
            variant="h4"
            sx={{ textAlign: "center", marginBottom: "30px", fontWeight: 500 }}>
            Khóa Học Bán Chạy Trong {topicName}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "25px",
              flexWrap: "wrap",
              padding: "0 10px",
            }}>
            {TopCourse.map((item, i) => (
              <Box key={i}>
                <CardCourse
                  path={`/course-detail/${item?.topics}/${encodeURIComponent(item?.source?.title)}/${item?.source.id}`}
                  title={item?.source?.title}
                  category={item?.topics}
                  price={
                    item?.source?.price === 0 ? "Miễn phí" : item?.source?.price
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
        {/* Filter Panel */}
        <div>
          <FilterPanel
            isShowFilter={isShowFilter}
            topics={topics}
            handleClickFilter2={handleClickFilter}
            handleSearchResults={handleSearchResults}
          />
        </div>
        {/* All Courses List */}
        <Box sx={{ marginTop: "40px", textAlign: "center" }}>
          <Box
            sx={{
              display: "flex",
              gap: "25px",
              flexWrap: "wrap",
            }}>
            {paginatedData.map((item, i) => (
              <Grid xs={12} sm={6} md={3} lg={3} key={i}>
                <CardCourse
                  path={`/course-detail/${item?.topics}/${encodeURIComponent(item?.source?.title)}/${item?.source.id}`}
                  title={item?.source?.title}
                  category={item?.topics}
                  price={
                    item?.source?.price === 0 ? "Miễn phí" : item?.source?.price
                  }
                  image={
                    item?.source?.thumbnail
                      ? item?.source?.thumbnail
                      : "https://bom.so/vV4j7x"
                  }
                />
              </Grid>
            ))}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center", // Căn giữa Pagination
              marginTop: "25px",
            }}>
            <Pagination
              count={Math.ceil(displayData.length / pageSize)}
              onChange={handleChangePagination}
              page={pageIndex}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Category;
