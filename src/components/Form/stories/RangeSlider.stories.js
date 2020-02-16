import React from "react";
import Form from "../Form";
import RangeSlider from "../RangeSlider";
import Button, { ButtonAppearance } from "../../Button";

export const _RangeSlider = () => {
    const onSubmit = formData => {
      const { data } = formData;
      const { price } = data;
  
      console.log("Selected price: ", price);
    };
  
    return (
      <Form onSubmit={onSubmit}>
        <RangeSlider
          name="price"
          label="Select price range"
          min="10"
          max="100"
          appearance="block"
          defaultValue="10"
        />
        <Button appearance={ButtonAppearance.PRIMARY} className="full-width-btn">
          Submit
        </Button>
      </Form>
    );
};
  
_RangeSlider.story = {
    name: "Range Slider ",
  
    parameters: {
        info: {
            propTables: [RangeSlider]
        }
    },
};

export default {
    title: "Form|RangeSlider",
    parameters: {
        info: {
            propTables: [RangeSlider],
        }
    }
};