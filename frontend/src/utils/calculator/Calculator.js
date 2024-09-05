import React, { useState, useEffect, useRef } from "react";
import { Button, Grid, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import PercentIcon from "@mui/icons-material/Percent";
import CloseIcon from "@mui/icons-material/Close";

import * as math from "mathjs"; // Import math.js for safer evaluation
import { useTheme } from "@emotion/react";

const AnimatedButton = styled(Button)(({ theme, animate }) => ({
  fontSize: "1.25rem",
  borderRadius: "8px",
  padding: "0",
  backgroundColor: "rgb(255, 149, 27)",
  color: "#fff",
  width: "100%",
  height: "60px",
  transition: "transform 0.1s ease-in-out",
  transform: animate ? "scale(0.95)" : "scale(1)",
  "&:hover": {
    backgroundColor: "rgb(255, 124, 0)",
  },
}));

const CloseButton = styled(Button)(({ theme }) => ({
  position: "absolute",
  top: "12px",
  right: "12px",
  color: "#fff",
  backgroundColor: "grey",
  borderRadius: "50%",
  width: "30px",
  height: "30px",
  minWidth: "24px",
  padding: 0,
  "&:hover": {
    backgroundColor: "rgb(255, 45, 36)",
  },
}));

const Calculator = ({ onClose }) => {
  const theme = useTheme(); // Get the theme
  const calculatorRef = useRef(null);

  const [input, setInput] = useState("");
  const [animatedButton, setAnimatedButton] = useState(null);

  const handleButtonClick = (value) => {
    setInput((prevInput) => prevInput + value);
    triggerAnimation(value);
  };

  const handleClear = () => {
    setInput("");
    triggerAnimation("C");
  };

  const handleCalculate = () => {
    try {
      const result = math.evaluate(input);

      if (result === undefined || result === null) {
        throw new Error("Invalid expression");
      }

      setInput(result.toString());
    } catch (error) {
      console.error("Calculation error:", error);
      setInput("Error");
    }
    triggerAnimation("=");
  };

  const handleBackspace = () => {
    setInput((prevInput) => prevInput.slice(0, -1));
    triggerAnimation("Backspace");
  };

  const handleKeyPress = (event) => {
    const key = event.key;

    if (/[0-9]/.test(key)) {
      handleButtonClick(key);
    } else if (["/", "*", "-", "+"].includes(key)) {
      handleButtonClick(key);
    } else if (key === "Enter") {
      handleCalculate();
    } else if (key === "Backspace") {
      handleBackspace();
    } else if (key === "Escape") {
      handleClear();
    }
  };

  const triggerAnimation = (button) => {
    setAnimatedButton(button);
    setTimeout(() => setAnimatedButton(null), 100);
  };

  const handleClose = () => {
    onClose();
  };

  // Drag functionality
  const handleMouseDown = (e) => {
    const calculator = calculatorRef.current;
    if (!calculator) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const { offsetLeft, offsetTop } = calculator;

    const handleMouseMove = (e) => {
      calculator.style.left = `${offsetLeft + e.clientX - startX}px`;
      calculator.style.top = `${offsetTop + e.clientY - startY}px`;
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <Box
      id="calculator"
      ref={calculatorRef}
      sx={{
        maxWidth: "360px",
        margin: "auto",
        padding: "24px",
        paddingTop: "50px",
        borderRadius: "12px",
        boxShadow: "0 6px 12px rgba(0,0,0,0.2)",
        backgroundColor: "#ffffff",
        position: "fixed", // Ensure it's fixed relative to the viewport
        top: "50px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: theme.zIndex.drawer + 10, // Set z-index higher than the mini-drawer
        cursor: "move", // Show a move cursor
      }}
      onMouseDown={handleMouseDown} // Add drag functionality
    >
      <CloseButton onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </CloseButton>
      <Typography
        sx={{
          textAlign: "right",
          padding: "16px",
          fontSize: "2rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
          marginBottom: "16px",
          backgroundColor: "#f5f5f5",
          overflow: "hidden",
        }}
      >
        {input || "0"}
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <AnimatedButton
            animate={animatedButton === "C"}
            onClick={handleClear}
          >
            C
          </AnimatedButton>
        </Grid>
        <Grid item xs={3}>
          <AnimatedButton
            animate={animatedButton === "Backspace"}
            onClick={handleBackspace}
          >
            <KeyboardBackspaceIcon />
          </AnimatedButton>
        </Grid>
        <Grid item xs={3}>
          <AnimatedButton
            animate={animatedButton === "%"}
            onClick={() => handleButtonClick("%")}
          >
            <PercentIcon />
          </AnimatedButton>
        </Grid>
        <Grid item xs={3}>
          <AnimatedButton
            animate={animatedButton === "/"}
            onClick={() => handleButtonClick("/")}
          >
            /
          </AnimatedButton>
        </Grid>
        <Grid item xs={3}>
          <AnimatedButton
            animate={animatedButton === "7"}
            onClick={() => handleButtonClick("7")}
          >
            7
          </AnimatedButton>
        </Grid>
        <Grid item xs={3}>
          <AnimatedButton
            animate={animatedButton === "8"}
            onClick={() => handleButtonClick("8")}
          >
            8
          </AnimatedButton>
        </Grid>
        <Grid item xs={3}>
          <AnimatedButton
            animate={animatedButton === "9"}
            onClick={() => handleButtonClick("9")}
          >
            9
          </AnimatedButton>
        </Grid>
        <Grid item xs={3}>
          <AnimatedButton
            animate={animatedButton === "*"}
            onClick={() => handleButtonClick("*")}
          >
            <CloseIcon />
          </AnimatedButton>
        </Grid>
        <Grid item xs={3}>
          <AnimatedButton
            animate={animatedButton === "4"}
            onClick={() => handleButtonClick("4")}
          >
            4
          </AnimatedButton>
        </Grid>
        <Grid item xs={3}>
          <AnimatedButton
            animate={animatedButton === "5"}
            onClick={() => handleButtonClick("5")}
          >
            5
          </AnimatedButton>
        </Grid>
        <Grid item xs={3}>
          <AnimatedButton
            animate={animatedButton === "6"}
            onClick={() => handleButtonClick("6")}
          >
            6
          </AnimatedButton>
        </Grid>
        <Grid item xs={3}>
          <AnimatedButton
            animate={animatedButton === "-"}
            onClick={() => handleButtonClick("-")}
          >
            <RemoveIcon />
          </AnimatedButton>
        </Grid>
        <Grid item xs={3}>
          <AnimatedButton
            animate={animatedButton === "1"}
            onClick={() => handleButtonClick("1")}
          >
            1
          </AnimatedButton>
        </Grid>
        <Grid item xs={3}>
          <AnimatedButton
            animate={animatedButton === "2"}
            onClick={() => handleButtonClick("2")}
          >
            2
          </AnimatedButton>
        </Grid>
        <Grid item xs={3}>
          <AnimatedButton
            animate={animatedButton === "3"}
            onClick={() => handleButtonClick("3")}
          >
            3
          </AnimatedButton>
        </Grid>
        <Grid item xs={3}>
          <AnimatedButton
            animate={animatedButton === "+"}
            onClick={() => handleButtonClick("+")}
          >
            <AddIcon />
          </AnimatedButton>
        </Grid>
        <Grid item xs={6}>
          <AnimatedButton
            animate={animatedButton === "0"}
            onClick={() => handleButtonClick("0")}
          >
            0
          </AnimatedButton>
        </Grid>
        <Grid item xs={3}>
          <AnimatedButton
            animate={animatedButton === "."}
            onClick={() => handleButtonClick(".")}
          >
            .
          </AnimatedButton>
        </Grid>
        <Grid item xs={3}>
          <AnimatedButton
            animate={animatedButton === "="}
            onClick={handleCalculate}
          >
            =
          </AnimatedButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Calculator;
