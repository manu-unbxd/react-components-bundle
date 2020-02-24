import React, { useState, useEffect } from "react";
import dataLoader from "./dataLoader";
import List from "../components/List";

dataLoader.addRequestConfig("getUsers", {
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/users",
});

dataLoader.addRequestConfig("getTodo", {
    method: "GET",
    url: function(params) {
        return `https://jsonplaceholder.typicode.com/todos/${params.todoId}`
    }
});

dataLoader.addRequestConfig("getPost", {
    method: "GET",
    url: function(params) {
        return `https://jsonplaceholder.typicode.com/posts/${params.id}`
    }
});

export const SimpleUsage = () => {
    const [ data, setData ] = useState([]);

    useEffect(() => {
        const def = dataLoader.getRequestDef({
            requestId: "getUsers"
        });
    
        def.done((response) => {
            setData(response);
        });
    
        def.catch((e) => {
            console.error(e);
        });
    }, []);

    return (<div>
        <p>Use the <code>dataLoader</code> instance to make explicit API calls. 
        This would mostly be required for create/update/delete calls like POST, PUT, PATCH or DELETE</p>
        {(data && data.length > 0) && <List items={data} />}
    </div>);
};

export const RequestMiddleware = () => {
    const [ data, setData ] = useState([]);
    const { title } = data;

    useEffect(() => {
        dataLoader.addMiddleware("getTodo", {
            requestParser: function(requestId, params) {
                return {
                    todoId: params.id
                };
            }
        });

        const def = dataLoader.getRequestDef({
            requestId: "getTodo",
            params: {
                id: 1
            }
        });
    
        def.done((response) => {
            setData(response);
        });
    
        def.catch((e) => {
            console.error(e);
        });
    }, []);

    return (<div>
        <p>Use the <code>addMiddleware</code> functionality to add request middleware code to parse/modify the request data before sending it to the API.</p>
        <div>Todo name is {title}</div>
    </div>);
};

export const ResponseMiddleware = () => {
    const [ data, setData ] = useState([]);
    const { postName } = data;

    useEffect(() => {
        dataLoader.addMiddleware("getPost", {
            responseParser: function(requestId, response) {
                return {
                    postName: response.title
                };
            }
        });

        const def = dataLoader.getRequestDef({
            requestId: "getPost",
            params: {
                id: 1
            }
        });
    
        def.done((response) => {
            setData(response);
        });
    
        def.catch((e) => {
            console.error(e);
        });
    }, []);

    return (<div>
        <p>Use the <code>addMiddleware</code> functionality to add response middleware code to parse/modify the response data before using it in the component</p>
        <div>Post name is {postName}</div>
    </div>);
};

export default {
    title: "Data fetching|dataLoader (instance)"
};
