import { Box, Modal, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import CreateLession from "./CreateLession";
import CreateExam from "../AdminExam/CreateExam";

const styleModalCreate = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  height: 700,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  overflowY: "auto",
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function CreateLessionExam({
  openCreateModal,
  handleClose,
  chapter,
  fetchDataAllLessonsOfChapter,
  lessionsOfChapter,
  fetchDataAllExam,
}) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        open={openCreateModal}
        onClose={handleClose}>
        <Box sx={styleModalCreate}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example">
              <Tab label="Tạo bài giảng" {...a11yProps(0)} />
              <Tab label="Tạo bài kiểm tra" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <CreateLession
              chapter={chapter}
              fetchDataAllLessonsOfChapter={fetchDataAllLessonsOfChapter}
              handleClose={handleClose}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <CreateExam
              fetchDataAllLessonsOfChapter={fetchDataAllLessonsOfChapter}
              handleClose={handleClose}
              lessionsOfChapter={lessionsOfChapter}
              chapter={chapter}
              fetchDataAllExam={fetchDataAllExam}
            />
          </TabPanel>
        </Box>
      </Modal>
    </Box>
  );
}

export default CreateLessionExam;
