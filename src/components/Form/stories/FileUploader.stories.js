import React from "react";
import FileUploader from "../FileUploader";

export default {
  title: "FileUploader",
};

export const SimpleUsage = () => {
  const onFileChange = (files = []) => {
    console.log("SELECTED FILES");
    for (let i = 0; i < files.length; i++) {
      console.log(files[i].name);
    }
  };

  return (
    <FileUploader name="files" appearance="block" onChange={onFileChange} multiple={true}>
      <a href="javascript:void(0)">Upload File</a>
    </FileUploader>
  );
};
