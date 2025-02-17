import { Box, Button } from "@mui/material";
import { deleteChapter } from "@eproject4/services/chapter.service";
import { useSearchParams } from "react-router-dom";
import UpdateChapter from "./UpdateChapter";
import { useEffect, useState } from "react";
import { closestCenter, DndContext } from "@dnd-kit/core";
import DetailChapter from "./DetailChapter";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import axios from "axios";
import useCustomSnackbar from "@eproject4/utils/hooks/useCustomSnackbar";

function ListChapter({ listChapters, getChapterOfCourse }) {
  const [sortedChapter, setSortedChapter] = useState([]);
  const [isDragged, setIsDragged] = useState(false);
  const [searchParams] = useSearchParams();
  const idCourse = searchParams.get("id-course");
  const { deleteChapterAction } = deleteChapter();
  const [openUpdateChapterModal, setOpenUpdateChapterModal] = useState(false);
  const { showSnackbar } = useCustomSnackbar();
  const [currentChapter, setCurrentChapter] = useState(null);
  const handleUpdateChapterModalOpen = (chapter) => {
    setOpenUpdateChapterModal(true);
    setCurrentChapter(chapter);
  };
  const handleUpdateChapterModalClose = () => setOpenUpdateChapterModal(false);
  const updateIndexesOnDelete = (index) => {
    const newListChapters = sortedChapter?.filter(
      (chapter) => chapter.index !== index
    );

    newListChapters?.forEach(async (chapter) => {
      if (chapter.index > index) {
        chapter.index--;
      }
    });

    setSortedChapter(newListChapters.sort((a, b) => a?.index - b?.index));
  };

  useEffect(() => {
    setSortedChapter(listChapters?.sort((a, b) => a?.index - b?.index));
  }, [listChapters]);

  const handleDeleteChapter = async (index, e, id) => {
    e.stopPropagation();
    updateIndexesOnDelete(index);
    await deleteChapterAction(id);
    try {
      await Promise.all(
        sortedChapter.map(
          async (chapter) =>
            await axios.put(`http://localhost:5187/api/Chapter/${chapter.id}`, {
              ...chapter,
              index: chapter?.index,
            })
        ),
        showSnackbar("Cập nhật thứ tự chương thành công", "success")
      );
    } catch (err) {
      throw new Error(err);
    }
    getChapterOfCourse(idCourse);
  };

  const handleUpdateTitleAndDescription = (chapter, e) => {
    e.stopPropagation();
    handleUpdateChapterModalOpen(chapter);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const data = (items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        newItems.forEach((item, index) => {
          item.index = index + 1;
        });

        return newItems;
      };
      data(sortedChapter);
      setSortedChapter(data(sortedChapter));
    }
  };

  const handleDragStart = () => {
    setIsDragged(true);
  };

  const handleUpdateOrderChapter = async () => {
    try {
      await Promise.all(
        sortedChapter.map(
          async (chapter) =>
            await axios.put(`http://localhost:5187/api/Chapter/${chapter.id}`, {
              ...chapter,
              index: chapter?.index,
            })
        ),
        showSnackbar("Cập nhật thứ tự chương thành công", "success")
      );
    } catch (err) {
      showSnackbar("Cập nhật thứ tự chương thất bại", "error");
    }
    setIsDragged(false);
    getChapterOfCourse(idCourse);
  };

  const handleCancelUpdateOrderChapter = () => {
    getChapterOfCourse(idCourse);
    setIsDragged(false);
  };
  return (
    <Box sx={{ marginTop: "30px" }}>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}>
        <SortableContext
          items={sortedChapter.map((chapter) => chapter.id)}
          strategy={verticalListSortingStrategy}>
          {sortedChapter?.map((chapter, index) => {
            return (
              <DetailChapter
                key={chapter?.id}
                id={chapter?.id}
                chapter={chapter}
                index={index}
                handleUpdateTitleAndDescription={
                  handleUpdateTitleAndDescription
                }
                handleDeleteChapter={handleDeleteChapter}
              />
            );
          })}
        </SortableContext>
      </DndContext>
      {isDragged && (
        <>
          <Button
            onClick={handleCancelUpdateOrderChapter}
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
            onClick={handleUpdateOrderChapter}
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
      <UpdateChapter
        openUpdateChapterModal={openUpdateChapterModal}
        handleUpdateChapterModalClose={handleUpdateChapterModalClose}
        getChapterOfCourse={getChapterOfCourse}
        chapter={currentChapter}
      />
    </Box>
  );
}

export default ListChapter;
