import { Promise } from "bluebird";
import { fetch as fetchPolyfill } from "whatwg-fetch";
import utils from "./utils";

class DataLoader {
    _requestsMap = {}
    _commonHeaders = {}
    _middlewares = {}
    setCommonHeaders (headers) {
        this._commonHeaders = {...this._commonHeaders, ...headers};
    }
    setResponseParser () {
        
    }
    setRequestParser () {

    }
    addRequestConfig (requestId, requestConfig) {
        this._requestsMap[requestId] = requestConfig;
    }
    getRequestMiddleware (requestId) {
        let requestMiddleware = (x, y) => y, 
            middleware = this._middlewares[requestId];

        if (typeof(middleware) !== "undefined" && typeof(middleware.reqParser) === "function") {
            requestMiddleware = middleware.reqParser;
        }

        return requestMiddleware;
    }
    getResponseMiddleware (requestId) {
        let responseMiddleware = (x, y) => y, 
            middleware = this._middlewares[requestId];

        if (typeof(middleware) !== "undefined" && typeof(middleware.resParser) === "function") {
            responseMiddleware = middleware.resParser;
        }

        return responseMiddleware;
    }
    getRequestParams (requestId, params) {
        const requestParser = this.getRequestMiddleware(requestId);
        return requestParser(requestId, params);
    }
    parseResponseData (requestId, response) {
        const responseParser = this.getResponseMiddleware(requestId);
        return responseParser(requestId, response);
    }
    getRequestDef ({ requestId, params = {}, headers = {} }) {
        const requestConfig = this._requestsMap[requestId];
        const { url, method = "GET" } = requestConfig;
        const finalRequestParams = this.getRequestParams(requestId, params);
        
        let requestUrl = (typeof(url) === "function") ? url(finalRequestParams) : url;
        let reqMethod = method.toLowerCase();

        let requestMetadata = {
            method: (reqMethod === "form_post" || reqMethod === "upload") ? "post" : method,
            headers: {...this._commonHeaders, ...headers}
        };


        if (reqMethod === "get") {
            requestUrl = `${requestUrl}?${utils.getQueryParams(finalRequestParams)}`;
        } else  if (["post", "delete", "put", "patch"].indexOf(reqMethod) > -1) {
            requestMetadata.body = JSON.stringify(finalRequestParams);
        } else if (reqMethod === "form_post" || reqMethod === "upload") {
            const formData = new FormData();
            for (const key in finalRequestParams) {
                formData.append(key, finalRequestParams[key]);
            }
            requestMetadata.body = formData;
        }

        return new Promise((resolve, reject) => {
            return fetchPolyfill(requestUrl, requestMetadata)
                .then(response => response.json())
                .then(json => {
                    const parsedResponse = this.parseResponseData(requestId, json);
                    resolve(parsedResponse);
                })
                .catch(exception => {
                    reject(exception);
                });
        });
    }
    addMiddleware (requestId, { requestParser, responseParser }) {
        if (typeof(this._middlewares[requestId]) !== "undefined") {
            throw new Error(`Middleware for ${requestId} already exists`);
        }

        this._middlewares[requestId] = {
            reqParser: requestParser,
            resParser: responseParser
        };
    }
}

export default new DataLoader();