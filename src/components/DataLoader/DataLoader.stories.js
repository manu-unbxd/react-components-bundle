import React from "react";
import DataLoader from "./DataLoader";
import dataLoader from "../../core/dataLoader";

export default {
  title: "DataLoader",
};

export const SimpleUsage = () => {
  dataLoader.addRequestConfig("getTodos", {
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/todos",
  });

  const onDataLoaded = ([todos]) => {
    console.log(todos);
  };

  const onDataFailed = e => {
    console.log("Error ", e);
  };

  const requests = [
    {
      requestId: "getTodos",
    },
  ];

  return (
    <DataLoader requests={requests} onDataLoaded={onDataLoaded} onDataFailed={onDataFailed}>
      <div>Received the data</div>
    </DataLoader>
  );
};

export const FunctionUrl = () => {
  dataLoader.addRequestConfig("getTodoById", {
    method: "GET",
    url: function(params) {
      return `https://jsonplaceholder.typicode.com/todos/${params.id}`;
    },
  });

  const onDataLoaded = ([todo]) => {
    console.log(todo);
  };

  const onDataFailed = e => {
    console.log("Error ", e);
  };

  const requests = [
    {
      requestId: "getTodoById",
      params: {
        id: 1,
      },
    },
  ];

  return (
    <DataLoader requests={requests} onDataLoaded={onDataLoaded} onDataFailed={onDataFailed}>
      <div>Recieved todo data</div>
    </DataLoader>
  );
};

FunctionUrl.story = {
  name: "Function URL",
};
