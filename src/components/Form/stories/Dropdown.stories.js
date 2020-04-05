import React from "react";
import { FRUITS_LIST } from "../../../../public/Constants";
import Dropdown from "../Dropdown";
import dataLoader from "../../../core/dataLoader";

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
        halign="left"
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
    }
};

dataLoader.addRequestConfig("getPaginatedUsers", {
    method: "GET",
    url: "https://reqres.in/api/users",
});

export const PaginatedDropdown = () => {
    const onChange = selected => {
        console.log("Selected User: ", selected);
    };

    const responseFormatter = (response) => {
        return {
            ...response,
            entries: response.data
        };
    };
  
    return (
      <Dropdown
        paginationType="SERVER"
        requestId="getPaginatedUsers"
        pageSize={3}
        maxHeight={50}
        name="user"
        label="Select user"
        appearance="block"
        nameAttribute="first_name"
        onChange={onChange}
        noSelectionLabel="Select"
        responseFormatter={responseFormatter}
      />
    );
  };

PaginatedDropdown.story = {
    name: "Dropdown with server side pagination",
  
    parameters: {
      info: {
        propTables: [Dropdown],
      },
    },
};
