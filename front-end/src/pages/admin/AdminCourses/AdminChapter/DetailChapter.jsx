import { useSortable } from "@dnd-kit/sortable";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import AddIcon from "@mui/icons-material/Add";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import CreateLessionExam from "./CreateLessionExam";
import { getAllLessionsByChapterId } from "@eproject4/services/lession.service";
import LessionDetail from "./LessionDetail";
import { getAllExam } from "@eproject4/services/exam.service";

const useStyles = makeStyles(() => ({
  content: {
    justifyContent: "space-between",
  },
}));

function DetailChapter({
  id,
  chapter,
  index,
  handleUpdateTitleAndDescription,
  handleDeleteChapter,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const handleOpen = () => setOpenCreateModal(true);
  const handleClose = () => setOpenCreateModal(false);
  const { getAllLessionsByChapterIdAction } = getAllLessionsByChapterId();
  const [lessionsOfChapter, setLessionsOfChapter] = useState([]);
  const { getAllExamAction } = getAllExam();
  const [exams, setExams] = useState([]);

  const fetchDataAllExam = async () => {
    const res = await getAllExamAction();

    setExams(
      res?.data?.filter((item) => {
        return item.chapterId === chapter?.id;
      })
    );
  };

  useEffect(() => {
    fetchDataAllExam();
  }, []);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: "15px",
  };

  const fetchDataAllLessonsOfChapter = async () => {
    try {
      const res = await getAllLessionsByChapterIdAction(chapter?.id);
      setLessionsOfChapter(res?.data);
    } catch (err) {
      throw new Error(err);
    }
  };

  useEffect(() => {
    fetchDataAllLessonsOfChapter();
  }, []);

  const classes = useStyles();
  return (
    <Box ref={setNodeRef} style={style} {...attributes}>
      <Box key={index} sx={{ marginBottom: "15px" }}>
        <Accordion sx={{ boxShadow: "none", backgroundColor: "#F5F7FA" }}>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
            sx={{
              display: "flex",
            }}
            classes={{
              content: classes.content,
            }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                {...listeners}
                onMouseDown={(e) => e.stopPropagation()}>
                <DragIndicatorIcon />
              </IconButton>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 500,
                  marginRight: "10px",
                }}>
                {chapter?.title}:
              </Typography>
              <Typography
                sx={{ fontSize: "16px", fontWeight: 400 }}
                component="span">
                {chapter?.description}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpen();
                }}>
                <AddIcon />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateTitleAndDescription(chapter, e);
                }}>
                <BorderColorIcon />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChapter(chapter?.index, e, chapter?.id);
                }}>
                <DeleteOutlineIcon />
              </IconButton>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <LessionDetail
              fetchDataAllLessonsOfChapter={fetchDataAllLessonsOfChapter}
              chapter={chapter}
              lessionsOfChapter={lessionsOfChapter}
              exams={exams}
              fetchDataAllExam={fetchDataAllExam}
            />
          </AccordionDetails>
        </Accordion>
      </Box>
      <CreateLessionExam
        fetchDataAllLessonsOfChapter={fetchDataAllLessonsOfChapter}
        handleClose={handleClose}
        openCreateModal={openCreateModal}
        chapter={chapter}
        lessionsOfChapter={lessionsOfChapter}
        fetchDataAllExam={fetchDataAllExam}
      />
    </Box>
  );
}

export default DetailChapter;
