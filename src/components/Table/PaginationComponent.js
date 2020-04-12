import React from "react";
import PropTypes from "prop-types";
import Dropdown from "../Form/Dropdown";
import utils from "../../core/utils";

const PaginationComponent = (props) => {
    const {
        pageSizeList,
        pageConfig,
        onPageConfigChanged
    } = props;

    const { perPageCount, pageNo, total } = pageConfig;

    const SelectionSummary = () => {
        const pagIndex = utils.getPagIndex(pageConfig);
        const { start, end } = pagIndex;
        const summaryString = `${start + 1}-${end}`;
    
        return (<div>{summaryString}<span className="RCB-select-arrow"></span></div>);
    }

    const onPerPageChanged = (perPageObj) => {
        const perPage = +(perPageObj.id);
        onPageConfigChanged({
            ...pageConfig,
            pageNo: 1,
            perPageCount: perPage,
        });
    };

    const changePage = (moveUnit) => {
        onPageConfigChanged({
            ...pageConfig,
            pageNo: pageNo + moveUnit
        });
    };

    let isLeftNavDisbaled = (pageNo <= 1);
    let isRightNavDisbaled = (pageNo >= Math.ceil(total / +perPageCount));

    return (<div className="RCB-paginate-wrapper">
        <Dropdown name="perPageCount" showSearch={false}
            showLabel={false} className="RCB-per-page-count" 
            options={pageSizeList} 
            onChange={onPerPageChanged} 
            SelectionSummary={SelectionSummary} />{`of ${total}`}
        <div className="RCB-paginate-nav">
            <a href="javacsript:void(0)" className={`RCB-page-nav ${isLeftNavDisbaled ? "disabled" : ""}`}
                onClick={() => changePage(-1)}>
                {"<"}
            </a>
            <a href="javacsript:void(0)" className={`RCB-page-nav ${isRightNavDisbaled ? "disabled" : ""}`}
                onClick={() => changePage(1)}>
                {">"}
            </a>
        </div>
    </div>)
};

PaginationComponent.propTypes = {
    pageSizeList: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string
    })),
    pageConfig: PropTypes.object,
    onPageConfigChanged: PropTypes.func.isRequired
};

export default PaginationComponent;