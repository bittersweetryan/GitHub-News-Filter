var filterObj = (function(){
	var filterObj;
	var removedElems = []; //save the elements we remove incase tat filter gets turned off
	var cachedElems = []; //save any extra elements that come from more

	//private
	var filters =  {
		issueComment : {text: "Issue Comment",id: "issues_comment"},
		pullRequest : {text: "Pull Request",id: "pull_request"},
		follow : {text: "Follow",id: "follow"},
		gist : {text: "Gist",id: "gist"},
		push : {text: "Push",id: "push"}
	};
	
	var createDiv =  function(){
			var newDiv = document.createElement("div");
			newDiv.id = "filterDiv";
			newDiv.className = "filterBar";
			
			document.getElementById("footer").appendChild(newDiv);
			
			filterObj = newDiv;
	};
	
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
		
			if(elem.checked === true){
				//this won't work, need to get elements by class name which means another function
				var newsObjects = getElementsByClass("div",elem.value);	
			
				for(var i = 0; i < newsObjects.length; i++){
					console.log(newsObjects[i].style.display);
					
					newsObjects[i].style.display = "none";
					removedElems.push(newsObjects[i]);
				}
			}
		});	
	}

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
	}
		
	//public
	return {
		Init : function(){
			createDiv();
			setFilters();
		}
	};	
}());

window.onload = filterObj.Init();
