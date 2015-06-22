var XioPop = (function() {
	var xiopop, box, fog;
	var closeOnClickOutside;
    var KEY_ENTER=13, KEY_ESC=27, KEY_UP=38, KEY_DOWN=40, KEY_LEFT=37, KEY_RIGHT=39, KEY_TAB=9;
	var lastFocus;
	var tabStops;



	function init() {
		if(xiopop) return;

		console.log("Initializing XioPop");

		xiopop = document.createElement('div');
		xiopop.classList.add("xiopop");
		xiopop.addEventListener("click", function(e) {
			if(e.target===xiopop && closeOnClickOutside) {
				close();
			}
		}, false);
		document.body.appendChild(xiopop);

		fog = document.createElement('div');
		fog.classList.add("xiopop_fog");
		xiopop.appendChild(fog);

		box = document.createElement('div');
		box.classList.add("xiopop_box");
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
		showBox();
	}

	function prompt(title, label, oldText, callback) {
		show();
		addClose();
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
		addClose();
		box.classList.add("xiopop_html");
		closeOnClickOutside=true;

		var xhr = new XMLHttpRequest();
		xhr.open("get", url, true);

		xhr.onload = function(e) {
			var content = document.createElement("div");
			content.innerHTML = e.target.responseText;
			box.appendChild(content);
			showBox();
			if(callback) callback(e, content);
		}

		xhr.send();
	}


	function choose(title, text, options, callback) {
		show();
		addClose();
		box.classList.add("xiopop_choose");

		var txtTitle = addTitle(title);
		var txtText = addText(text);

		var list = document.createElement("ul");
		list.classList.add("xiopop_selectableList");
		list.addEventListener("click", function(e) {
			var target = e.target;
			if(target.nodeName==="LI") {
				callback(options[target.dataset.id]);
				close();
			}
		});

		for(var i=0; i<options.length; i++) {
			var item = options[i];
			var li = document.createElement("li");
			li.textContent = item.text;
			li.dataset.id = i;
            if(i===0) li.classList.add("selected");
			item.li = li;
			list.appendChild(li);
		}

		box.appendChild(list);
		showBox();
	}


	function select(options, callback) {
		show();
		box.classList.add("xiopop_select");
		console.log("Show selectlist");
		closeOnClickOutside=true;

		var filter = document.createElement("input");
		filter.type="search";
		filter.addEventListener("keyup", selectKeyHandler, false);
		filter.addEventListener("search", selectKeyHandler, false);

		var list = document.createElement("ul");
		list.classList.add("xiopop_selectableList");
		list.addEventListener("click", function(e) {
			var target = e.target;
			if(target.nodeName==="LI") {
				callback(options[target.dataset.id]);
				close();
			}
		});
        list.addEventListener("mousemove", function(e) {
            var target = e.target;
			if(target.nodeName==="LI") {
                selectItem(target);
            }
        });
		for(var i=0; i<options.length; i++) {
			var item = options[i];
			var li = document.createElement("li");
			li.textContent = item.text;
			li.dataset.id = i;
            if(i===0) li.classList.add("selected");
			item.li = li;
			list.appendChild(li);
		}

		box.appendChild(filter);
		box.appendChild(list);
		showBox();
		filter.focus();


        function selectItem(li) {
            for(var i=0; i<list.children.length; i++) {
                list.children[i].classList.remove("selected");
            }
            li.classList.add("selected");
        }


		function selectKeyHandler(e) {
            switch(e.which) {
                case KEY_ENTER:
                debugger;
                var first = list.querySelector("li");
                if(!first) return;
                callback(options[first]);
                close();
                return;
                break;

                case KEY_UP:
                console.log("UP");
                e.preventDefault();
                return;
                break;

                case KEY_DOWN:
                console.log("DOWN");
                e.preventDefault();
                return;
                break;
            }


            var searchString = e.target.value.toLowerCase();
            console.log("filter options '"+searchString+"'", options);

            for(var i in options) {
                var item = options[i];
                console.log("Item", item);

                if(item.text.toLowerCase().search(searchString)!=-1) {
                    item.li.classList.remove('hidden');
                } else {
                    item.li.classList.add('hidden');
                }
            }
		}
	}




	function show() {
		init();
		box.className = "xiopop_box";
		lastFocus = document.activeElement;
		lastFocus.blur();
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
		setTimeout(function() {
			box.classList.add("visible");
			fog.classList.add("visible");
		}, 1);

		centerBox();
		addEventListener("resize", winResize, false);
		addEventListener("keydown", keyHandler, false);

		document.body.style.overflow = "hidden";

		tabStops = box.querySelectorAll('button, input, textarea, select');
		tabIndex = 0;
	}




	function close() {
		fog.classList.remove("visible");
		box.classList.remove("visible");
		setTimeout(function() {
			xiopop.parentElement.removeChild(xiopop);
			xiopop=null;
			document.body.style.overflow = "";
		}, 300);


		removeEventListener("resize", winResize, false);
		removeEventListener("keydown", keyHandler, false);

	}


	function keyHandler(e) {
		if(e.keyCode===KEY_ESC && closeOnClickOutside) {
			close();
		}

		if(e.keyCode===KEY_TAB) {
			e.preventDefault();
			if(tabStops.length===0) return;
			tabIndex = (tabIndex+(e.shiftKey?-1:1)) % tabStops.length;
			if(tabIndex<0) tabIndex = tabStops.length-1;


			tabStops[tabIndex].focus();


		}
	}


	function addTitle(title) {
		var txtTitle = document.createElement("div");
		txtTitle.classList.add("xiopop_title");
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

	function addClose() {
		var btnClose = document.createElement('button');
		btnClose.classList.add("xiopop_close");
		btnClose.innerHTML = "x";
		btnClose.type="button";
		btnClose.addEventListener("click", close, false);
		box.appendChild(btnClose);
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


	return {
		close: close,
		alert: alert,
		confirm: confirm,
		prompt: prompt,
		load: load,
		choose: choose,
		select: select,
		show: show,
		showElement: showElement,
		center: centerBox
	}
})();
