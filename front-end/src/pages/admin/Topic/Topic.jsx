import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { deleteTopic, getTopics } from "@eproject4/services/topic.service";
import { useDispatch, useSelector } from "react-redux";
import { topicsSelector } from "@eproject4/redux/selectors";
import { setTopics, setTotalCount } from "@eproject4/redux/slices/topicSlice";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import CreateTopic from "./CreateTopic";
import UpdateTopic from "./UpdateTopic";
import Pagination from "@mui/material/Pagination";

function createData(id, nameTopic) {
  return { id, nameTopic };
}

function Topic() {
  const data = useSelector(topicsSelector);
  const dispatch = useDispatch();
  const { getTopicsAction } = getTopics();
  const { deleteTopicAction } = deleteTopic();
  const [openModal, setOpenModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(5);

  const rows = data.topics.map((item) => {
    return createData(item?.id, item?.topicName);
  });

  const fetchDataTopics = async (pageIndex, pageSize) => {
    const res = await getTopicsAction(pageIndex, pageSize);
    dispatch(setTopics(res?.data?.items));
    dispatch(setTotalCount(res?.data?.totalCount));
  };

  useEffect(() => {
    fetchDataTopics(pageIndex, pageSize);
  }, [pageIndex, pageSize]);

  const handlePageChange = (event, newPage) => {
    setPageIndex(newPage);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleDeleteTopic = async (id) => {
    await deleteTopicAction(id);
    fetchDataTopics(pageIndex, pageSize);
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
          Thêm danh mục
        </Button>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Tên danh mục</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => {
                return (
                  <TableRow
                    key={index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}>
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell>{row.nameTopic}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        sx={{ marginRight: "10px" }}
                        onClick={() => handleOpenUpdateModal(row)}>
                        Cập nhật
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          handleDeleteTopic(row.id);
                        }}>
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={Math.ceil(data.total / pageSize)}
          page={pageIndex}
          onChange={handlePageChange}
          sx={{ marginTop: 2 }}
        />
      </Box>
      <CreateTopic
        open={openModal}
        handleClose={handleCloseModal}
        existingTopics={data.topics}
        onTopicAdded={fetchDataTopics}
        pageSize={pageSize}
        pageIndex={pageIndex}
      />
      {selectedTopic && (
        <UpdateTopic
          open={openUpdateModal}
          handleClose={handleCloseUpdateModal}
          existingTopics={data.topics}
          topic={selectedTopic}
          onTopicUpdated={fetchDataTopics}
          pageSize={pageSize}
          pageIndex={pageIndex}
        />
      )}
    </Box>
  );
}

export default Topic;
