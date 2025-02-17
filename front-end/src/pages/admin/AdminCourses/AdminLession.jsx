import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import CreateChapter from "./AdminChapter/CreateChapter";
import { getChapterBySourceId } from "@eproject4/services/chapter.service";
import ListChapter from "./AdminChapter/ListChapter";

function AdminLession() {
  const [openChapterModal, setOpenChapterModal] = useState(false);
  const handleChapterModalOpen = () => setOpenChapterModal(true);
  const handleChapterModalClose = () => setOpenChapterModal(false);
  const { getChapterBySourceIdAction } = getChapterBySourceId();
  const [chapterOfCourse, setChapterOfCourse] = useState([]);

  // Get chapter of course
  const getChapterOfCourse = async (idSource) => {
    const res = await getChapterBySourceIdAction(idSource);
    setChapterOfCourse(res?.data);
    return res?.data;
  };

  return (
    <Box
      sx={{
        width: "80%",
        marginX: "auto",
        backgroundColor: "#FFF",
        height: "auto",
        padding: "20px",
      }}>
      <Typography sx={{ fontSize: "24px", fontWeight: 600 }}>
        Bài giảng
      </Typography>
      <Box>
        <ListChapter
          listChapters={chapterOfCourse}
          getChapterOfCourse={getChapterOfCourse}
        />
        <Button
          onClick={handleChapterModalOpen}
          sx={{
            borderRadius: 0,
            boxShadow: "none",
            backgroundColor: "#FFEEE8",
            marginTop: "20px",
            color: "#FF6636",
            "&:hover": {
              backgroundColor: "#FFEEE8",
            },
            fontSize: "16px",
            padding: "10px 24px",
            width: "100%",
          }}>
          Thêm chương
        </Button>

        <CreateChapter
          openChapterModal={openChapterModal}
          handleChapterModalClose={handleChapterModalClose}
          getChapterOfCourse={getChapterOfCourse}
          chapterOfCourse={chapterOfCourse}
        />
      </Box>
    </Box>
  );
}

export default AdminLession;
