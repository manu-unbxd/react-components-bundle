import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import List from "../List";

const AccordianItem = (props) => {
    const { itemData, index, hideBorder, clickedIndex } = props;
    const { open, titleComponent, bodyComponent } = itemData;
    const [ isOpen, setIsOpen ] = useState(open);
    
    
    const onItemClick = () => {
        setIsOpen(!isOpen);
        hideBorder(index);
    };

    useEffect(() => {
        setIsOpen(open);
    }, [open]);

    return <div className={`RCB-accordian-item ${isOpen ? "RCB-accordian-open" : "RCB-accordian-close"}`}>
        <div className={`RCB-accordian-title ${(index === (clickedIndex - 1 )) ? "RCB-prev-accordian" : ""}`} onClick={onItemClick}>{titleComponent}</div>
        {isOpen && <div className="RCB-accordian-body">{bodyComponent}</div>}
    </div>
};

AccordianItem.propTypes = {
    itemData: PropTypes.shape({
        titleComponent: PropTypes.instanceOf(Object).isRequired,
        bodyComponent: PropTypes.instanceOf(Object).isRequired,
        open: PropTypes.bool
    }),
    index: PropTypes.number,
    onClick: PropTypes.func,
    hideBorder: PropTypes.func,
    clickedIndex: PropTypes.number
};
  
const Accordian = (props) => {
    const {
        className,
        items
    } = props;

    const [ clickedIndex, setClickedIndex ] = useState(0);

    const hideBorder = (index) => {
        setClickedIndex(index);
    }

    return (<div className={`RCB-accordian ${className}`}>
        <List items={items} ListItem={AccordianItem} hideBorder={hideBorder} clickedIndex={clickedIndex} />
    </div>);
};

Accordian.propTypes = {
    /** Pass any additional classNames to Accordian */
    className: PropTypes.string,
    /** Array of accordian items. Each object in array should contain {id, titleComponent: <Component />, bodyComponent: <Component />} */
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        titleComponent: PropTypes.instanceOf(Object).isRequired,
        bodyComponent: PropTypes.instanceOf(Object).isRequired,
        open: PropTypes.bool
    })).isRequired,
    // /* set to false if you want more than one accordian item to be open at a time */
    // allowOneOpen: PropTypes.bool,
};

Accordian.defaultProps = {
    className: "",
    // allowOneOpen: true
};

export default Accordian;