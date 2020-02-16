import React from "react";
import Form from "../Form";
import Textarea from "../Textarea";
import Button, { ButtonAppearance } from "../../Button";

export const _Textarea = () => {
    const onSubmit = formData => {
      const { data } = formData;
  
      console.log("Submitted data: ", data);
    };
  
    return (
      <Form onSubmit={onSubmit}>
        <Textarea
          name="description"
          label="Description"
          placeholder="Enter your description"
          appearance="block"
        />
        <Button appearance={ButtonAppearance.PRIMARY} className="full-width-btn">
          Submit
        </Button>
      </Form>
    );
};
  
_Textarea.story = {
    parameters: {
      info: {
        propTables: [Textarea],
      },
    },
};

export default {
    title: "Form|Textarea",
    parameters: {
        info: {
            propTables: [Textarea]
        }
    }
};