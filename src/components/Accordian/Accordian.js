import React, { useState, cloneElement } from "react";
import PropTypes from "prop-types";
import List from "../List";

const ALL = "ALL";

const getDefaultOpenedItems = (items = [], defaultOpen) =>{
    let arr = [];
    if(items.length > 0) {
        items.forEach((item) => {
            const {
                id
            } = item;
            if(id === defaultOpen || defaultOpen === ALL ) {
                arr.push(id)
            }
        })
    }
    return arr;
}

const AccordianItem = (props) => {
    const {
        itemData,
        allowOneOpen,
        openedItems,
        setOpenedItems
    } = props;    
    const { titleComponent, bodyComponent, id } = itemData;
    const isOpen = openedItems.find(item => item === id) ? true: false;
    const onItemClick = () => {
        let newList = [id];
        if(!allowOneOpen) {
            newList = isOpen ? openedItems.filter(item => item !== id) : [...openedItems, id]
        }
        setOpenedItems(newList)
    }
    return <li className={`RCB-accordian-item ${isOpen ? "RCB-accordian-open" : "RCB-accordian-close"}`}>
        <div className="RCB-accordian-title" onClick={onItemClick}>{cloneElement(titleComponent, { isOpen: isOpen })}</div>        
        {isOpen && <div className="RCB-accordian-body">{bodyComponent}</div>}
    </li>
};

AccordianItem.propTypes = {
    itemData: PropTypes.shape({
        id: PropTypes.string.isRequired,
        titleComponent: PropTypes.element.isRequired,
        bodyComponent: PropTypes.element.isRequired,
    }),
    setOpenedItems: PropTypes.func,
    openedItems: PropTypes.array,
    allowOneOpen: PropTypes.bool
};


const Accordian = ({defaultOpen, items, allowOneOpen}) => {
    const defaultOpened = getDefaultOpenedItems(items, defaultOpen);
    const [openedItems, setOpenedItems] = useState(defaultOpened);
    return (<div className={`RCB-accordian`}>
        {
            <List 
                items={items}
                openedItems={openedItems}
                defaultOpen={defaultOpen}
                allowOneOpen={allowOneOpen}
                setOpenedItems={setOpenedItems}
                ListItem={AccordianItem} /> 
        }
    </div>);
};

Accordian.propTypes = {
    defaultOpen: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        titleComponent: PropTypes.element.isRequired,
        bodyComponent: PropTypes.element.isRequired,
    })).isRequired,
    // /* set to false if you want more than one accordian item to be open at a time */
    allowOneOpen: PropTypes.bool
};

Accordian.defaultProps = {
    allowOneOpen: false,
    defaultOpen:"",//"ALL","ID","",
    items:[]
};

export default Accordian;