import React from "react";
import Form from "../Form";
import Dropdown from "../Dropdown";
import Input from "../Input";
import Textarea from "../Textarea";
import RadioList from "../RadioList";
import Checkbox from "../Checkbox";
import Toggle from "../Toggle";
import RangeSlider from "../RangeSlider";
import Button, { ButtonAppearance } from "../../Button";
import { FRUITS_LIST } from "../../../../public/Constants";

const formValues = {
    email: "anuhosad@gmail.com",
    description: "This is some temporary description",
    yesNoOption: "NO",
    fruits: ["pineapple"],
    fruit: FRUITS_LIST.find(obj => obj.id === 4),
    isActive: true,
    price: 75
};

export const FormExample = () => {
    const onSubmit = formData => {
        const { data } = formData;
    
        console.log("Selected Data: ", data);
    };

    return (<Form onSubmit={onSubmit}>
        <Input defaultValue={formValues["email"]}
            type="text"
            name="email"
            label="Name"
            placeholder="Enter your email"
            appearance="block"
        />
        <Textarea defaultValue={formValues["description"]} 
          name="description"
          label="Description"
          placeholder="Enter your description"
          appearance="block"
        />
        <RadioList defaultValue={formValues["yesNoOption"]} 
          name="yesNoOption"
          label="Are you sure?"
          options={[
            { id: "YES", name: "Yes" },
            { id: "NO", name: "No" },
          ]}
          appearance="block"
        />
        <Checkbox name="orange" label="Orange" defaultValue={formValues["fruits"].includes("orange")}/>
        <Checkbox name="pineapple" label="Pineapple" defaultValue={formValues["fruits"].includes("pineapple")} />
        <Checkbox name="grapes" label="Grapes" defaultValue={formValues["fruits"].includes("grapes")} />
        <br />
        <Dropdown name="fruit"  defaultValue={formValues["fruit"]} label="Select fruit" options={FRUITS_LIST} appearance="block" />
        <Toggle name="isActive" defaultValue={formValues["isActive"]} label="Is Active?" appearance="block" />
        <RangeSlider defaultValue={formValues["price"]} 
          name="price"
          label="Select price range"
          min="10"
          max="100"
          appearance="block"
        />
        <Button appearance={ButtonAppearance.PRIMARY} className="full-width-btn">Submit</Button>
    </Form>);
};

FormExample.story = {
    name: "Form"
}

export default {
    title: "Form|Form",
    parameters: {
        info: {
            propTables: [Form],
        },
    },
};
