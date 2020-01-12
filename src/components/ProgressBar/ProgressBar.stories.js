import React from "react";
import ProgressBar from "./ProgressBar";

export default {
  title: "ProgressBar",
};

export const SimpleUsage = () => {
  return (
    <div className="progress-container">
      <ProgressBar progress={40} />
    </div>
  );
};
