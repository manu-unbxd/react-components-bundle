import React from "react";
import Accordian from "./Accordian";

export const SimpleUsage = () => {
    const items = [{
        id: 1,
        titleComponent: <div>Title 1</div>,
        bodyComponent: <div>This is accordian 1 body</div>
    }, {
        id: 2,
        titleComponent: <div>Title 2</div>,
        bodyComponent: <div>This is accordian 2 body</div>
    }, {
        id: 3,
        titleComponent: <div>Title 3</div>,
        bodyComponent: <div>This is accordian 3 body</div>
    }, {
        id: 4,
        titleComponent: <div>Title 4</div>,
        bodyComponent: <div>This is accordian 4 body</div>
    }];

    return <Accordian items={items} />;
};

export default {
    title: "Accordian"
};