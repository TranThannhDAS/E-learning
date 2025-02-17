import { topicsSelector, subTopicsSelector } from "@eproject4/redux/selectors";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSubTopic,
  getSubTopics,
} from "@eproject4/services/subTopic.service";
import { useEffect, useState } from "react";
import {
  setSubTopics,
  deleteSubTopicReducer,
} from "@eproject4/redux/slices/subTopicSlice";
import { getAllTopics } from "@eproject4/services/topic.service";
import { setTopics } from "@eproject4/redux/slices/topicSlice";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import Button from "@mui/material/Button";
import CreateSubTopic from "./CreateSubTopic";
import UpdateSubTopic from "./UpdateSubTopic";

function createData(id, nameSubTopic, topicName, topicId) {
  return { id, nameSubTopic, topicName, topicId };
}

function SubTopic() {
  const dataTopics = useSelector(topicsSelector);
  const dataSubTopics = useSelector(subTopicsSelector);
  const dispatch = useDispatch();
  const { getSubTopicsAction } = getSubTopics();
  const { getAllTopicsAction } = getAllTopics();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const { deleteSubTopicAction } = deleteSubTopic();
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const mergeData = dataSubTopics.subTopics.map((item) => {
    const topic = dataTopics.topics.find((top) => {
      return top.id === item.topicId;
    });
    return {
      ...item,
      topicName: topic?.topicName,
    };
  });
  const rows = mergeData.map((item) => {
    return createData(
      item?.id,
      item?.subTopicName,
      item?.topicName,
      item?.topicId
    );
  });

  const fetchDataSubTopics = async () => {
    const res = await getSubTopicsAction();
    dispatch(setSubTopics(res?.data));
  };

  const fetchDataTopics = async () => {
    const res = await getAllTopicsAction();
    dispatch(setTopics(res?.data?.items));
  };

  useEffect(() => {
    fetchDataTopics();
    fetchDataSubTopics();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleDeleteTopic = async (id) => {
    await deleteSubTopicAction(id);
    dispatch(deleteSubTopicReducer(id));
  };

  const handleOpenUpdateModal = (topic) => {
    setSelectedTopic(topic);
    setOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
    setSelectedTopic(null);
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
      <Box>
        <Button
          variant="contained"
          onClick={handleOpenModal}
          sx={{
            color: "white",
            marginBottom: "50px",
          }}>
          Thêm danh mục con
        </Button>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Tên danh mục con</TableCell>
                <TableCell>Tên danh mục</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}>
                      <TableCell component="th" scope="row">
                        {row?.id}
                      </TableCell>
                      <TableCell>{row?.nameSubTopic}</TableCell>
                      <TableCell>{row?.topicName}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            handleOpenUpdateModal(row);
                          }}
                          sx={{ marginRight: "10px" }}>
                          Cập nhật
                        </Button>
                        <Button
                          onClick={() => {
                            handleDeleteTopic(row?.id);
                          }}
                          variant="outlined">
                          Xóa
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      <CreateSubTopic
        open={openModal}
        handleClose={handleCloseModal}
        onSubTopicAdded={fetchDataSubTopics}
        existingTopics={dataTopics.topics}
      />
      {selectedTopic && (
        <UpdateSubTopic
          open={openUpdateModal}
          handleClose={handleCloseUpdateModal}
          existingTopics={dataTopics.topics}
          existingSubTopics={dataSubTopics}
          subTopic={selectedTopic}
          onSubTopicUpdated={fetchDataSubTopics}
        />
      )}
    </Box>
  );
}

export default SubTopic;
