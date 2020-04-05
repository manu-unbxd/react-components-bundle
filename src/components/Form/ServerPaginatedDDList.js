import React, { useState, useEffect } from "react";
import DataLoader from "../DataLoader";
import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";

/* eslint-disable react/prop-types */

export const DefaultDropdownItem = (props) => {
    const { 
        index, 
        style,
        data
    } = props;
    const {
        items,
        isItemLoaded,
        selectItem, 
        selectedItems = [], 
        idAttribute, 
        nameAttribute 
    } = data;

    const itemData = items[index];
    const idValue = itemData[idAttribute];
    const name = itemData[nameAttribute];

    const isSelected = selectedItems.find(obj => obj[idAttribute] === idValue) ? true : false;
    const className = "RCB-list-item " + (isSelected ? "selected" : "");
    let content = name;

    if (!isItemLoaded(index)) {
        content = "Loading...";
    }

    return <div style={style} onClick={() => selectItem(itemData)} className={className}>{content}</div>;
};

const ServerPaginatedDDList = (props) => {
    const { 
        selectedItems, 
        selectItem, 
        idAttribute, 
        nameAttribute, 
        DropdownItem,
        requestId,
        requestParams,
        responseFormatter,
        pageNoKey,
        perPageKey,
        pageSize,
        maxHeight,
        searchAttribute,
        searchQuery
    } = props;
    const [ items, setItems ] = useState([]);
    const [ pageNo, setPageNo ] = useState(1);
    const [ searchBy, setSearchBy ] = useState(searchQuery);
    const [ total, setTotal ] = useState(0);
    const [ hasNextPage, setHasNextPage ] = useState(false);
    const [ isNextPageLoading, setIsNextPageLoading ] = useState(true);

    const requests = [{
        requestId,
        params: {
            [pageNoKey]: pageNo,
            [perPageKey]: pageSize,
            [searchAttribute]: searchBy,
            ...requestParams
        }
    }];

    useEffect(() => {
        /* searh query changed -> reset page no. to 1 */
        setPageNo(1);
        setSearchBy(searchQuery);
    }, [searchQuery]);
        
    const onDataLoaded = ([response]) => {
        let apiResponse = response;

        setIsNextPageLoading(false);

        if (typeof(responseFormatter) === "function") {
            apiResponse = responseFormatter(response);
        }

        let { entries, total }  = apiResponse;
        const totalEntries = [...items, ...entries];

        if (totalEntries.length < total) {
            setHasNextPage(true);
        } else {
            setHasNextPage(false);
        }

        setItems(totalEntries);
        setTotal(total);
    };

    /* Callback to be invoked when more rows must be loaded. It should return a Promise that is resolved once all data has finished loading. */
    const loadNextPage = (startIndex, stopIndex) => {
        console.log("LOADING NEXT PAGE");
        setIsNextPageLoading(true);
        setPageNo(pageNo + 1);
    };


    // If there are more items to be loaded then add an extra row to hold a loading indicator.
    const itemCount = hasNextPage ? items.length + 1 : items.length;
    
    // Only load 1 page of items at a time.
    // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
    const loadMoreItems = isNextPageLoading ? () => {} : loadNextPage;
    
    // Every row is loaded except for our loading indicator row.
    const isItemLoaded = index => !hasNextPage || index < items.length;

    const listProps = {
        selectItem, 
        selectedItems, 
        idAttribute, 
        nameAttribute,
        items,
        isItemLoaded 
    };

    return <DataLoader requests={requests} onDataLoaded={onDataLoaded}>
        <InfiniteLoader
            // Function responsible for tracking the loaded state of each item.
            isItemLoaded={isItemLoaded}
            // Number of rows in list; can be arbitrary high number if actual number is unknown.
            itemCount={total}
            loadMoreItems={loadMoreItems}
            // Minimum number of rows to be loaded at a time; defaults to 10. This property can be used to batch requests to reduce HTTP requests.
            minimumBatchSize={pageSize}
            // Threshold at which to pre-fetch data; defaults to 15. A threshold of 15 means that data will start loading when a user scrolls within 15 rows.
            threshold={pageSize}>

            {({ onItemsRendered, ref }) => (
                <FixedSizeList
                    itemCount={itemCount} itemSize={30}
                    onItemsRendered={onItemsRendered}
                    ref={ref} height={maxHeight} itemData={listProps}>
                        {DropdownItem}
                </FixedSizeList>
            )}

        </InfiniteLoader>
    </DataLoader>
};

ServerPaginatedDDList.defaultProps = {
    DropdownItem: DefaultDropdownItem
};

/* eslint-enable react/prop-types */

export default ServerPaginatedDDList;