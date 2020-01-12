import React from "react";
import { linkTo } from "@storybook/addon-links";

import { FRUITS_LIST } from "../../../public/Constants";
import InlineModal, { InlineModalActivator, InlineModalBody } from "./InlineModal";
import { List } from "../";

export default {
  title: "InlineModal",

  parameters: {
    info: {
      propTables: [InlineModal, InlineModalActivator, InlineModalBody],
      propTablesExclude: [List],
    },
  },
};

export const SimpleUsage = () => {
  return (
    <InlineModal>
      <InlineModalActivator>
        <div>Select</div>
      </InlineModalActivator>
      <InlineModalBody>
        <List items={FRUITS_LIST} showApp={linkTo("List")} />
      </InlineModalBody>
    </InlineModal>
  );
};

SimpleUsage.story = {
  parameters: {
    info: {
      text: "Displaying a dropdown list of items",
    },
  },
};
