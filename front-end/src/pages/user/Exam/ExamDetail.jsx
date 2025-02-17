import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import * as signalR from "@microsoft/signalr";
import {
  calculateScoreExam,
  createAnswer,
  endExamm,
  getAnswer,
  getExamById,
} from "@eproject4/services/exam.service";
import { useEffect, useState } from "react";
import { getUser } from "@eproject4/helpers/authHelper";
import DoneIcon from "@mui/icons-material/Done";

function ExamDetail({ idExam }) {
  const { getExamByIdAction } = getExamById();
  const [exam, setExam] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const user = getUser();
  const { endExamAction } = endExamm();
  const [timeExam, setTimeExam] = useState(0);
  const [timeLimit, setTimeLimit] = useState(0);
  const [isDoingExam, setIsDoingExam] = useState(false);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isExamRetaken, setIsExamRetaken] = useState(false);
  const [connection, setConnection] = useState(null);
  const { calculateScoreExamAction } = calculateScoreExam();
  const { getAnswerAction } = getAnswer();
  const { createAnswerAction } = createAnswer();
  const [score, setScore] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [isExamDone, setIsExamDone] = useState(false);
  const [listAnswers, setListAnswers] = useState([]);
  const [resultOfAnswer, setResultOfAnswer] = useState({});

  const handleChange = (event, questionID) => {
    const { value } = event.target;
    setSelectedOptions({
      ...selectedOptions,
      [questionID]: value,
    });
  };

  const fetchDataAnswer = async () => {
    const res = await getAnswerAction();
    setListAnswers(res.data);
  };

  useEffect(() => {
    fetchDataAnswer();
  }, [idExam]);

  useEffect(() => {
    setIsExamDone(false);
    let newItem = [];
    listAnswers.forEach((item) => {
      if (item?.examId == idExam && item?.userId == user.id) {
        setIsExamDone(true);
        newItem.push(item);
      }
    });

    setResultOfAnswer(newItem[newItem.length - 1]);
  }, [listAnswers, idExam]);

  const fetchExamById = async (id) => {
    const res = await getExamByIdAction(id);
    setExam(res.data);
    setTimeLimit(res.data?.exam?.timeLimit);
  };

  useEffect(() => {
    fetchExamById(idExam);
  }, [idExam]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleBeforeUnload = (event) => {
    if (isDoingExam) {
      event.preventDefault();
      event.returnValue = "";
      return "Bạn có chắc chắn muốn rời khỏi trang? Các thông tin đang làm bài sẽ không được lưu.";
    }
  };

  const handleNavigateAway = (event) => {
    if (isDoingExam) {
      event.preventDefault();
      handleOpenDialog();
    } else {
      disconnectSignalR();
    }
  };

  useEffect(() => {
    window.addEventListener("unload", handleNavigateAway);

    return () => {
      window.removeEventListener("unload", handleNavigateAway);
    };
  }, []);

  useEffect(() => {
    if (!connection) {
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5187/examHub")
        .configureLogging(signalR.LogLevel.Information)
        .build();

      setConnection(newConnection);
    }

    return () => {
      if (connection) {
        connection.stop().catch((err) => {
          throw new Error(err.toString());
        });
      }
    };
  }, []);

  function setupSignalRConnection() {
    connection.on("ReceiveTimeUpdate", function (time) {
      setTimeExam(time);
    });

    connection.on("ReceiveExamEnd", function () {
      connection.stop();
    });

    connection
      .start()
      .then(function () {
        startExam();
      })
      .catch(function (err) {
        setTimeout(setupSignalRConnection, 5000);
        throw new Error(err.toString());
      });
  }

  function disconnectSignalR() {
    if (
      connection &&
      connection.state === signalR.HubConnectionState.Connected
    ) {
      connection.stop().catch((err) => {
        throw new Error("Error disconnecting from SignalR: ", err.toString());
      });
    } else {
      throw new Error("SignalR connection is not established.");
    }
  }

  function startExam() {
    if (
      !connection ||
      connection.state !== signalR.HubConnectionState.Connected
    ) {
      setupSignalRConnection();
    } else {
      invokeStartExam();
    }
  }

  function invokeStartExam() {
    let examId = Number(idExam);
    const userId = user.id;
    connection.invoke("StartExam", examId, userId).catch((err) => {
      throw new Error(err.toString());
    });
  }

  const startDoExam = () => {
    setIsDoingExam(true);
    setIsExamSubmitted(false);
    setIsExamRetaken(false);
    setScore(null);
    setCorrectAnswers([]);
    setSelectedOptions({});
    startExam();
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  async function handleSubmit() {
    const submittedAnswers = Object.keys(selectedOptions).map((questionID) => ({
      questionID,
      optionID: selectedOptions[questionID],
    }));

    let examId = Number(idExam);
    const userId = user.id;

    const resEndExam = await endExamAction(examId, userId);

    if (submittedAnswers?.length === exam?.exam?.questions?.length) {
      const res = await calculateScoreExamAction(idExam, submittedAnswers);
      const dataCreateAnswer = {
        total: String(
          res?.data?.answer?.correctAnswer /
            (res?.data?.answer?.inCorrectAnswer +
              res?.data?.answer?.correctAnswer)
        ),
        examId: exam?.exam?.id,
        userId: user.id,
        attemptId: Number(resEndExam?.data?.attempId),
        correctAnswer: res?.data?.answer?.correctAnswer,
        incorrectAnswer: res?.data?.answer?.inCorrectAnswer,
        createAt: new Date().toISOString(),
      };
      await createAnswerAction(dataCreateAnswer);
      setScore(res.data.answer.score);
      setCorrectAnswers(res.data.examDetails.questions);
    }
    if (submittedAnswers?.length < exam?.exam?.questions?.length) {
      const mergedArray = exam?.exam?.questions.map((item2) => {
        const foundItem = submittedAnswers.find(
          (item1) => parseInt(item1.questionID) === item2.questionID
        );
        if (foundItem) {
          return {
            questionID: parseInt(foundItem.questionID),
            optionID: parseInt(foundItem.optionID),
          };
        } else {
          return { questionID: Number(item2.questionID), optionID: 0 };
        }
      });

      const res = await calculateScoreExamAction(idExam, mergedArray);
      const dataCreateAnswer = {
        total: String(
          res?.data?.answer?.correctAnswer /
            (res?.data?.answer?.inCorrectAnswer +
              res?.data?.answer?.correctAnswer)
        ),
        examId: exam?.exam?.id,
        userId: user.id,
        attemptId: Number(resEndExam?.data?.attempId),
        correctAnswer: res?.data?.answer?.correctAnswer,
        incorrectAnswer: res?.data?.answer?.inCorrectAnswer,
        createAt: new Date().toISOString(),
      };
      await createAnswerAction(dataCreateAnswer);
      setScore(res.data.answer.score);
      setCorrectAnswers(res.data.examDetails.questions);
    }

    setIsDoingExam(false);
    setIsExamSubmitted(true);
    handleCloseDialog();
  }

  const handleRetakeExam = () => {
    setIsExamRetaken(true);
    startDoExam();
  };

  return (
    <Box sx={{ maxHeight: "600px", overflow: "auto", paddingBottom: "60px" }}>
      <Typography variant="h4" gutterBottom>
        {exam?.exam?.title}
      </Typography>
      <Typography color="primary" sx={{ fontSize: "20px" }}>
        <Typography color="primary" component="span" sx={{ fontSize: "20px" }}>
          Thời gian làm bài:{" "}
        </Typography>
        {timeExam ? timeExam : `${timeLimit} phút`}
      </Typography>
      {!isDoingExam && !isExamRetaken && !isExamDone && (
        <Button
          disabled={isExamSubmitted}
          sx={{ marginTop: "15px", marginRight: "15px" }}
          variant="outlined"
          onClick={startDoExam}>
          Bắt đầu làm bài
        </Button>
      )}
      {isExamSubmitted && !isExamRetaken && (
        <Button
          sx={{ marginTop: "15px" }}
          variant="outlined"
          onClick={handleRetakeExam}>
          Làm lại
        </Button>
      )}

      {isExamSubmitted && !isExamRetaken ? (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" color="success">
            Điểm số của bạn: {score}
          </Typography>
          {correctAnswers.map((question) => (
            <Box key={question.questionID} sx={{ mb: 2 }}>
              <Typography variant="h6">{question.questionText}</Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label={`options-${question.questionID}`}
                  name={`options-${question.questionID}`}
                  value={selectedOptions[question.questionID] || ""}
                  onChange={(event) => handleChange(event, question.questionID)}
                  disabled={isExamSubmitted}>
                  {question.options.map((option) => {
                    const userSelected = selectedOptions[question.questionID];
                    const isUnanswered = userSelected === undefined;
                    const isCorrect = option.isCorrect;
                    const isSelected = userSelected === option.id.toString();
                    const isCorrectAndSelected = isCorrect && isSelected;
                    const isIncorrectAndSelected = !isCorrect && isSelected;

                    return (
                      <FormControlLabel
                        key={option.id}
                        value={option.id.toString()}
                        control={<Radio />}
                        label={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <span
                              style={{
                                color: isCorrectAndSelected
                                  ? "#09e026"
                                  : isIncorrectAndSelected
                                    ? "red"
                                    : isUnanswered
                                      ? "red"
                                      : "inherit",
                              }}>
                              {option.answer}
                            </span>
                            {isCorrect && (
                              <DoneIcon sx={{ color: "green", ml: 1 }} />
                            )}
                          </Box>
                        }
                        disabled={isExamSubmitted}
                      />
                    );
                  })}
                </RadioGroup>
              </FormControl>
            </Box>
          ))}
        </Box>
      ) : isDoingExam ? (
        <Box sx={{ mt: 2 }}>
          {exam?.exam?.questions.map((question) => (
            <Box key={question.questionID} sx={{ mb: 2 }}>
              <Typography variant="h6">{question.questionText}</Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label={`options-${question.questionID}`}
                  name={`options-${question.questionID}`}
                  value={selectedOptions[question.questionID] || ""}
                  onChange={(event) =>
                    handleChange(event, question.questionID)
                  }>
                  {question.options.map((option) => (
                    <FormControlLabel
                      key={option.id}
                      value={option.id.toString()}
                      control={<Radio />}
                      label={option.answer}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          ))}
        </Box>
      ) : !isExamDone ? (
        <Typography variant="h6" color="error" sx={{ mt: 2 }}>
          Bạn cần bấm nút "Bắt đầu làm bài" để bắt đầu làm bài thi.
        </Typography>
      ) : (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" color="success">
            Điểm số của bạn: {Math.floor(Number(resultOfAnswer?.total) * 100)}
          </Typography>
          <Button
            sx={{ marginTop: "15px", marginBottom: "15px" }}
            variant="outlined"
            onClick={handleRetakeExam}>
            Làm lại
          </Button>
          {resultOfAnswer?.exam?.questions.map((question) => {
            return (
              <Box key={question.questionID} sx={{ mb: 2 }}>
                <Typography variant="h6">{question.questionText}</Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label={`options-${question.questionID}`}
                    name={`options-${question.questionID}`}
                    value={selectedOptions[question.questionID] || ""}
                    onChange={(event) =>
                      handleChange(event, question.questionID)
                    }
                    disabled={true}>
                    {question.options.map((option) => {
                      const isCorrect = option.isCorrect;

                      return (
                        <FormControlLabel
                          key={option.id}
                          value={option.id.toString()}
                          control={<Radio />}
                          label={
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <span>{option.answer}</span>
                              {isCorrect && (
                                <DoneIcon sx={{ color: "green", ml: 1 }} />
                              )}
                            </Box>
                          }
                          disabled={isExamSubmitted}
                        />
                      );
                    })}
                  </RadioGroup>
                </FormControl>
              </Box>
            );
          })}
        </Box>
      )}

      <Button
        variant="contained"
        color="primary"
        disabled={!isDoingExam}
        onClick={handleOpenDialog}
        sx={{ mt: 2, color: "#FFF", boxShadow: "none" }}>
        Nộp bài
      </Button>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Xác nhận nộp bài</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn nộp bài không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleSubmit} color="primary" autoFocus>
            Nộp bài
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ExamDetail;
