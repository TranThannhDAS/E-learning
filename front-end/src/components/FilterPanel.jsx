import React, { useEffect, useRef } from "react";
import {
  Box,
  List,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Divider,
  ListItem,
  Checkbox,
  FormControl,
  InputLabel,
  OutlinedInput,
  ListItemIcon,
  ListItemText,
  Radio,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StarIcon from "@mui/icons-material/Star";
import theme from "@eproject4/theme";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { searchFullText } from "@eproject4/services/search.service";
import { getAllCourses } from "@eproject4/services/courses.service";
import { isBuffer } from "lodash";

function FilterPanel({
  isShowFilter,
  topics,
  SendData,
  handleClickFilter2
}) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const { searchFullTextAction, Fillter } = searchFullText();
  const { getDataHome2, getTopicandSubtopic } = getAllCourses();
  const navigate = useNavigate();
  const [dataFilter, setDataFilter] = useState([]);
  const [topicName, SetTopicName] = useState("");
  const [subtopicName, SetsubTopicName] = useState("");
  const [RatingLte, setRatingLte] = useState(5);
  const [RatingGte, setRatingGte] = useState(0);
  const [PriceLte, setPriceLte] = useState(100000000);
  const [PriceGte, setPriceGte] = useState(0);
  const [checkedRatings, setCheckedRatings] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedValue2, setSelectedValue2] = useState(null);
  const [checkedRatings2, setCheckedRatings2] = useState([]);
  const fromInputRef  = useRef(null);
  const toInputRef = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTopicandSubtopic();
        console.log("Dâttaa", res.data);
        setDataFilter(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    }
    fetchData();
  }, []);

  const handleClickFilter = () => {
    handleClickFilter2();
  };
  const starRatings = [
    { label: '5 sao', count: 1345 },
    { label: '4 sao & trở lên ', count: 1345 },
    { label: '3 sao & trở lên ', count: 1345 },
    { label: '2 sao & trở lên ', count: 1345 },
    { label: '1 sao & trở lên ', count: 1345 },
  ];
  const items = [
    { id: 1, label: 'Trả phí' },
    { id: 2, label: 'Miễn phí' }
  ];
  const handleRadioChange = (label) => {
        setSelectedValue(label);
        const RatingGte = label.slice(0, 1);
        setRatingGte(RatingGte);
        setRatingLte(5);
  };
  const handleRadioPrice = (label) => {
        setSelectedValue2(label);
        if(label === "Miễn phí"){
          setPriceGte(0);
          setPriceLte(0);
          fromInputRef.current.value = '';
          toInputRef.current.value = '';
        }else{
          setPriceGte(0);
          setPriceLte(1000000000);
        }
  };

  useEffect(() => {
    FilterSource();
  }, [RatingGte, RatingLte]);
  useEffect(() => {
    FilterSource();
  }, [PriceGte, PriceLte]);
  useEffect(() => {
    FilterSource();
  }, [topicName, subtopicName]);
  const handleSearchChange = async (event) => {
    const keyword = event.target.value;
    setSearchKeyword(keyword);
  };
  const handleCourseFilterClick = (topicName, subTopicName) => {
    console.log("Topic", topicName, "Subtopic", subTopicName);
    SetTopicName(topicName);
    SetsubTopicName(subTopicName);
    
  }
  const FilterSource = async () => {
    const data = {
      topicName: topicName,
      subTopicName: subtopicName,
      RatingGte: RatingGte,
      RatingLte: RatingLte,
      PriceGte: PriceGte,
      PriceLte: PriceLte,
    };
    try {
      const res = await Fillter(data);
      console.log("Filter", res.data);
      SendData(res.data);
    } catch (err) {
      console.error("Lỗi:", err);
    }
  };

  const handleSearchKeyUp = async (event) => {
    if (event.keyCode === 13 && searchKeyword.length > 2) {
      try {
        const res = await searchFullTextAction(searchKeyword);

        // Kiểm tra và log định dạng của res.data
        if (res?.data && Array.isArray(res.data)) {
          const items = res.data;
          console.log("Items found:", items);
          SendData(items); // Truyền kết quả tìm kiếm lên ListCourses
        } else {
          console.log("No items found or data is not an array");
          SendData([]); // Truyền mảng rỗng nếu không có items
        }

        console.log("Title:", res?.data || []);
      } catch (err) {
        console.error(err);
      }
    } else if (event.keyCode === 13 && searchKeyword.length == 0) {
      const res2 = await getDataHome2();
      SendData(res2.data);
    }
  };

  return (
    <Box sx={{ marginTop: "56px" }}>
      <Box
        sx={{
          maxWidth: "450px",
          [theme.breakpoints.up("lg")]: {
            maxWidth: "1080px",
          },
          [theme.breakpoints.up("xl")]: {
            maxWidth: "1320px",
          },
          [theme.breakpoints.up("md")]: {
            maxWidth: "800px",
          },
          [theme.breakpoints.up("sm")]: {
            maxWidth: "550px",
          },
          margin: "auto",
          display: "flex",
          justifyContent: "space-between",
        }}>
        <button onClick={handleClickFilter}>
          <Box
            sx={{
              width: "108px",
              height: "40px",
              border: "1px solid #FFDDD1",
              paddingTop: "7px",
            }}>
            <TuneIcon sx={{ marginRight: "10px" }} />
            Lọc
          </Box>
        </button>
        <Box>
          <TextField
            id="input-with-icon-textfield"
            placeholder="Search..."
            value={searchKeyword}
            onChange={handleSearchChange}
            onKeyUp={handleSearchKeyUp}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            variant="standard"
          />
        </Box>
      </Box>
      <Divider
        sx={{
          maxWidth: "450px",
          marginX: "auto",
          marginTop: "30px",
          [theme.breakpoints.up("lg")]: {
            maxWidth: "1080px",
          },
          [theme.breakpoints.up("xl")]: {
            maxWidth: "1320px",
          },
          [theme.breakpoints.up("md")]: {
            maxWidth: "800px",
          },
          [theme.breakpoints.up("sm")]: {
            maxWidth: "550px",
          },
        }}
      />
      <Box
        sx={{
          position: "relative",
          maxWidth: "450px",
          margin: "auto",
          [theme.breakpoints.up("lg")]: {
            maxWidth: "1080px",
          },
          [theme.breakpoints.up("xl")]: {
            maxWidth: "1320px",
          },
          [theme.breakpoints.up("md")]: {
            maxWidth: "800px",
          },
          [theme.breakpoints.up("sm")]: {
            maxWidth: "550px",
          },
        }}>
        <Box
          sx={{
            position: "absolute",
            left: 0,
            display: isShowFilter ? "block" : "none",
            zIndex: 1000,
          }}>
          <Box sx={{ maxWidth: "272px" }}>
            <Accordion>
              <AccordionSummary
                sx={{ height: "20px" }}
                expandIcon={<ExpandMoreIcon />}>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                  }}>
                  Danh mục
                </Typography>
              </AccordionSummary>
              <Divider />
              <AccordionDetails sx={{ marginTop: "10px" }}>
                <div>
                  {dataFilter.map((topic, i) => {
                    return (
                      <Accordion
                        key={i}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header">
                          <Typography
                            sx={{ fontSize: "14px", fontWeight: 500 }}>
                            {topic.topicName}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {topic.subtopics.map((subtopic, j) => (
                            <Typography
                              key={j}
                              onClick={() => handleCourseFilterClick(topic.topicName, subtopic.subTopicName)}
                              sx={{ cursor: 'pointer' }}
                            >
                              {subtopic.subTopicName}
                            </Typography>
                          ))}
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                </div>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                sx={{ height: "20px" }}
                expandIcon={<ExpandMoreIcon />}>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                  }}>
                  Đánh giá
                </Typography>
                <Divider />
              </AccordionSummary>
              <Divider />
              <AccordionDetails>
                <List>
                  {starRatings.map((rating, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        padding: 0,
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Radio
                          name="radio-buttons"
                          checked={selectedValue === rating.label}
                          onChange={() => handleRadioChange(rating.label)}
                        />
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              marginRight: '7px',
                              color: '#FD8E1F',
                            }}
                          >
                            <StarIcon sx={{ width: '18px', height: '18px' }} />
                          </ListItemIcon>
                          <ListItemText
                            sx={{
                              fontSize: '14px',
                              fontWeight: 400,
                              color: '#4E5566',
                            }}
                            primary={rating.label}
                          />
                        </Box>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '12px',
                          fontWeight: 400,
                          color: '#8C94A3',
                        }}
                      >
                        {rating.count}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                sx={{ height: "20px" }}
                expandIcon={<ExpandMoreIcon />}>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                  }}>
                  Giá
                </Typography>
              </AccordionSummary>
              <Divider />
              <AccordionDetails sx={{ marginTop: "10px" }}>
                <div>
                  <Box sx={{ display: "flex" }}>
                    <FormControl fullWidth sx={{ m: 1, width: "49%" }}>
                      <InputLabel htmlFor="outlined-adornment-amount">
                        Từ
                      </InputLabel>
                      <OutlinedInput
                        sx={{ height: "48px" }}
                        id="outlined-adornment-amount"
                        startAdornment={
                          <InputAdornment position="start">$</InputAdornment>
                        }
                         type="number"
                        label="Amount"
                        inputRef={fromInputRef}
                      />
                    </FormControl>
                    <FormControl fullWidth sx={{ m: 1, width: "49%" }}>
                      <InputLabel htmlFor="outlined-adornment-amount">
                        Đến
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-amount"
                        sx={{ height: "48px" }}
                        startAdornment={
                          <InputAdornment position="start">$</InputAdornment>
                        }
                         type="number"
                        label="Amount"
                        inputRef={toInputRef}
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    {items.map(item => (
                      <ListItem
                        key={item.id}
                        sx={{
                          padding: 0,
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Radio 
                          name="radio-buttons"
                          checked={selectedValue2 === item.label} 
                          onChange={() => handleRadioPrice(item.label)} />
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                marginRight: '7px',
                                color: '#FD8E1F',
                              }}
                            />
                            <ListItemText
                              sx={{
                                fontSize: '14px',
                                fontWeight: 400,
                                color: '#4E5566',
                              }}
                              primary={item.label}
                            />
                          </Box>
                        </Box>
                      </ListItem>
                    ))}
                  </Box>
                </div>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}


export default FilterPanel;
