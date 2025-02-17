import { Box, Stepper, Step, StepLabel, Typography } from "@mui/material";
import { useState } from "react";
import BasicInfoTab from "./BasicInfoTab";
import AdvancedInfoTab from "./AdvancedInfoTab";

function CreateCourse() {
  const steps = ["Thông tin cơ bản", "Thông tin nâng cao"];

  const [basicInfo, setBasicInfo] = useState({});

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 2 }}>
          {activeStep === steps.length ? (
            <Typography variant="h6" align="center">
              Khóa học đã được tạo thành công!
            </Typography>
          ) : (
            <Box>
              {activeStep === 0 && (
                <BasicInfoTab
                  setBasicInfo={setBasicInfo}
                  basicInfo={basicInfo}
                  onBack={handleBack}
                  onNext={handleNext}
                />
              )}
              {activeStep === 1 && (
                <AdvancedInfoTab basicInfo={basicInfo} onBack={handleBack} />
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default CreateCourse;
