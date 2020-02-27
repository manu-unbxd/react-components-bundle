import React, { Fragment, useRef } from "react";
import Form from "../Form";
import Dropdown from "../Dropdown";
import Input from "../Input";
import FileUploader from "../FileUploader";
import DragDropFileUploader from "../DragDropFileUploader";
import Toggle from "../Toggle";
import Button, { ButtonAppearance } from "../../Button";
import { FRUITS_LIST } from "../../../../public/Constants";

export const _Dropdown = () => {
  const onSubmit = formData => {
    const { data } = formData;
    const { fruit } = data;

    console.log("Selected Fruit: ", fruit);
  };

  return (
    <Form onSubmit={onSubmit}>
      <Dropdown name="fruit" label="Select fruit" options={FRUITS_LIST} appearance="block" />
      <Button appearance={ButtonAppearance.PRIMARY} className="full-width-btn">
        Submit
      </Button>
    </Form>
  );
};

_Dropdown.story = {
  name: "Dropdown ",

  parameters: {
    info: {
      propTables: [Dropdown],
    },
  },
};

export const _FileUploader = () => {
  const onSubmit = formData => {
    const { data } = formData;
    const { file } = data;

    console.log("Selected file: ", file[0].name);
  };

  return (
    <Form onSubmit={onSubmit}>
      <FileUploader name="file" appearance="block">
        <a href="javascript:void(0)">Upload File</a>
      </FileUploader>
      <Button appearance={ButtonAppearance.PRIMARY} className="full-width-btn">
        Submit
      </Button>
    </Form>
  );
};

_FileUploader.story = {
  name: "File Uploader ",

  parameters: {
    info: {
      propTables: [FileUploader],
    },
  },
};

export const _DragDropFileUploader = () => {
  const onSubmit = formData => {
    const { data } = formData;
    const { filesList } = data;

    console.log("Selected file: ", filesList[0].name);
  };

  return (
    <Form onSubmit={onSubmit}>
      <DragDropFileUploader name="filesList" appearance="block">
        <div>Drag & drop files into this area</div>
      </DragDropFileUploader>
      <Button appearance={ButtonAppearance.PRIMARY} className="full-width-btn">
        Submit
      </Button>
    </Form>
  );
};

_DragDropFileUploader.story = {
  name: "DragDrop File Uploader ",

  parameters: {
    info: {
      propTables: [DragDropFileUploader],
    },
  },
};

export const _Toggle = () => {
  const onSubmit = formData => {
    const { data } = formData;
    const { isActive } = data;

    console.log("isActive: ", isActive);
  };

  return (
    <Form onSubmit={onSubmit}>
      <Toggle label="Is Active?" name="isActive" appearance="block" />
      <Button appearance={ButtonAppearance.PRIMARY} className="full-width-btn">
        Submit
      </Button>
    </Form>
  );
};

_Toggle.story = {
  name: "Toggle ",

  parameters: {
    info: {
      propTables: [Toggle],
    },
  },
};

export const GetFormData = () => {
    const formRef = useRef();
    const submitFormData = () => {
        const formData = formRef.current.getFormData();
        const { data } = formData;

        console.log("Got data", data);
    };

    return (<Fragment>
        <Form ref={formRef}>
            <Input name="name" label="Enter name" />
            <Input name="email" label="Enter Email ID" />
            <Dropdown name="fruit" label="Select fruit" options={FRUITS_LIST} appearance="block" />
        </Form>
        <Button appearance={ButtonAppearance.PRIMARY} className="full-width-btn" onClick={submitFormData}>Click to submit</Button>
    </Fragment>);
};

export default {
    title: "Form|Miscellanious",
    parameters: {
        info: {
            propTables: [Form],
        },
    },
};
