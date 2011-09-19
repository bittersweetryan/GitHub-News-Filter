var filterObj = (function(){
	var filterObj;
	var newsItems = []; //grab references to all the elements
	var hiddenClasses = [];
	var moreLink ;
	var visibleCount = 30;
	var filterObjects = [];

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

	var getNewsItems = function(){
		var items = getElementsByClass("div","alert");
		var len = items.length;
		var newsLength = newsItems.length;
		var found = false;

		for(var i = 0; i < len; i++){
				
			//check that the items isn't in the list
			for(var x; x < newsLength; x++)	{
				if(newsItems[x] === items[i]){
					found = true;
					break;
				}
			}
			
			if(!found){
				newsItems.push(items[i]);
			}
		}
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
			
			filterObjects.push(newFilterOption);

			filterObj.appendChild(newFilterWrapper);
		}
	};

	var addListener = function(elem){
		elem.addEventListener("change",function(){

			var newsObjects = newsItems;
			var len = newsObjects.length;
			var i;

			if(elem.checked === true){
				console.log("ranchange");
				//loop through the elements array instead
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
		});	
	};

	var getMoreLink = function(){
		var moreDiv = getElementsByClass('div',"ajax_paginate")[0];
		moreLink = moreDiv.firstChild;

		moreLink.addEventListener("click",
			function(e){
				var i = 0			
					
				var intervalID = window.setInterval(function(){
					i++;
					console.log(i);
					runFilters();
					
					if( i === 20 ){
						window.clearInterval(intervalID);
						i = 0;
					}

				},200);

		});

		console.log(moreLink);
	};

	var runFilters = function(){
		len = filterObjects.length;

		for(var i = 0; i < len; i++){
			if(filterObjects[i].checked === true){
				var evt = document.createEvent("HTMLEvents");
				evt.initEvent("change", false, true);
				filterObjects[i].dispatchEvent(evt);
				//filterObjects[i].onchange();
			}
		}

	}

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

filterObj.Init();
