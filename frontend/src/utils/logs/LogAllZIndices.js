import React, { useEffect } from "react";

const LogAllZIndices = () => {
  useEffect(() => {
    const allElements = document.querySelectorAll("*");
    allElements.forEach((el) => {
      const computedStyle = getComputedStyle(el);
      console.log(`Element: ${el.tagName}, zIndex: ${computedStyle.zIndex}`);
    });
  }, []);

  return null;
};

export default LogAllZIndices;
