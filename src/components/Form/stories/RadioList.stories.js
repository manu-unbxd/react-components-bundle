import React from "react";
import Form from "../Form";
import RadioList from "../RadioList";
import Button, { ButtonAppearance } from "../../Button";

export const _RadioList = () => {
    const onSubmit = formData => {
      const { data } = formData;
  
      console.log("Submitted data: ", data);
    };
  
    return (
      <Form onSubmit={onSubmit}>
        <RadioList
          name="yesNoOption"
          label="Are you sure?"
          options={[
            { id: "YES", name: "Yes" },
            { id: "NO", name: "No" },
          ]}
          appearance="block"
        />
        <Button appearance={ButtonAppearance.PRIMARY} className="full-width-btn">
          Submit
        </Button>
      </Form>
    );
};
  
_RadioList.story = {
    name: "RadioList",
  
    parameters: {
        info: {
            propTables: [RadioList]
        }
    }
};

export default {
    title: "Form|RadioList",
    parameters: {
        info: {
            propTables: [RadioList]
        }
    }
};