import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import List from "../List";

const AccordianItem = (props) => {
    const { itemData } = props;
    const { open, titleComponent, bodyComponent } = itemData;
    const [isOpen, setIsOpen] = useState(open);

    const onItemClick = () => {
        if (typeof open === "undefined") {
            setIsOpen(!isOpen);
        }
        /** Else open and close is controlled by specific elements from the parent Accordian, based on the 'open' prop */
    };

    useEffect(() => {
        setIsOpen(open);
    }, [open]);

    return <div className={`RCB-accordian-item ${isOpen ? "RCB-accordian-open" : "RCB-accordian-close"}`}>
        <div className="RCB-accordian-title" onClick={onItemClick}>{React.cloneElement(titleComponent, { isOpen: isOpen })}</div>        
        {isOpen && <div className="RCB-accordian-body">{bodyComponent}</div>}
    </div>
};

AccordianItem.propTypes = {
    itemData: PropTypes.shape({
        id: PropTypes.string.isRequired,
        titleComponent: PropTypes.instanceOf(Object).isRequired,
        bodyComponent: PropTypes.instanceOf(Object).isRequired,
        open: PropTypes.bool
    }),
    onClick: PropTypes.func
};

const Accordian = (props) => {
    const {
        className,
        items
    } = props;

    return (<div className={`RCB-accordian ${className}`}>
        <List items={items} ListItem={AccordianItem} />    
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