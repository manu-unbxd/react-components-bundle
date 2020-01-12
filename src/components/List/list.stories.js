import React from "react";

import { FRUITS_LIST } from "../../../public/Constants";
import List from "./List";

export default {
  title: "List",
};

export const SimpleUsage = () => {
  return <List items={FRUITS_LIST} />;
};

export const CustomListItem = () => {
  /* eslint-disable react/prop-types */
  const ListItem = ({ itemData }) => {
    let { name } = itemData;

    return <li>{`Custom ListItem ---> ${name}`}</li>;
  };
  /* eslint-enable react/prop-types */

  return <List items={FRUITS_LIST} ListItem={ListItem} />;
};

CustomListItem.story = {
  name: "Custom ListItem",
};
