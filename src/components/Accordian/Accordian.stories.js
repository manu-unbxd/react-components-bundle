import React, { Fragment, useState } from "react";
import Accordian from "./Accordian";

const AccordianBody = () => {
    const [count, setRandomNumber] = useState(1);
    const onSetRandom = ()=>{
        setRandomNumber(Math.round(Math.random()*10))
    }
    return <div style={{padding:'20px'}}>
        <h3>This is accordian body</h3>
        <button onClick={onSetRandom}> changed to {count}</button>
    </div>
}
const AccordianTitle = ({id}) => {
    return <div>
        {`Title ${id}`}
    </div>
}  
export const SimpleUsage = () => {
    const items = [{
        id: "41",
        titleComponent: <AccordianTitle id={'41'}/>,
        bodyComponent: <AccordianBody/>,
    }, {
        id: "42",
        titleComponent: <AccordianTitle id={'42'}/>,
        bodyComponent: <AccordianBody/>
    }, {
        id: "43",
        titleComponent: <AccordianTitle id={'43'}/>,
        bodyComponent: <AccordianBody/>
    }, {
        id: "44",
        titleComponent: <AccordianTitle id={'44'}/>,
        bodyComponent: <AccordianBody/>
    }];
    return <div>
        <Accordian items={items}  />
    </div>
};

SimpleUsage.story = {
    parameters: {
        docs: {
            storyDescription: "Depicts a simple usage of the Accrodian",
        },
    },
};

export const OpenOneItemByDefault = () => {
    const items = [{
        id: "414",
        titleComponent: <AccordianTitle id={'414'}/>,
        bodyComponent: <AccordianBody/>,
    }, {
        id: "424",
        titleComponent: <div>Title 424 </div>,
        bodyComponent: <AccordianBody/>
    }, {
        id: "434",
        titleComponent: <AccordianTitle id={'434'}/>,
        bodyComponent: <AccordianBody/>
    }, {
        id: "444",
        titleComponent: <AccordianTitle id={'444'}/>,
        bodyComponent: <AccordianBody/>
    }];
    return <Accordian items={items} defaultOpen={"414"} />
};

OpenOneItemByDefault.story = {
    parameters: {
        docs: {
            storyDescription: "Open an item by default",
        },
    },
};


export const OpenAllByDefault = () => {
    const items = [{
        id: "14",
        titleComponent: <AccordianTitle id={'14'}/>,
        bodyComponent: <AccordianBody/>,
    }, {
        id: "24",
        titleComponent: <div>Title 24 </div>,
        bodyComponent: <AccordianBody/>
    }, {
        id: "34",
        titleComponent: <AccordianTitle id={'34'}/>,
        bodyComponent: <AccordianBody/>
    }, {
        id: "44",
        titleComponent: <AccordianTitle id={'44'}/>,
        bodyComponent: <AccordianBody/>
    }];
    return <Accordian items={items} defaultOpen={"ALL"} />
};

OpenAllByDefault.story = {
    parameters: {
        docs: {
            storyDescription: "Open an item by default",
        },
    },
};

export default {
    title: 'Accordian'
};