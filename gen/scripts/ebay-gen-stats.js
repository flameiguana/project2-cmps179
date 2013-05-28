//See 
//http://developer.ebay.com/Devzone/finding/HowTo/GettingStarted_JS_NV_JSON/GettingStarted_JS_NV_JSON.html

/*****************************************************************************/
/** Define a global variable *************************************************/
/*****************************************************************************/
var EBAY_SEARCH = {
	resultSize: 100
};
var  _isFirstItem = true;
var _firstCategory;
var _maxPages = 20;
var _average = [];
var _keywords;
var _items;
var _sortedItems;
var _links;

function makeThatAjaxrequest(name, text) {
    // fire off the request to /form.php
    var request = $.post("scripts/create-file.php",
                         { text: text,
                           filename: name
                         });

    // callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        // log a message to the console
        console.log("Ajax request succesful!");
        //alert(response);
    });

    // callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
        // log the error to the console
        console.error(
            "The following error occured: "+
            textStatus, errorThrown
        );
    });
}


//gets rid of the empty subarrays
function clipArray(percentiles) {
	var lassie = [];
	for (var i = 0; i < percentiles.length; i++) {
		if (percentiles[i].length != 0) {
			lassie.push(percentiles[i]);
		}
	}
	return lassie;
}
/**
 * Communicate with the eBay servers using A GET request.
 * A GET request is a base url that is appended by a series of key/value pairs.
 * The base URL is separated from the request by a '?'.
 * Each key/value pair is specified by: key=value.
 * Key/value pairs are separated by an '&'
 * 
 * @param query
 * @returns
 */
function getFindUrl(query, pageNumber, operationName) {
	if (pageNumber == undefined) {
		//page numbers start at 1
		pageNumber = 1;
	}
	
	// Base url
	var url = "http://svcs.ebay.com/services/search/FindingService/v1";
	
	// GET parameters
	url += "?OPERATION-NAME="+operationName;
	url += "&SERVICE-VERSION=1.0.0";
	url += "&SECURITY-APPNAME=" + appId;
	url += "&GLOBAL-ID=EBAY-US";
	url += "&RESPONSE-DATA-FORMAT=JSON";

	//specific parameters
	url += "&callback=processResults";
	url += "&REST-PAYLOAD";
	url += "&categoryId=" + query;
	url += "&keywords=" + _keywords;
	url += "&paginationInput.entriesPerPage=" + EBAY_SEARCH.resultSize;
	url += "&paginationInput.pageNumber=" + pageNumber;
	
	//filter!
	//url += "&itemFilter[0].name=MaxQuantity";
	url += "&itemFilter[0].value=1";
	
	//outputSelector
	url +="&outputSelector(0)=GalleryInfo";

	return encodeURI(url);
}

/**
 * Actually request the ebay data 
 */
function makeEbayRequest(query, pageNumber, operationName) {
	if (_isFirstItem) {
		_curCategory = _firstCategory;
	}
	if (pageNumber == undefined) {
		//page numbers start at 1
		pageNumber = 1;
	}
	
	// Make sure the query is valid.
	// If it's not, then return without doing anything
	if (!valid(query) && query == undefined) {
		return;
	} 
	
	// Programmatically create a new script tag
	var script = document.createElement('script');
	
	// Create the URL for requesting data from eBay using a GET request
	// and set the src attribute of the newly created script tag to this URL.
	script.src = getFindUrl(query, pageNumber, operationName);
	
	// Add the new tag to the document body which will try to load the script
	// from the URL.
	// eBay will dynamically create a script for us that will load in the
	// attached <script> tag.
	// See the comment in getFindUrl about the callback
	document.body.appendChild(script);
}

/**
 * Returns true if the query is not empty.
 * Note: could be more robust.
 * 
 * @param query
 * @returns {Boolean}
 */
function valid(query) {
	return query != '';
}

/**
 * Clear the input from the text input and remove any content from the
 * results panel.
 */
function clearQuery() {
	$("ebayQueryInput").value = '';
	$("resultsDiv").innerHTML = '';
}
