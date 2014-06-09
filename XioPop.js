var XioPop = (function() {
	var xiopop, box;
	var closeOnClickOutside;
	
	
	var fog = (function() {
		var div;
		
		function init() {
			div = document.createElement('div');
			div.classList.add("xiopop_fog");
			document.body.appendChild(div);					
		}
		
		function show() {
			if(isVisible()) return;
			div.classList.add("visible");
			setTimeout(function() {
				div.classList.add("dimmed");
			}, 1);
		}
		
		function hide(removeAfterFogHide) {
			div.classList.remove("dimmed");
			
			if(removeAfterFogHide) {
				setTimeout(function() {
					div.classList.remove("visible");
				}, 300);
			}			
		}
		
		function isVisible() {
			return div.classList.contains("visible");
		}
		
		
		function tryToClose(e) {
			if(e.target===div && closeOnClickOutside) {
				close();
			}
		}
		
		
		return {
			init: init,
			show: show,
			hide: hide,
			isVisible: isVisible
		}	
	})();
	
	
	
	
	
	
	
		
	function init() {
		fog.init();
		console.log("Initializing XioPop");
		
		xiopop = document.createElement('div');
		xiopop.id = "xiopop";
		xiopop.addEventListener("click", function(e) {
			if(e.target===xiopop && closeOnClickOutside) {
				close();
			}
		}, false);
		document.body.appendChild(xiopop);
		
			
		box = document.createElement('div');
		box.id = "xiopop_box";
		xiopop.appendChild(box);
	}
	
	
	
	
	
	
	

	
	
	
	function alert(title, text, callback) {
		show();
		box.classList.add("xiopop_alert");
		closeOnClickOutside=false;
		
		var txtTitle = addTitle(title);
		var txtText = addText(text);
	
		var buttonSet = addButtonSet(box);

		var btnOK = document.createElement("button");
		btnOK.type = "button";
		btnOK.textContent = "OK";
		btnOK.addEventListener("click", function(e) {
			close();
			if(callback) callback();
		}, false);
		
		buttonSet.appendChild(btnOK);
		fog.show();
		showBox();
	}
	
	function prompt(title, label, oldText, callback) {
		show();
		box.classList.add("xiopop_prompt");
		closeOnClickOutside=false;
		var txtTitle = addTitle(title);
		
		var form = document.createElement("form");
		form.addEventListener("submit", function(e) {
			e.preventDefault();
			close();
			callback(input.value);
		}, false);
		
		var lblPrompt = document.createElement("label");
		lblPrompt.setAttribute("for", "xiopop_prompt_label");
		lblPrompt.textContent = label;
		form.appendChild(lblPrompt);
		
		
		var input = document.createElement("input");
		input.id = "xiopop_prompt_label";
		input.type = "text";
		input.value = oldText;
		form.appendChild(input);
		
		box.appendChild(form);
		
		var buttonSet = addButtonSet(form);
		
		var btnOK = document.createElement("button");
		btnOK.type = "submit";
		btnOK.textContent = "OK";
		buttonSet.appendChild(btnOK);
		
		var btnCancel = document.createElement("button");
		btnCancel.type = "button";
		btnCancel.textContent = "Cancel";
		btnCancel.addEventListener("click", function(e) {
			close();
			callback(false);
		}, false);
		buttonSet.appendChild(btnCancel);
		
		fog.show();
		showBox();
		input.focus();
	}
	
	
	function confirm(title, text, callback) {
		show();
		box.classList.add("xiopop_confirm");
		closeOnClickOutside=false;
		
		var txtTitle = addTitle(title);
		var txtText = addText(text);
		
		
		var buttonSet = addButtonSet(box);
		
		
		var btnYes = document.createElement("button");
		btnYes.type = "button";
		btnYes.textContent = "Yes";
		btnYes.addEventListener("click", confirmClick, false);
		
		var btnNo = document.createElement("button");
		btnNo.type = "button";
		btnNo.textContent = "No";
		btnNo.addEventListener("click", confirmClick, false);
		
		buttonSet.appendChild(btnYes);
		buttonSet.appendChild(btnNo);
		fog.show();
		showBox();
		
		
		function confirmClick(e) {
			close();
			if(e.target==btnYes) {
				callback(true);
			} else if(e.target==btnNo) {
				callback(false);
			}
		}
	}
	
	
	function load(url, callback) {
		show();
		box.classList.add("xiopop_html");
		closeOnClickOutside=true;
	
		var xhr = new XMLHttpRequest();
		xhr.open("get", url, true);
		
		xhr.onload = function(e) {
			box.innerHTML = e.target.responseText;
			showBox();
			if(callback) callback(e);
		}
		
		xhr.send();			
		fog.show();
	}
	
	
	
	
	function select(items, callback) {
		show();
		box.classList.add("xiopop_select");
		console.log("Show selectlist");
		closeOnClickOutside=true;
		fog.show();
		
		var filter = document.createElement("input");
		filter.type="search";
		filter.addEventListener("keyup", doFilter, false);
		filter.addEventListener("search", doFilter, false);
		
		var list = document.createElement("ul");
		list.classList.add("selectableList");
		list.addEventListener("click", function(e) {
			var target = e.target;
			if(target.nodeName==="LI") {
				callback(items[target.dataset.id]);
				close();
			}		
		});
		for(var i=0; i<items.length; i++) {
			var item = items[i];
			var li = document.createElement("li");
			li.textContent = item.text;
			li.dataset.id = i;
			item.li = li;
			list.appendChild(li);
		}
		
		box.appendChild(filter);
		box.appendChild(list);
		showBox();
		filter.focus();
		
		console.debug(items);
		
		
		
		
		function doFilter(e) {
			if(e && e.which == 13) {
				var first = list.querySelector("li");	
				if(!first) return;
				
				callback(items[first]);
				close();
			} else {
				var searchString = e.target.value.toLowerCase();
				console.log("filter items '"+searchString+"'");
				
				for(var i in items) {
					var item = items[i];
					console.log("Item", item);
					
					if(item.text.toLowerCase().search(searchString)!=-1) {
						item.li.classList.remove('xiopop_hidden');
					} else {
						item.li.classList.add('xiopop_hidden');
					}
				}
			}
		}
	}
	
	
	
	
	function show() {
		document.body.classList.add("xiopop_open");		
	}
	
	
	function showElement(element) {
		show();
		box.classList.add("xiopop_html");
		closeOnClickOutside=true;
		fog.show();
		box.appendChild(element);
		showBox();
	
	}
	
	
	
	
	function showBox() {	
		box.classList.add("visible");
		centerBox();
		addEventListener("resize", winResize, false);
		addEventListener("keydown", keyHandler, false);
	}
	
	
	function keyHandler(e) {
		if(e.keyCode==27 && closeOnClickOutside) {
			close();
		}
	}
	
	
	function close() {
		box.classList.remove("visible");
		box.innerHTML = "";
		
		fog.hide(true);
		removeEventListener("resize", winResize, false);
		document.body.classList.remove("xiopop_open");
	}




	function addTitle(title) {
		var txtTitle = document.createElement("div");
		txtTitle.id = "xiopop_box_title";
		txtTitle.textContent = title;
		box.appendChild(txtTitle);
		return txtTitle;
	}
	
	function addText(text) {
		var txtText = document.createElement("p");
		txtText.innerHTML = text;
		box.appendChild(txtText);
		return txtText;
	}
	
	function addButtonSet(parent) {
		var buttonSet = document.createElement("div");
		buttonSet.classList.add("xiopop_button_set");
		parent.appendChild(buttonSet);
		return buttonSet;
	}
	
	
	
	
	
	function winResize(e) {
		centerBox();
	}
	
	
	function centerBox() {
		var top = (xiopop.offsetHeight - box.offsetHeight) / 2;
		//var left = (xiopop.offsetWidth - box.offsetWidth) / 2;
		if(top<20) top=20;
		//if(left<20) left=20;
		box.style.marginTop = top + "px";
		//box.style.left = left + "px";
	}


	init();
	return {
		close: close,
		alert: alert,
		confirm: confirm,
		prompt: prompt,
		load: load,
		select: select,
		show: show,
		showElement: showElement,
		fog: fog
	}
})();
