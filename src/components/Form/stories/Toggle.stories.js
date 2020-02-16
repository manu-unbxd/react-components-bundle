import React from "react";
import Toggle from "../Toggle";

export default {
  title: "Toggle",
};

export const SimpleUsage = () => {
  const onChange = isActive => {
    console.log("isActive: ", isActive);
  };

  return <Toggle label="Is Active?" name="isActive" appearance="block" onChange={onChange} />;
};
