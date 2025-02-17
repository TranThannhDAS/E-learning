/* eslint-disable no-lonely-if */
// LessionDetail.jsx
import { Box, Button, IconButton, Typography } from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  deleteLesson,
  getLessonById,
  updateLesson,
} from "@eproject4/services/lession.service";
import { useEffect, useState } from "react";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { deleteExam, getExamById } from "@eproject4/services/exam.service";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import UpdateExam from "../AdminExam/UpdateExam";
import useCustomSnackbar from "@eproject4/utils/hooks/useCustomSnackbar";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { CSS } from "@dnd-kit/utilities";
import axios from "axios";
import UpdateLesson from "./UpdateLesson";

function LessionDetail({
  fetchDataAllLessonsOfChapter,
  chapter,
  lessionsOfChapter,
  exams,
  fetchDataAllExam,
}) {
  const [listLessonOfChapter, setListLessonOfChapter] =
    useState(lessionsOfChapter);
  const { deleteLessonAction } = deleteLesson();
  const [mergeList, setMergeList] = useState([]);
  const { deleteExamAction } = deleteExam();
  const [openUpdateExamModal, setOpenUpdateExamModal] = useState(false);
  const [openUpdateLessonModal, setOpenUpdateLessonModal] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const { getLessonByIdAction } = getLessonById();
  const [lessonDetail, setLessonDetail] = useState({});

  const handleUpdateExamModalOpen = (id) => {
    setSelectedExamId(id);
    setOpenUpdateExamModal(true);
  };
  const handleUpdateExamModalClose = () => {
    setOpenUpdateExamModal(false);
    setSelectedExamId(null);
  };

  const handleUpdateLessonModalOpen = (id) => {
    setOpenUpdateLessonModal(true);
    setSelectedLessonId(id);
  };
  const handleUpdateLessonModalClose = () => {
    setOpenUpdateLessonModal(false);
    setSelectedLessonId(null);
  };

  const { showSnackbar } = useCustomSnackbar();
  const [isDragged, setIsDragged] = useState(false);
  const { updateLessonAction } = updateLesson();

  const { getExamByIdAction } = getExamById();
  const [examDetail, setExamDetail] = useState({});

  const handleDeleteLession = async (id, timeLimit, lession) => {
    if (timeLimit) {
      await deleteExamAction(id);
      fetchDataAllLessonsOfChapter();
      fetchDataAllExam();
    } else {
      if (!lession?.examID) {
        updateIndexesOnDelete(lession?.index);
        await deleteLessonAction(Number(id));

        try {
          await Promise.all(
            listLessonOfChapter?.map(async (lesson) => {
              await axios.put("http://localhost:5187/api/Lesson/UpdateLesson", {
                id: lesson?.id,
                title: lesson?.title,
                author: lesson?.author,
                description: lesson?.description,
                videoDuration: lesson?.videoDuration,
                view: Number(lesson?.view),
                status: false,
                chapterId: Number(chapter?.id),
                serialDto: {
                  index: Number(lesson?.index),
                  exam_ID: lesson?.examID,
                },
              });
            }),
            showSnackbar("Cập nhật thứ tự bài giảng thành công", "success")
          );
        } catch (err) {
          throw new Error(err);
        }

        fetchDataAllLessonsOfChapter();
        fetchDataAllExam();
        return;
      } else {
        showSnackbar(
          "Phải xóa bài kiểm tra bên dưới trước khi xóa bài học này",
          "error"
        );
        return;
      }
    }
  };

  const updateIndexesOnDelete = (index) => {
    const newListLesson = lessionsOfChapter?.lessons?.map((lesson) => {
      const newLessons = lesson?.lesson?.filter((item) => {
        return item?.index !== index;
      });
      return newLessons;
    });

    newListLesson?.forEach(async (lesson) => {
      lesson.forEach((item) => {
        if (item?.index > index) {
          item.index--;
        }
      });
    });

    setListLessonOfChapter(newListLesson);
  };

  const fetchDataExamDetail = async (id) => {
    const res = await getExamByIdAction(id);

    setExamDetail(res?.data || null);
  };

  const mergeLessonsAndExams = (lessons, exams) => {
    const sortedLessons =
      lessons.lessons
        ?.flatMap((lesson) => lesson.lesson)
        .sort((a, b) => a.index - b.index) || [];

    const mergedList = [];
    const lessonsMap = new Map();

    sortedLessons.forEach((lesson) => {
      mergedList.push(lesson);
      if (lesson?.examID !== null && lesson?.examID !== undefined) {
        lessonsMap.set(lesson.examID, lesson);
      }
    });

    exams?.forEach((exam) => {
      const lesson = lessonsMap.get(exam.id);
      if (lesson) {
        const index = mergedList.findIndex((item) => item.id === lesson.id);
        mergedList.splice(index + 1, 0, exam);
      } else {
        mergedList.push(exam);
      }
    });

    return mergedList;
  };

  const handleUpdateExamAndLesson = (id, timeLimit) => {
    if (timeLimit) {
      handleUpdateExamModalOpen(id);
    } else {
      handleUpdateLessonModalOpen(id);
    }
  };
  useEffect(() => {
    const mergeLessons = mergeLessonsAndExams(lessionsOfChapter, exams);
    setMergeList(mergeLessons);
  }, [lessionsOfChapter, exams]);

  const fetchDataLessonDetail = async (id) => {
    const res = await getLessonByIdAction(id);
    setLessonDetail(res?.data || null);
  };

  useEffect(() => {
    if (selectedExamId !== null) {
      fetchDataExamDetail(selectedExamId);
    }
    if (selectedLessonId !== null) {
      fetchDataLessonDetail(selectedLessonId);
    }
  }, [selectedExamId, selectedLessonId]);

  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (over) {
      const overIndex = mergeList.findIndex((item) => item.id === over.id);
      const activeItem = mergeList.find((item) => item.id === active.id);

      if (activeItem?.timeLimit && overIndex === 0) {
        setMergeList((prev) => [...prev]);
      } else if (active.id !== over.id) {
        const data = (items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);
          const newItems = arrayMove(items, oldIndex, newIndex);

          for (let i = 0; i < newItems.length - 1; i++) {
            if (newItems[i]?.timeLimit && newItems[i + 1]?.timeLimit) {
              return mergeList;
            }
          }

          let index = 1;
          newItems.forEach((item) => {
            if (!item?.timeLimit) {
              item.index = index;
              index++;
            }
          });

          return newItems;
        };

        setMergeList(data(mergeList));
      } else {
        setMergeList((prev) => [...prev]);
      }
    }
  };

  const handleDragStart = () => {
    setIsDragged(true);
  };

  const handleCancelUpdateOrderLesson = () => {
    const mergeLessons = mergeLessonsAndExams(lessionsOfChapter, exams);
    setMergeList(mergeLessons);
    setIsDragged(false);
  };

  const handleUpdateOrderLesson = async () => {
    let dataLessonUpdate;
    const updatedArray = mergeList.map((item, index, arr) => {
      if (item.timeLimit !== undefined && index > 0) {
        const previousItem = arr[index - 1];
        return {
          ...item,
          previousItem: {
            ...previousItem,
            nextTimeLimitId: item.id,
          },
        };
      }
      return item;
    });

    const flattenedArray = updatedArray.reduce((acc, item, index) => {
      if (item.previousItem) {
        acc.push(item.previousItem);
        acc.splice(index - 1, 1);
      }
      acc.push(item);
      return acc;
    }, []);

    try {
      for (const [index, item] of flattenedArray.entries()) {
        if (flattenedArray[0]?.timeLimit && index === 0) {
          showSnackbar("Không thể di chuyển bài kiểm tra lên đầu", "error");
          fetchDataAllExam();
          fetchDataAllLessonsOfChapter();
          setIsDragged(false);
          return;
        }
        if (item?.timeLimit) continue;
        if (item?.nextTimeLimitId) {
          dataLessonUpdate = {
            id: item?.id,
            title: item?.title,
            author: item?.author,
            description: item?.description,
            videoDuration: item?.videoDuration,
            view: Number(item?.view),
            status: false,
            chapterId: Number(chapter?.id),
            serialDto: {
              index: Number(item?.index),
              exam_ID: Number(item?.nextTimeLimitId),
            },
          };
        } else {
          dataLessonUpdate = {
            id: item?.id,
            title: item?.title,
            author: item?.author,
            description: item?.description,
            videoDuration: item?.videoDuration,
            view: Number(item?.view),
            status: false,
            chapterId: Number(chapter?.id),
            serialDto: {
              index: Number(item?.index),
              exam_ID: null,
            },
          };
        }

        await updateLessonAction(dataLessonUpdate);
      }
      fetchDataAllExam();
      fetchDataAllLessonsOfChapter();
      setIsDragged(false);
    } catch (err) {
      throw new Error(err);
    }
  };

  return (
    <Box>
      <DndContext
        onDragStart={handleDragStart}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}>
        <SortableContext
          items={mergeList.map((lession) => lession?.id)}
          strategy={verticalListSortingStrategy}>
          {mergeList.map((lession) => (
            <Box key={lession?.id}>
              <DetailLessonSection
                id={lession?.id}
                lession={lession}
                openUpdateExamModal={openUpdateExamModal}
                handleUpdateExamModalClose={handleUpdateExamModalClose}
                fetchDataExamDetail={fetchDataExamDetail}
                examDetail={examDetail}
                fetchDataAllLessonsOfChapter={fetchDataAllLessonsOfChapter}
                handleUpdateExamAndLesson={handleUpdateExamAndLesson}
                handleDeleteLession={handleDeleteLession}
                openUpdateLessonModal={openUpdateLessonModal}
                handleUpdateLessonModalClose={handleUpdateLessonModalClose}
                lessonDetail={lessonDetail}
              />
            </Box>
          ))}
        </SortableContext>
      </DndContext>
      {isDragged && (
        <>
          <Button
            onClick={handleCancelUpdateOrderLesson}
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
            Hủy
          </Button>
          <Button
            onClick={handleUpdateOrderLesson}
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
            Lưu
          </Button>
        </>
      )}
    </Box>
  );
}

export default LessionDetail;

const DetailLessonSection = ({
  id,
  lession,
  openUpdateExamModal,
  handleUpdateExamModalClose,
  fetchDataExamDetail,
  examDetail,
  fetchDataAllLessonsOfChapter,
  handleUpdateExamAndLesson,
  handleDeleteLession,
  openUpdateLessonModal,
  handleUpdateLessonModalClose,
  lessonDetail,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: "15px",
  };

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      style={style}
      sx={{
        padding: "12px 20px",
        backgroundColor: "#FFF",
        marginBottom: "15px",
        display: "flex",
        justifyContent: "space-between",
      }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {lession?.timeLimit ? (
          <>
            <IconButton {...listeners} onMouseDown={(e) => e.stopPropagation()}>
              <DragIndicatorIcon />
            </IconButton>
            <DriveFileRenameOutlineIcon sx={{ marginRight: "15px" }} />
            <UpdateExam
              openUpdateExamModal={openUpdateExamModal}
              handleUpdateExamModalClose={handleUpdateExamModalClose}
              lesson={lession}
              fetchDataExamDetail={fetchDataExamDetail}
              examDetail={examDetail}
              fetchDataAllLessonsOfChapter={fetchDataAllLessonsOfChapter}
            />
          </>
        ) : (
          <>
            <IconButton {...listeners} onMouseDown={(e) => e.stopPropagation()}>
              <DragIndicatorIcon />
            </IconButton>
            <FormatListBulletedIcon sx={{ marginRight: "15px" }} />
            <UpdateLesson
              openUpdateLessonModal={openUpdateLessonModal}
              handleUpdateLessonModalClose={handleUpdateLessonModalClose}
              lesson={lession}
              fetchDataExamDetail={fetchDataExamDetail}
              examDetail={examDetail}
              lessonDetail={lessonDetail}
              fetchDataAllLessonsOfChapter={fetchDataAllLessonsOfChapter}
            />
          </>
        )}

        <Typography>{lession?.title}</Typography>
      </Box>
      <Box>
        <IconButton
          onClick={() => {
            handleUpdateExamAndLesson(lession?.id, lession?.timeLimit);
          }}>
          <BorderColorIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            handleDeleteLession(lession?.id, lession?.timeLimit, lession);
          }}>
          <DeleteOutlineIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
