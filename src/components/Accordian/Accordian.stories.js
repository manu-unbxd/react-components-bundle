import React, { Fragment, useState } from "react";
import Accordian from "./Accordian";


export default {
    title: 'Accordian',
    component: Accordian,
};

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
const Template = (args) => <Accordian {...args} />;

export const Default = Template.bind();
Default.args = {
    items: [{
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
    }],
    defaultOpen:""
};

export const DefaultOpen = Template.bind();
DefaultOpen.args = {
    items: [{
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
    }],
    defaultOpen:"42"
}
