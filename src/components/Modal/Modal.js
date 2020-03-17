import React, { forwardRef, useState, useImperativeHandle, useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

const ModalContent = (props) => {
    const {
        className,
        children,
        title,
        titleComponent,
        showClose,
        showHeader,
        hideModal
    } = props;

    return (<div className={`RCB-modal ${className}`}>
        <div className="RCB-modal-body">
            {showHeader && <div className="RCB-modal-header">
                <span className="RCB-modal-title">{titleComponent ? titleComponent : title}</span>
                {showClose && <span className="RCB-modal-close" onClick={hideModal}></span>}
            </div>}
            <div className="RCB-modal-content">{children}</div>
        </div>
    </div>);
};

ModalContent.propTypes = {
    /** Pass any additional classNames to Modal component */
    className: PropTypes.string,
    title: PropTypes.string,
    titleComponent: PropTypes.element,
    showClose: PropTypes.bool,
    showHeader: PropTypes.bool,
    hideModal: PropTypes.func
};

/** Displays a full screen modal */
let Modal = (props, ref) => {
    const { isOpen, onClose, ...restProps } = props;
    const [ isModalOpen, setIsModalOpen ] = useState(isOpen);
    const bodyElement = document.getElementsByTagName("body")[0];

    const showModal = () => {
        setIsModalOpen(true);
    };

    const hideModal = () => {
        setIsModalOpen(false);
        if (typeof(onClose) === "function") {
            onClose();
        }
    };

    useEffect(() => {
        setIsModalOpen(isOpen);
    }, [isOpen]);

    /* add methods that can be accessed via this component's ref */
    useImperativeHandle(ref, () => ({
        showModal: showModal,
        hideModal: hideModal
    }));

    return isModalOpen ? ReactDOM.createPortal(
        <ModalContent {...restProps} hideModal={hideModal} />,
        bodyElement
    ) : null;
};

Modal = forwardRef(Modal);

Modal.propTypes = {
    /** Pass any additional classNames to Modal component */
    className: PropTypes.string,
    /** Header or title for the modal */
    title: PropTypes.string,
    /** Component to render as modal title. This will be given preference over "title" prop */
    titleComponent: PropTypes.element,
    /** indicates if the modal should be opened by default */
    isOpen: PropTypes.bool,
    /** indicates whether to show or hide the close button */
    showClose: PropTypes.bool,
    /** indicates whether to show or hide the modal header */
    showHeader: PropTypes.bool,
    /** callback function that gets called when the modal closes */
    onClose: PropTypes.func
};

Modal.defaultProps = {
    className: "",
    title: "",
    isOpen: false,
    showClose: true,
    showHeader: true
};

Modal.displayName = "Modal";

export default Modal;
