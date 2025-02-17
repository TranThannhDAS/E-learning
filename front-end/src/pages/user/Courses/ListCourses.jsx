import { useState, useEffect } from "react";
import { Box, Grid, Pagination } from "@mui/material";
import { useParams } from "react-router-dom";
import CardCourse from "@eproject4/components/CardCourse.jsx";
import "swiper/css";
import "swiper/css/navigation";

import FilterPanel from "@eproject4/components/FilterPanel";
import { getCoursesPagination } from "@eproject4/services/courses.service";
import { getAllTopics } from "@eproject4/services/topic.service";
import { getSubTopics } from "@eproject4/services/subTopic.service";

const ListCourses = () => {
  const { topicName } = useParams();
  const { getCoursesPaginationAction } = getCoursesPagination();
  const { getAllTopicsAction } = getAllTopics();
  const { getSubTopicsAction } = getSubTopics();
  const courseTopics = [];

  const [isShowFilter, setIsShowFilter] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(4);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [newItems, setNewItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const removeDuplicate = (arr) => {
    return Array.from(new Set(arr));
  };

  newItems.forEach((course) => {
    courseTopics.push(course?.topics);
  });

  const topics = removeDuplicate(courseTopics);

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
        console.error(err);
      }
    };

    const fetchTopicData = async () => {
      try {
        const res = await getAllTopicsAction();
        setCategories(res?.data?.items || []);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchSubTopicData = async () => {
      try {
        const res = await getSubTopicsAction();
        setSubcategories(res?.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTopicData();
    fetchSubTopicData();
    fetchCoursesData();
  }, []);

  useEffect(() => {
    if (allCourses.length && categories.length && subcategories.length) {
      const combinedData = joinTopicToCourses(
        joinSubtopicToCourses(allCourses, subcategories),
        categories
      );
      setNewItems(combinedData);
    }
  }, [allCourses, categories, subcategories]);

  useEffect(() => {
    const filtered = newItems.filter((course) => course.topics === topicName);
    setFilteredData(filtered);
  }, [topicName, newItems]);

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

  const handleClickFilter = () => {
    setIsShowFilter(!isShowFilter);
  };

  const handleChangePagination = (e, newPage) => {
    setPageIndex(newPage);
  };
  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const displayData = searchResults.length > 0 ? searchResults : filteredData;
  const paginatedData = displayData
    .slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
    .filter((item) => item.source.status === 1);

  return (
    <Box sx={{ maxWidth: "1320px", margin: "auto" }}>
      <Box>
        <div>
          <FilterPanel
            isShowFilter={isShowFilter}
            topics={topics}
            handleClickFilter={handleClickFilter}
            handleSearchResults={handleSearchResults}
          />
        </div>
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

export default ListCourses;
