import React from "react";
import Form from "../Form";
import Checkbox from "../Checkbox";
import Button, { ButtonAppearance } from "../../Button";

export const _Checkbox = () => {
    const onSubmit = formData => {
      const { data } = formData;
  
      console.log("Submitted data: ", data);
    };
  
    return (
      <Form onSubmit={onSubmit}>
        <Checkbox name="orange" label="Orange" />
        <Checkbox name="pineapple" label="Pineapple" value={true} onChange={()=>{}} />
        <Checkbox name="grapes" label="Grapes" />
        <br />
        <Button appearance={ButtonAppearance.PRIMARY} className="full-width-btn">
          Submit
        </Button>
      </Form>
    );
};
  
_Checkbox.story = {
    parameters: {
        info: {
            propTables: [Checkbox]
        }
    },
};

export default {
    title: "Form|Checkbox",
    parameters: {
        info: {
            propTables: [Checkbox]
        }
    }
};