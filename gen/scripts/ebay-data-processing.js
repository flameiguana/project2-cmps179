/**
 * This is the callback referenced in the getFindUrl function defined below.
 * It parses the response from eBay and builds an HTML table to display
 * the search results.
 * 
 * @param root
 */
var cdsCompleted = [];
var recordsCompleted = [];
var cdsAdvanced = [];
var recordsAdvanced = [];
var outputArray = [];
var _totalCountSoldCds = 0;
var _totalCountSoldRecords = 0;
var _totalBidsCds = 0;
var _totalBidsRecords = 0;
function processResults(root) {
	//bail if the result is undefined
	if (root.findCompletedItemsResponse != undefined){
		logCompletedItems(root);
	}
	else if (root.findItemsAdvancedResponse != undefined)
	{
		logAdvancedItems(root);
	}
}

function logCompletedItems(root){
	// get the results or return an empty array if there aren't any.
	_items = root.findCompletedItemsResponse[0].searchResult[0].item || [];

	// create an empty array for building up the html output
	var html = [];
	for ( var i = 0; i < _items.length; ++i) {
		var item = _items[i];
		if(item.primaryCategory[0].categoryName[0] == "CDs")
			cdsCompleted.push(item);
		else if(item.primaryCategory[0].categoryName[0] == "Records")
			recordsCompleted.push(item);
	}	
	// When we're done processing remove the script tag we created below
	var lastChild = document.body.lastChild;
	document.body.removeChild(lastChild);
	
	//page info
	var curPageNumber = root.findCompletedItemsResponse[0].paginationOutput[0].pageNumber[0];
	var totalPages = root.findCompletedItemsResponse[0].paginationOutput[0].totalPages[0];
	
        $("#currentPage").text(curPageNumber);
        $("#totalPages").text(totalPages);
        $("#maxPages").text(_maxPages);
	//if we're not on the last page
	if (curPageNumber != totalPages && curPageNumber != _maxPages) {
        console.log("going again");
		setTimeout(makeEbayRequest(_curCategory, parseFloat(curPageNumber)+1, "findCompletedItems"));	
	}
	//otherwise save the data
	else{
		        console.log("bailed")
       // console.log(cdsCompleted);
        //console.log(recordsCompleted);
        var totalCostCds = 0;
        var totalCostRecords = 0;
        for(var i = 0; i < cdsCompleted.length; i++){
        	totalCostCds += getComp(cdsCompleted[i], 'price');
        	_totalBidsCds += getComp(cdsCompleted[i], 'bids');
        	_totalCountSoldCds++;
        }
        for(var i = 0; i < recordsCompleted.length; i++){
    		totalCostRecords += getComp(recordsCompleted[i], 'price');
    		_totalBidsRecords += getComp(recordsCompleted[i], 'bids');
    		_totalCountSoldRecords++;
        }
        var averageRevenueCds = totalCostCds/cdsCompleted.length;
        var averageRevenueRecords = totalCostRecords/recordsCompleted.length;
        outputArray['averageRevenueCds'] = averageRevenueCds;
        outputArray['averageRevenueRecords'] = averageRevenueRecords;
        makeEbayRequest(_curCategory, 1, "findItemsAdvanced");
	}
}

function logAdvancedItems(root){
	// get the results or return an empty array if there aren't any.
	_items = root.findItemsAdvancedResponse[0].searchResult[0].item || [];

	// create an empty array for building up the html output
	var html = [];
	for ( var i = 0; i < _items.length; ++i) {
		var item = _items[i];
		if(item.primaryCategory[0].categoryName[0] == "CDs")
			cdsAdvanced.push(item);
		else if(item.primaryCategory[0].categoryName[0] == "Records")
			recordsAdvanced.push(item);
	}	
	// When we're done processing remove the script tag we created below
	var lastChild = document.body.lastChild;
	document.body.removeChild(lastChild);
	
	//page info
	var curPageNumber = root.findItemsAdvancedResponse[0].paginationOutput[0].pageNumber[0];
	var totalPages = root.findItemsAdvancedResponse[0].paginationOutput[0].totalPages[0];
	
        $("#currentPage").text(curPageNumber);
        $("#totalPages").text(totalPages);
        $("#maxPages").text(_maxPages);
	//if we're not on the last page
	if (curPageNumber != totalPages && curPageNumber != _maxPages) {
        console.log("going again");
		setTimeout(makeEbayRequest(_curCategory, parseFloat(curPageNumber)+1, "findItemsAdvanced"));	
	}
	//otherwise save the data
	else{
       console.log("bailed")
        var totalCostCds = 0;
        var totalCostRecords = 0;
        for(var i = 0; i < cdsAdvanced.length; i++){
        	_totalBidsCds += getComp(cdsAdvanced[i], 'bids');
        }
        for(var i = 0; i < recordsAdvanced.length; i++){
    		_totalBidsRecords += getComp(recordsAdvanced[i], 'bids');
        }
        var averageRevenueCds = totalCostCds/cdsAdvanced.length;
        var averageRevenueRecords = totalCostRecords/recordsAdvanced.length;
        outputArray['totalBidsRecords'] = _totalBidsRecords;
        outputArray['totalBidsCds'] = _totalBidsCds;
        outputArray['totalCountSoldRecords'] = _totalCountSoldRecords;
        outputArray['totalCountSoldCds'] = _totalCountSoldCds;
        console.log(outputArray);
		//json building
		var j = "{\n";
		j+="'totalBidsRecords': " + _totalBidsRecords + ",\n";
		j+= "'totalBidsCds': " + _totalBidsCds+",\n";
		j+= "'totalCountSoldRecords': " +_totalCountSoldRecords+",\n";
		j+= "'totalCountSoldCds': " + _totalCountSoldCds+",\n";
		j+= "'averageRevenueCds': " +  outputArray['averageRevenueCds'] +",\n";
		j+= "'averageRevenueRecords': " +  outputArray['averageRevenueRecords'] +",\n";
		j+= "'label': '" + _keywords.replace("+", " ") + "'"
		j+="\n}";
		makeThatAjaxrequest(_keywords, j);
        reset();
	}
}

//gets the stat to compare the item by
function getComp(item, type) {
	if (type=='price') 
		return parseFloat(item.sellingStatus[0].currentPrice[0]['__value__']);
	if (type=='bids')
	{
		if(item.sellingStatus[0].bidCount == undefined)
			return 0;
		return parseFloat(item.sellingStatus[0].bidCount[0]);
	}
	return -1;
}

function reset(){
	cdsCompleted = [];
	recordsCompleted = [];
	cdsAdvanced = [];
	recordsAdvanced = [];
	outputArray = [];
	_totalCountSoldCds = 0;
	_totalCountSoldRecords = 0;
	_totalBidsCds = 0;
	_totalBidsRecords = 0;
}