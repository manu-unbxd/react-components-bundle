import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import dataLoader from "../../core/dataLoader";
import utils from "../../core/utils";

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

    const itemData = items[index] || {};
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
        searchQuery,
        getUrlParams,
        serverListClassName,
        ddItemHeight,
        minPageNo,
        delay = 500,
        loadImmediately = true,
        ...restProps
    } = props;
    const [ items, setItems ] = useState([]);
    const [ itemsResetCounter, setItemsResetCounter ] = useState(loadImmediately?1:0);
    const [ total, setTotal ] = useState(null);
    const [ hasNextPage, setHasNextPage ] = useState(false);
    const [ isNextPageLoading, setIsNextPageLoading ] = useState(false);
    const debouncedFn = useRef();
    const getDefaultPageNo = () => {
        return minPageNo ?? 1
    }
    const pageNoRef = useRef(getDefaultPageNo());
    const searchRef = useRef(searchQuery);
        
    const onDataLoaded = (response) => {
        let apiResponse = response;
        setIsNextPageLoading(false);
        if(!loadImmediately && searchRef.current === "") {
            setItems([]);
            setTotal(null);
            return false;
        }

        if (typeof(responseFormatter) === "function") {
            apiResponse = responseFormatter(response);
        }

        let { entries, total = 0 }  = apiResponse;
        
        if (entries === null) {
            entries = [];
        }
        
        const totalEntries = [...items, ...entries];

        if (totalEntries.length < total) {
            setHasNextPage(true);
        } else {
            setHasNextPage(false);
        }
        

        setItems(totalEntries);
        setTotal(total);
    };

    const makeAPICall = () => {
        setIsNextPageLoading(true);
        const def = dataLoader.getRequestDef({
            requestId,
            params: {
                [pageNoKey]: pageNoRef.current,
                [perPageKey]: pageSize,
                ...(searchRef.current && { [searchAttribute] : searchRef.current}),
                ...requestParams
            },
            urlParams: getUrlParams()
        });

        def.done(onDataLoaded);

        return def;
    }

    /* Callback to be invoked when more rows must be loaded. 
        It should return a Promise that is resolved once all data has finished loading.
     */
    const loadNextPage = () => {
        pageNoRef.current = pageNoRef.current + 1;
        return makeAPICall();
    };

    useEffect(() => {
        if(itemsResetCounter >0) {
            makeAPICall();   
        }
           
    }, [itemsResetCounter]);

    useEffect(() => {
        /* searh query changed -> reset page no. to 1 */
        if(searchQuery !== searchRef.current) {
            //setIsNextPageLoading(true);
            searchRef.current = searchQuery;
            startSearch();
        }
    }, [searchQuery]);
    const startSearch = useCallback(()=>{
        if (!debouncedFn.current) {
            debouncedFn.current = utils.debounce(startSearchCallBack, delay);
        }
    
        debouncedFn.current();
    },[]);
    const startSearchCallBack = () => {
        pageNoRef.current = getDefaultPageNo();
        setItems([]);
        setTotal(null);
        setItemsResetCounter((prevItemsResetCounter) =>{
            return prevItemsResetCounter+1
        });
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
        isItemLoaded,
        ...restProps 
    };
    if(total === null) {
        return []
    }
    if (total === 0) {
        return (
            <div className="RCB-no-data">{`No data found`}</div>
        )
    }
    return (<InfiniteLoader
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
                itemCount={itemCount} itemSize={ddItemHeight}
                onItemsRendered={onItemsRendered}
                className={serverListClassName}
                ref={ref} height={maxHeight} itemData={listProps}>
                    {DropdownItem}
            </FixedSizeList>
        )}
    </InfiniteLoader>);
};

ServerPaginatedDDList.propTypes = {
    ddItemHeight: PropTypes.number
};

ServerPaginatedDDList.defaultProps = {
    DropdownItem: DefaultDropdownItem,
    ddItemHeight: 30
};

/* eslint-enable react/prop-types */

export default ServerPaginatedDDList;