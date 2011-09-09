var filterObj = (function(){
	var filterObj;
	var newsItems = []; //grab references to all the elements
	var moreLink ;
	var visibleCount = 30;

	//private
	var filters =  {
		issueComment : {text: "Issue Comment",id: "issues_comment"},
		pullRequest : {text: "Pull Request",id: "issues_opened"},
		follow : {text: "Follow",id: "follow"},
		gist : {text: "Gist",id: "gist"},
		push : {text: "Push",id: "push"},
		issueOpened : {text: "Issue Opened", id:"issues_opened"},
		created : {text: "Created Branch", id:"create"},
		issueClosed : {text: "Close Issue", id:"issues_closed"},
		fork: {text: "Forked", id: "fork"},
		watch: {text: "Watch", id: "watch_started"},
		editWiki : {text: "Wiki", id: "gollum"}
	};
	
	var getMoreLink = function(){
		var links = document.getElementById("dashboard").getElementsByTagName("a");
		var pattern = /\/dashboard\/index\/\d/;
		var len = links.length;

		for(var i = 0; i < len; i++){
			if(pattern.test(links[i].href)){
				moreLink = links[i];
				break;
			}
		}
	};

	var getNewsItems = function(){
		newsItems = getElementsByClass("div","alert");
	};

	var createDiv =  function(){
			var newDiv = document.createElement("div");
			newDiv.id = "filterDiv";
			newDiv.className = "filterBar";
			
			document.getElementById("footer").appendChild(newDiv);
			
			filterObj = newDiv;

			createImg();
	};

	var createImg = function(){
		var closeSpan = document.createElement("span");
		var closeImage = document.createElement("img");
		
		closeImage.src = chrome.extension.getURL("assets/close.png");
		closeSpan.className = "closeBtn";

		closeImage.addEventListener("click",function(){
			document.getElementById("filterDiv").style.display = "none";	
		});

		closeSpan.appendChild(closeImage);
		filterObj.appendChild(closeSpan);
	}
	
	var createElement = function(theType, theID, theName, theValue, theAttrs, theClass){
		var newElem = document.createElement(theType);
		var prop; 

		newElem.id = theID || "";
		newElem.name = theName || "";
		newElem.value = theValue || "";
		newElem.className = theClass || "";
		
		for(prop in theAttrs){
			if(theAttrs.hasOwnProperty(prop)){
				newElem[prop] = theAttrs[prop];
			}
		}
		
		return newElem;
	};
	
	var setFilters = function(){
		var prop; 
		
		for(prop in filters){

			var newFilterOption = createElement("input",
												prop,
												prop,
												filters[prop].id,
												{type : "checkbox"});
			addListener(newFilterOption);
			
			var newFilterLabel = createElement("label");
			newFilterLabel.innerHTML = filters[prop].text;  
			
			var newFilterWrapper = createElement("span");


			newFilterWrapper.className = "filterOption";
			newFilterWrapper.appendChild(newFilterLabel);
			newFilterWrapper.appendChild(newFilterOption);
			
			filterObj.appendChild(newFilterWrapper);
		}
	};

	var addListener = function(elem){
		elem.addEventListener("change",function(){

			var newsObjects = newsItems;
			var len = newsObjects.length;
			var i;
			if(elem.checked === true){
				//loop through the elelents array instead
				for(i = 0; i < len; i++){
					if(hasClass(newsObjects[i], elem.value)){
						newsObjects[i].style.display = "none";	
						--visibleCount;
					}
				}
			}
			else{
				for(i = 0; i < len; i++){
					if(hasClass(newsObjects[i], elem.value)){
						newsObjects[i].style.display = "inherit";	
						++visibleCount;
					}
				}	
			}

			if(visibleCount < 30){
				getMoreItems();	
			}
		});	
	};

	var getMoreItems = function(){
	    var oEvent = document.createEvent( "MouseEvents" );
	    oEvent.initMouseEvent("click", true, true,window, 1, 1, 1, 1, 1, false, false, false, false, 0, moreLink);
	    moreLink.dispatchEvent( oEvent );
	};

	//looks like this function and the function below it can be rolled up into a partial
	//application
	var getElementsByClass = function(startTag, theClass){
		
		//if no start tag was specified then get all the elements
		var elements = startTag ? document.getElementsByTagName(startTag) : document.all;
		
		var matches = [];
		var pattern = new RegExp("(^| )" + theClass + "( |$)");
		
		for(var i =0; i< elements.length; i++){
			if(pattern.test(elements[i].className)){
				matches.push(elements[i]);
			}
		}
		
		return matches;
	};
	
	var hasClass = function(elem, theClass){

		var pattern = new RegExp("(^| )" + theClass + "( |$)");	
		return pattern.test(elem.className);
	};

	//public
	return {
		Init : function(){
			createDiv();
			getNewsItems();
			setFilters();
			getMoreLink();
		}
	};	
}());

window.onload = filterObj.Init();
