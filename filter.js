var filterObj = {
	
	filters : {
		issueComment : "issues_comment",
		pullRequest : "pull_request",
		follow : "follow",
		gist : "gist",
		push : "push"
	}, 
	
	createDiv : function(){
		var newDiv = document.createElement("div");
		newDiv.id = "filterDiv";
		newDiv.className = "filterBar";
		
		document.getElementById("footer").appendChild(newDiv);
	},
	
	test : function(){
		var theDiv = document.getElementById("filterDiv");
		console.log(theDiv);
	},
}

filterObj.createDiv();
filterObj.test();
