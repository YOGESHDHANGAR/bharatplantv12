import React from "react";
import "./Loading.css";

const Loading = () => {
  return (
    <div className="loading">
      <div></div>
    </div>
  );
};

// export default Loading;

export default React.memo(Loading);
