import { Grid, Box, Typography } from "@mui/material";
import CardCourse from "@eproject4/components/CardCourse";
import ButtonCustomize from "./ButtonCustomize";
const CourseGrid = ({
  title,
  courses,
  onViewAll,
  index,
  showViewAllButton,
}) => (
  <Box
    sx={{
      backgroundColor: index % 2 === 0 ? "#F5F7FA" : "white",
      //   margin: "40px auto",
      width: "100%",
    }}>
    <Box sx={{ maxWidth: "1320px", margin: "auto" }}>
      <Typography
        sx={{ pt: "30px", mb: "34px", fontSize: "40px" }}
        variant="h6"
        className="text-black  text-[40px] font-medium leading-none text-center">
        {title}
      </Typography>
      <Grid container spacing={2} textAlign="center" sx={{ px: 2, py: 3 }} >
        {courses?.map((course) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={course.id}>
            <CardCourse
              key={course.id}
              id={course.id}
              path={`/course/${course.id}`}
              category={course.topic}
              price={`$${course.price}`}
              title={course.title}
              rating={course.rating}
              students={course.views}
              image={course.imageThumbnail}
            />
          </Grid>
        ))}
      </Grid>
      {showViewAllButton && (
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <ButtonCustomize text="Xem tất cả" onClick={onViewAll} />
        </Box>
      )}
    </Box>
  </Box>
);
export default CourseGrid;
