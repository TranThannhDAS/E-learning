import React, { useEffect } from "react";
import { Box, Checkbox, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { getChapterBySourceId } from "@eproject4/services/chapter.service";
import { getAllLessionsByChapterId } from "@eproject4/services/lession.service";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={
      <ArrowForwardIosSharpIcon
        sx={{
          fontSize: "0.9rem",
        }}
      />
    }
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#FFF" : "#FFF",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function SourceDetail({ id }) {
  console.log(id);
  const { getChapterBySourceIdAction } = getChapterBySourceId();
  const { getAllLessionsByChapterIdAction } = getAllLessionsByChapterId();
  const [expanded, setExpanded] = React.useState("panel1");

  // useEffect(() => {
  //   const fetchdataChapter=

  // },[]);

  const items = [
    {
      index: 1,
      title: "What is Webflow?",
      duration: "07:31",
      checked: true,
      playing: false,
    },
    {
      index: 2,
      title: "Sign up in Webflow",
      duration: "07:31",
      checked: false,
      playing: true,
    },
  ];

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <Box sx={{ marginRight: "20px" }}>
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
            }}
            component="p">
            Chương
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
            }}
            component="p">
            Bài Học
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
            component="p"></Typography>
        </Box>
      </Box>
      <Box sx={{ border: "1px solid #E9EAF0" }}>
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}>
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography>Collapsible Group Item #1</Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {" "}
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
                  }}
                  component="p">
                  Bài Học
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
                  19h 37m (1/4)
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <Box sx={{ width: "100%", margin: "auto" }}>
                {items.map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: item.playing ? "#FFF5F5" : "transparent",

                      borderBottom: "1px solid #E0E0E0",
                    }}>
                    <Checkbox
                      checked={item.checked}
                      sx={{
                        color: "#F25C05",
                        "&.Mui-checked": {
                          color: "#F25C05",
                        },
                      }}
                    />
                    <Typography variant="body1" sx={{ flexGrow: 1 }}>
                      {item.index}. {item.title}
                    </Typography>
                    <IconButton size="small">
                      {item.playing ? <PauseIcon /> : <PlayArrowIcon />}
                    </IconButton>
                    <Typography variant="body2" sx={{ marginLeft: 1 }}>
                      {item.duration}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}>
          <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
            <Typography>Collapsible Group Item #2</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel3"}
          onChange={handleChange("panel3")}>
          <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
            <Typography>Collapsible Group Item #3</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}
