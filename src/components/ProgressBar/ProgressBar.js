import React from "react";
import PropTypes from "prop-types";

const ProgressBar = (props) => {
    const { progress, height, className } = props;

    return (<div className={`RCB-progress-bar ${className}`} style={{height: height}}>
        <div className="RCB-progress-value" style={{width: `${progress}%`}}></div>
    </div>);
};

ProgressBar.propTypes = {
    /** Pass any additional classNames to ProgressBar component */
    className: PropTypes.string,
    /** Progress value, must be a value between 1 to 100 */
    progress: function(props, propName, componentName) {
        if (typeof(props[propName]) === "undefined") {
            return new Error(
                "Prop `" + propName + "` is required"
            );
        }

        if (typeof(props[propName]) !== "number") {
            return new Error(
                "Prop `" + propName + "` must be a number"
            );
        }

        if (props[propName] < 0 || props[propName] > 100) {
            return new Error(
                "Invalid prop `" + propName + "` supplied to" +
                " `" + componentName + "`. Value must be between 0 to 100."
            );
        }
    },
    /** Height of the progress bar. Values must be valid CSS height values like 40px or 20% etc. */
    height: PropTypes.string
};

ProgressBar.defaultProps = {
    className: "",
    height: "40px"
};

export default ProgressBar;
