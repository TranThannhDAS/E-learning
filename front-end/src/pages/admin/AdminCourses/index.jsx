import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import { getCoursesPagination } from "@eproject4/services/courses.service";
import { useEffect, useState } from "react";
import CardCourse from "@eproject4/components/CardCourse";
import { getAllTopics } from "@eproject4/services/topic.service";
import { getSubTopics } from "@eproject4/services/subTopic.service";

function AdminCourses() {
  const { getAllTopicsAction } = getAllTopics();
  const { getSubTopicsAction } = getSubTopics();
  const { getCoursesPaginationAction } = getCoursesPagination();
  const [dataCourses, setDataCourses] = useState();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(4);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  // get courses
  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        const res = await getCoursesPaginationAction(pageIndex, pageSize);
        setDataCourses(res?.data);
      } catch (err) {
        throw new Error(err);
      }
    };
    const fetchTopicData = async () => {
      const res = await getAllTopicsAction();
      setCategories(res?.data?.items);
    };

    const fetchSubTopicData = async () => {
      const res = await getSubTopicsAction();
      setSubcategories(res?.data);
    };

    fetchTopicData();
    fetchSubTopicData();
    fetchCoursesData();
  }, [pageIndex, pageSize]);

  // Join subtopic, topics and courses
  const joinSubtopicToCourses = (courses, subCategories) => {
    return courses?.map((course) => {
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
    return courses?.map((course) => {
      const topics = categories.find(
        (category) => category.id === course?.topicId
      );
      return {
        ...course,
        topics: topics ? topics?.topicName : "Unknown",
      };
    });
  };
  const newItems = joinTopicToCourses(
    joinSubtopicToCourses(dataCourses?.items, subcategories),
    categories
  );

  // handleChangePagination
  const handleChangePagination = (e, newPage) => {
    setPageIndex(newPage);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          maxWidth: {
            xs: "320px",
            sm: "540px",
            md: "650px",
            lg: "900px",
            xl: "1320px",
          },
          margin: "auto",
        }}>
        {newItems?.map((item, i) => {
          return (
            <div key={i} className="mr-[24px]">
              <CardCourse
                title={item?.source?.title}
                category={item?.topics}
                price={
                  item?.source?.price == 0 ? "Miễn phí" : item?.source?.price
                }
                image={
                  item?.source?.thumbnail
                    ? item?.source?.thumbnail
                    : "https://bom.so/vV4j7x"
                }
                path={`/admin/khoa-hoc/${item.source.slug}?id=${item.source.id}`}
              />
            </div>
          );
        })}
      </Box>
      <Pagination
        count={Math.ceil(Number(dataCourses?.totalCount) / Number(pageSize))}
        sx={{ width: "100%", marginX: "auto", marginTop: "25px" }}
        onChange={handleChangePagination}
        page={pageIndex}
      />
    </Box>
  );
}

export default AdminCourses;
