import { updateViewOfLesson } from "@eproject4/services/lession.service";
import { Box, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import PersonIcon from "@mui/icons-material/Person";

function LessonDetail({ lessonDetail, fetchDataLessonById }) {
  const [viewCount, setViewCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const { updateViewOfLessonAction } = updateViewOfLesson();
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);

  const handlePlay = () => {
    if (!hasStarted) {
      setViewCount((prevCount) => prevCount + 1);
      setHasStarted(true);
    }
  };

  const handleEnded = async () => {
    setHasStarted(false);
    if (isLessonCompleted == false) {
      setIsLessonCompleted(true);
    }
    fetchDataLessonById();
  };

  useEffect(() => {
    const updateViewCount = async () => {
      await updateViewOfLessonAction(lessonDetail?.lesson?.id);
    };

    if (hasStarted && viewCount > 0) {
      updateViewCount();
    }

    fetchDataLessonById();
  }, [viewCount, lessonDetail?.lesson?.id, hasStarted]);

  return (
    <Box sx={{ paddingBottom: "60px" }}>
      <Box sx={{}}>
        <Box>
          <ReactPlayer
            url={lessonDetail?.lesson?.video}
            className="react-player"
            controls
            width="100%"
            height="100%"
            onPlay={handlePlay}
            onEnded={handleEnded}
          />

          <Box>
            <Typography
              component={"h2"}
              sx={{
                fontSize: "25px",
                fontWeight: 600,
                padding: "10px 0px",
                marginTop: "17px",
              }}>
              {lessonDetail?.lesson?.title}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ fontWeight: 500 }}>
                {lessonDetail?.lesson?.view}
              </Typography>
              <PersonIcon sx={{ color: "#6E7485" }} />
            </Box>
          </Box>
          <Divider sx={{ marginTop: "20px", marginBottom: "15px" }} />
          <Box>
            <Typography
              sx={{ fontSize: "25px", fontWeight: 600, marginBottom: "10px" }}>
              Mô tả
            </Typography>
            <div
              dangerouslySetInnerHTML={{
                __html: lessonDetail?.lesson?.description,
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default LessonDetail;
