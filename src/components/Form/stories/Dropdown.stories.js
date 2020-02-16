import React from "react";
import { FRUITS_LIST } from "../../../../public/Constants";
import Dropdown from "../Dropdown";

export default {
  title: "Dropdown",
};

export const SimpleUsage = () => {
  const onChange = selectedFruit => {
    console.log("Selected Fruit: ", selectedFruit);
  };

  return (
    <Dropdown
      name="fruit"
      label="Select a fruit"
      options={FRUITS_LIST}
      halign="right"
      appearance="block"
      onChange={onChange}
      noSelectionLabel="Select"
    />
  );
};

SimpleUsage.story = {
  name: "Simple Usage ",

  parameters: {
    info: {
      propTables: [Dropdown],
    },
  },
};
