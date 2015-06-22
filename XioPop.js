(function () {
	var KEY_ENTER=13,
		KEY_ESC=27,
		KEY_UP=38,
		KEY_DOWN=40,
		KEY_LEFT=37,
		KEY_RIGHT=39,
		KEY_TAB=9;


	var _ = self.XioPop = function(type, options) {
		var pop = this;

		console.log("Creating xioPop", type, options);

		pop.options = options;
		pop.options.closeOnClickOutside = true;

		pop.xiopop = create('div', {class:"xiopop", appendTo: document.body});
		pop.fog = create('div', {class:"xiopop_fog", onClick: onFogClick, appendTo:pop.xiopop});
		pop.box = create('div', {class:"xiopop_box xiopop_"+type, appendTo:pop.xiopop});

		var btnClose = create('button', {class:"xiopop_close", text:'x', type:'button', onClick:onCloseClick, appendTo: pop.box});


		if(options.title) {
			var txtTitle = create("div", {class:"xiopop_title", text:options.title, appendTo:pop.box});
		}

		if(options.text) {
			var txtText = create("p", {html:options.text, appendTo:pop.box});
		}

		function onFogClick(e) {
			if(e.target===pop.fog && options.closeOnClickOutside) {
				pop.close();
			}
		}
		function onCloseClick(e) {
			pop.close();
		}
	};

	_.prototype = {

		show: function() {
			var pop = this;

			setTimeout(function() {
				pop.box.classList.add("visible");
				pop.fog.classList.add("visible");
			}, 1);

			pop.lastFocus = document.activeElement;
			pop.lastFocus.blur();
			pop.center();

			pop.resizeListener = this.winResize.bind(pop);
			pop.keydownListener = this.keyHandler.bind(pop);
			addEventListener("resize", pop.resizeListener, false);
			addEventListener("keydown", pop.keydownListener, false);

			document.body.style.overflow = "hidden";

			pop.tabStops = pop.box.querySelectorAll('button, input, textarea, select, a');
			pop.tabIndex = 0;
		},

		center: function() {
			var top = (this.xiopop.offsetHeight - this.box.offsetHeight) / 2;
			if(top<20) top=20;
			this.box.style.marginTop = top + "px";
		},

		close: function() {
			var pop = this;
			pop.fog.classList.remove("visible");
			pop.box.classList.remove("visible");
			setTimeout(function() {
				pop.xiopop.parentElement.removeChild(pop.xiopop);
				pop.xiopop=null;
				document.body.style.overflow = "";
			}, 300);

			if(pop.options.onClose) pop.options.onClose();
			pop.lastFocus.focus();
			removeEventListener("resize", pop.resizeListener, false);
			removeEventListener("keydown", pop.keydownListener, false);
		},

		winResize: function(e) {
			this.center();
		},


		keyHandler: function(e) {
			if(e.keyCode===KEY_ESC && closeOnClickOutside) {
				this.close();
			}

			if(e.keyCode===KEY_TAB) {
				e.preventDefault();
				if(this.tabStops.length===0) return;
				this.tabIndex = (this.tabIndex+(e.shiftKey?-1:1)) % this.tabStops.length;
				if(this.tabIndex<0) this.tabIndex = this.tabStops.length-1;


				this.tabStops[this.tabIndex].focus();
			}
		}


	};





	_.alert = function(options) {
		var pop = initPop("alert", options);

		var buttonset = create("div", {class:"xiopop_buttonset", appendTo:pop.box});
		var btnOK = create("button", {type:"button", onClick:onClick, text:"OK", appendTo: buttonset});

		pop.show();
		return pop;

		function onClick(e) {
			pop.close();
		}
	};

	_.prompt = function(options) {
		var pop = initPop("prompt", options);

		var form = create("form", { onSubmit: onSubmit, appendTo: pop.box});
		var lblPrompt = create('label', {for:'xiopop_prompt_label', text:options.label, appendTo:form});
		var input = create("input", {id:"xiopop_prompt_label", type:"text", value: options.value || "", appendTo:form});
		var buttonset = create("div", {class:"xiopop_buttonset", appendTo:form});
		var btnOK = create("button", {type:"submit", text:"OK", appendTo: buttonset});
		var btnCancel = create("button", {type:"button", text:"Cancel", onClick:onCancel, appendTo:buttonset});

		pop.show();
		input.focus();

		return pop;

		function onSubmit(e) {
			e.preventDefault();
			pop.close();
			if(options.hasOwnProperty("onSubmit")) options.onSubmit(input.value);
		}

		function onCancel(e) {
			pop.close();
		}
	};


	_.confirm = function(options) {
		var pop = initPop("confirm", options);

		var buttonset = create("div", {class:"xiopop_buttonset", appendTo:pop.box});
		var btnYes = create("button", {type:"button", onClick:confirmClick, text:"Yes", appendTo: buttonset});
		var btnNo = create("button", {type:"button", onClick:confirmClick, text:"No", appendTo: buttonset});
		pop.show();

		function confirmClick(e) {
			pop.close();
			if(e.target===btnYes) {
				options.onSubmit(true);
			} else if(e.target===btnNo) {
				options.onSubmit(false);
			}
		}
	};





	var initPop = function(type, options) {
		options = options || {};
		return pop = new XioPop(type, options);
	};

	function create(type, o) {
		var element = document.createElement(type);

		for(var key in o) {
			switch(key) {
				case 'id': element.id = o.id; break;
				case 'class': element.className = o.class; break;
				case 'for': element.setAttribute('for', o.for); break;
				case 'type': element.type = o.type; break;
				case 'value': element.value = o.value; break;
				case 'text': element.textContent = o.text; break;
				case 'html': element.innerHTML = o.html; break;
				case 'onSubmit': element.addEventListener("submit", o.onSubmit, false); break;
				case 'onClick': element.addEventListener("click", o.onClick, false); break;
				case 'appendTo': o.appendTo.appendChild(element); break;

				default:
					console.warn("Unhandled key '"+key+"' in create element method");
			}
		}
		return element;
	}

}());

/*
	var xiopop, box, fog;
	var closeOnClickOutside;
    var lastFocus;
	var tabStops;













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




*/
