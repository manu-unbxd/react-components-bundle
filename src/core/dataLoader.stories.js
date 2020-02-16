import React, { useState, useEffect } from "react";
import dataLoader from "./dataLoader";
import List from "../components/List";

dataLoader.addRequestConfig("getUsers", {
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/users",
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

export default {
    title: "Data fetching|dataLoader (instance)"
};
