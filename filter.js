/*
Copyright (c) 2011 Ryan Anklam

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files 
(the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, 
publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
subject to the following conditions:

NONE

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var filterObj = (function(){
	var filterObj,
		newsItems = [], 
		hiddenClasses = [],
		moreLink,
		visibleCount = 30,
		filterObjects = [],
		filters,
		versionKey = "githubNewsFilterVersion",
		filterKey = "filters";

	//private
	
	var getFilters = function(){
		//check for filters in the local storage, otherwise create a new object	 
		if(!localStorage[filterKey]){
			filters = {
				issueComment : {text: "Issue Comment",id: "issues_comment",checked: false},
				commitComment : {text: "Commit Comment",id: "commit_comment",checked: false},
				pullRequest : {text: "Pull Request & Issue Opened",id: "issues_opened",checked: false},
				follow : {text: "Follow",id: "follow",checked: false},
				gist : {text: "Gist",id: "gist",checked: false},
				push : {text: "Push",id: "push",checked: false},
				created : {text: "Created Branch", id:"create",checked: false},
				issueClosed : {text: "Close & Merge", id:"issues_closed",checked: false},
				fork: {text: "Forked", id: "fork",checked: false},
				watch: {text: "Watch", id: "watch_started",checked: false},
				editWiki : {text: "Wiki", id: "gollum",checked: false}
			};

			localStorage[filterKey] = JSON.stringify(filters);
		}
		else{
			filters = JSON.parse(localStorage[filterKey]);
		}
	};

	var getNewsItems = function(callback){
		var items = document.getElementsByClassName("alert"),
			len = items.length,
			newsLength = newsItems.length,
			found = false,
			currentItem = "";

		for(var i = 0; i < len; i++){
			
			found = false;
			currentItem = items[i];
			//check that the item isnt in the list
			for(var x = 0; x < newsLength; x++)	{
				if(newsItems[x] == currentItem){
					found = true;
					break;
				}
			}
			
			if(!found){
				newsItems.push(items[i]);
			}
		}

		if(callback){
			callback();
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
		var closeSpan = document.createElement("span"),
			closeImage = document.createElement("img");
		
		closeImage.src = chrome.extension.getURL("assets/close.png");
		closeSpan.className = "closeBtn";

		closeImage.addEventListener("click",function(){
			document.getElementById("filterDiv").style.display = "none";	
		});

		closeSpan.appendChild(closeImage);
		filterObj.appendChild(closeSpan);
	};
	
	var createElement = function(theType, theID, theName, theValue, theAttrs, theClass){
		var newElem = document.createElement(theType),
			prop; 

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
			
			if(filters[prop].checked){
				newFilterOption.checked = true;
			}

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

			var newsObjects = newsItems,
				len = newsObjects.length,
				i;

			if(elem.checked === true){
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

			setFilterVal(elem.value,elem.checked);
		});	
	};

	var setFilterVal = function(className,isChecked){
		
		for(filterObj in filters){

			if(filters[filterObj].id === className){
				filters[filterObj]["checked"] = isChecked;
				break;
			}
		}

		localStorage[filterKey] = JSON.stringify(filters);
	};

	var getMoreLink = function(){
		var moreDiv = document.getElementsByClassName("ajax_paginate")[0];
		moreLink = moreDiv.firstChild;

		attachClickListener();
	};

	var attachClickListener = function(){
		moreLink.addEventListener("click",function(){
				var i = 0;							

				var intervalID = window.setInterval(function(){
					i++;

					getNewsItems(runFilters);
					
					if( i === 20 ){
						//reattach the event
						getMoreLink();
						window.clearInterval(intervalID);
					}

				},200);
		});
	};

	var runFilters = function(){
		var len = filterObjects.length;

		for(var i = 0; i < len; i++){

			if(filterObjects[i].checked === true){

				var evt = document.createEvent("HTMLEvents");
				evt.initEvent("change", false, true);
				filterObjects[i].dispatchEvent(evt);
			}
		}

	};
	
	var hasClass = function(elem, theClass){

		var pattern = new RegExp("(^| )" + theClass + "( |$)");	
		return pattern.test(elem.className);
	};

	var checkVersion = function(){
		var storedVersion = localStorage[versionKey],
			currentVersion = manifest.version;

		if(!storedVersion || storedVersion !== currentVersion){
			
			localStorage.removeItem(filterKey);
			localStorage[versionKey] = currentVersion;

			
		}
	};

	var manifest = (function() {
		var manifestObject = false;
		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function() {
		    if (xhr.readyState == 4) {
		        manifestObject = JSON.parse(xhr.responseText);
		    }
		};
		xhr.open("GET", chrome.extension.getURL('/manifest.json'), false);

		try {
		    xhr.send();
		} catch(e) {

		}
		return manifestObject;
	})();

	//public
	return {
		init : function(){
			checkVersion();
			getFilters();
			createDiv();
			getNewsItems();
			setFilters();
			getMoreLink();
			runFilters();
		}
	};	
}());

filterObj.init();
