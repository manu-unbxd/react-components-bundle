import React, { useState, Fragment } from "react";
import Table from "./Table";
import DataLoader from "../DataLoader";
import dataLoader from "../../core/dataLoader";
import { Input } from "../Form";
import { TODOS, FRUITS_LIST } from "../../../public/Constants";

const getFruitsColumnConfigs = () => {
  let columnConfigs = [
    {
      label: "Id",
      key: "id",
    },
    {
      label: "Task Name",
      key: "name",
    },
  ];

  return columnConfigs;
};

const getTodosColumnConfigs = () => {
  let columnConfigs = [
    {
      label: "Id",
      key: "id",
    },
    {
      label: "Task Name",
      key: "title",
    },
    {
      label: "Status",
      key: "completed",
      valueFormatter: function({ value }) {
        return value ? "Completed" : "Not Started";
      },
    },
  ];

  return columnConfigs;
};

const getUsersColumnConfigs = () => {
  let columnConfigs = [
    {
      label: "Avatar",
      key: "avatar",
      /* eslint-disable react/prop-types */
      valueFormatter: function renderUserImage({ value }) {
        return <img src={value} />;
      },
      /* eslint-enable react/prop-types */
    },
    {
      label: "First Name",
      key: "name",
      valueFormatter: function({ record }) {
        const { first_name, last_name } = record;

        return `${first_name} ${last_name}`;
      },
    },
  ];

  return columnConfigs;
};

/* eslint-disable react/prop-types */
const TODODetail = props => {
  const { parentRecord = {} } = props;
  const { id } = parentRecord;
  const [todoData, setTodoData] = useState({});
  const { title, completed } = todoData;

  dataLoader.addRequestConfig("getTodoById", {
    method: "GET",
    url: function(params) {
      return `https://jsonplaceholder.typicode.com/todos/${params.id}`;
    },
  });

  const onDataLoaded = ([todoData]) => {
    setTodoData(todoData);
  };

  const requests = [
    {
      requestId: "getTodoById",
      params: {
        id,
      },
    },
  ];

  return (
    <DataLoader requests={requests} onDataLoaded={onDataLoaded}>
      <div>
        <b>Title:</b> {title}{" "}
      </div>
      <div>
        <b>Status:</b> {completed ? "Completed" : "Not Completed"}{" "}
      </div>
    </DataLoader>
  );
};
/* eslint-enable react/prop-types */

export const SimpleUsage = () => {
  return <Table records={FRUITS_LIST} columnConfigs={getFruitsColumnConfigs()} />;
};

export const ExpandedTable = () => {
  return (
    <Table
      records={TODOS}
      columnConfigs={getTodosColumnConfigs()}
      isExpandableTable={true}
      ExpandedRowComponent={TODODetail}
    />
  );
};

export const TableWithSearch = () => {
    const [ searchBy, setSearchBy ] = useState("");
    
    const onSearchChange = (value) => {
        setSearchBy(value);
    };

    return (<Fragment>
        <Input name="searchBy" onChange={onSearchChange} />
        <Table
            records={TODOS} searchBy={searchBy} searchByKey="title"
            columnConfigs={getTodosColumnConfigs()}
        />
    </Fragment>);
};


export const ServerSideTable = () => {
    const [ searchBy, setSearchBy ] = useState("");

    dataLoader.addRequestConfig("getUsers", {
        method: "GET",
        url: "https://reqres.in/api/users",
    });

    const onSearchChange = (value) => {
        setSearchBy(value);
    };

    const responseFormatter = (response) => {
        return {
            ...response,
            entries: response.data
        };
    };
    
    return (<Fragment>
        <Input name="searchBy" onChange={onSearchChange} />
        <Table
            searchBy={searchBy} searchByKey="search"
            paginationType="SERVER"
            requestId="getUsers"
            perPageKey="per_page"
            responseFormatter={responseFormatter}
            columnConfigs={getUsersColumnConfigs()}
        />
     </Fragment>);
};

export default {
  title: "Table",

  parameters: {
    info: {
      propTablesExclude: [ServerSideTable],
    },
  },
};
