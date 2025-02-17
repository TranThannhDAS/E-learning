import {
  Assignment,
  ExpandLess,
  ExpandMore,
  PlayCircleOutline,
} from "@mui/icons-material";
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

const LessonContent = ({
  listChapterOfCourse,
  lessonsData,
  allExams,
  getLessonsOfCourse,
  lessonOfCourse,
}) => {
  const { id, title } = useParams();
  const [openChapters, setOpenChapters] = useState({});

  const handleToggleChapter = (chapter) => {
    setOpenChapters((prev) => ({ ...prev, [chapter]: !prev[chapter] }));
  };

  const findExamById = (examId) => {
    return allExams.find((exam) => exam.id === examId);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", marginBottom: "25px" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none">
            <path
              d="M2.5 16.25V5C2.5 4.83424 2.56585 4.67527 2.68306 4.55806C2.80027 4.44085 2.95924 4.375 3.125 4.375H7.29167C7.4269 4.375 7.55848 4.41886 7.66667 4.5L9.83333 6.125C9.94152 6.20614 10.0731 6.25 10.2083 6.25H15.625C15.7908 6.25 15.9497 6.31585 16.0669 6.43306C16.1842 6.55027 16.25 6.70924 16.25 6.875V8.75"
              stroke="#FF6636"
            />
            <path
              d="M2.5 16.25L4.84285 10.3929C4.88924 10.2769 4.96932 10.1775 5.07275 10.1075C5.17619 10.0374 5.29823 10 5.42315 10H9.18576C9.30916 10 9.42979 9.96348 9.53245 9.89503L11.0925 8.85497C11.1952 8.78652 11.3158 8.75 11.4392 8.75H17.8829C17.9819 8.75 18.0795 8.77353 18.1677 8.81866C18.2558 8.86379 18.332 8.92922 18.3899 9.00956C18.4478 9.0899 18.4858 9.18284 18.5007 9.28074C18.5156 9.37864 18.5071 9.47869 18.4758 9.57264L16.25 16.25H2.5Z"
              stroke="#FF6636"
            />
          </svg>
          <Typography
            sx={{
              color: "#4E5566",
              fontSize: "14px",
              fontWeight: 400,
              margin: "0px 5px",
              marginRight: "10px",
            }}
            component="p">
            {listChapterOfCourse?.length} Chương
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none">
            <path
              d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
              stroke="#564FFD"
            />
            <path d="M12.5 10L8.75 7.5V12.5L12.5 10Z" stroke="#564FFD" />
          </svg>

          <Typography
            sx={{
              color: "#4E5566",
              fontSize: "14px",
              fontWeight: 400,
              margin: "0px 5px",
              marginRight: "10px",
            }}
            component="p">
            {getLessonsOfCourse(lessonOfCourse)?.countLesson} Bài Học
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none">
            <path
              d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
              stroke="#FD8E1F"
            />
            <path d="M10 5.625V10H14.375" stroke="#FD8E1F" />
          </svg>
          <Typography
            sx={{
              color: "#4E5566",
              fontSize: "14px",
              fontWeight: 400,
              margin: "0px 5px",
            }}
            component="p">
            {getLessonsOfCourse(lessonOfCourse)?.hours}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ border: "1px solid #E9EAF0" }}>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ maxHeight: "500px", overflowY: "auto" }}>
            <List sx={{ padding: 0 }}>
              <Box sx={{ width: "100%" }}>
                <Box sx={{ overflowY: "auto" }}>
                  <List
                    sx={{
                      padding: 0,
                      backgroundColor: "#F5F7FA",
                    }}>
                    {listChapterOfCourse.map((chapter) => (
                      <React.Fragment key={chapter.id}>
                        <ListItem
                          sx={{
                            borderTop: "1px solid #E9EAF0",
                            height: "65px",
                          }}
                          button
                          onClick={() => handleToggleChapter(chapter.id)}>
                          <ListItemText
                            primary={`${chapter.title}: ${chapter.description}`}
                            primaryTypographyProps={{
                              sx: { fontWeight: 600, fontSize: "18px" },
                            }}
                          />
                          {openChapters[chapter.id] ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )}
                        </ListItem>
                        <Collapse
                          in={openChapters[chapter.id]}
                          timeout="auto"
                          unmountOnExit>
                          <List
                            sx={{ backgroundColor: "#FFF" }}
                            component="div"
                            disablePadding>
                            {lessonsData[chapter.id] &&
                              lessonsData[chapter.id].map((lessonGroup) =>
                                lessonGroup.lesson.map((lesson) => {
                                  return (
                                    <React.Fragment key={lesson.id}>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        }}>
                                        <Link
                                          to={`/watch-course/${title}/${id}/${lesson.title}?id-lesson=${lesson?.id}`}>
                                          <ListItem sx={{ pl: 4 }}>
                                            <ListItemIcon>
                                              <PlayCircleOutline
                                                color={"disabled"}
                                              />
                                            </ListItemIcon>
                                            <ListItemText
                                              primary={lesson.title}
                                            />
                                          </ListItem>
                                        </Link>
                                      </Box>
                                      {lesson.examID && (
                                        <Link
                                          to={`/watch-course/${title}/${id}/${lesson.examID}?id-exam=${lesson?.examID}`}>
                                          <ListItem sx={{ pl: 4 }}>
                                            <ListItemIcon>
                                              <Assignment color="action" />
                                            </ListItemIcon>
                                            <ListItemText
                                              primary={
                                                findExamById(lesson.examID)
                                                  ?.title || "Exam"
                                              }
                                            />
                                          </ListItem>
                                        </Link>
                                      )}
                                    </React.Fragment>
                                  );
                                })
                              )}
                          </List>
                        </Collapse>
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              </Box>
            </List>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LessonContent;
