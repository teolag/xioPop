(function () {
	"use strict";

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
		pop.options.fogClickToClose = true;

		pop.xiopop = create('div', {class:"xiopop", appendTo: document.body});
		pop.box = create('div', {class:"xiopop_box xiopop_"+type, appendTo:pop.xiopop});

		if(pop.options.closeButton) {
			create('button', {class:"xiopop_close", text:'x', type:'button', onClick:pop.close.bind(pop), appendTo: pop.box});
		}

		if(options.title) {
			create("div", {class:"xiopop_title", text:options.title, appendTo:pop.box});
		}

		if(options.text) {
			create("p", {html:options.text, appendTo:pop.box});
		}

		if(pop.options.fogClickToClose) {
			pop.xiopop.addEventListener("click", function(e){
				if(e.target===pop.xiopop) {
					pop.close();
				}
			}, false);
		}

	};

	_.prototype = {

		show: function() {
			var pop = this;

			setTimeout(function() {
				pop.box.classList.add("visible");
				pop.xiopop.classList.add("visible");
			}, 1);

			pop.lastFocus = document.activeElement;
			pop.lastFocus.blur();
			pop.center();

			pop.resizeListener = this.winResize.bind(pop);
			pop.keydownListener = this.keyHandler.bind(pop);
			addEventListener("resize", pop.resizeListener, false);
			addEventListener("keydown", pop.keydownListener, false);

			document.body.style.overflow = "hidden";

			pop.tabStops = pop.box.querySelectorAll('button, input, textarea, select, a, *[tabindex]');
			pop.tabIndex = 0;
		},

		center: function() {
			var top = (this.xiopop.offsetHeight - this.box.offsetHeight) / 2;
			if(top<20) top=20;
			this.box.style.marginTop = top + "px";
		},

		close: function() {
			var pop = this;
			pop.xiopop.classList.remove("visible");
			pop.box.classList.remove("visible");
			setTimeout(function() {
				remove(pop.xiopop);
				pop.xiopop=null;
				document.body.style.overflow = "";
			}, 250);

			if(pop.options.onClose) pop.options.onClose();
			pop.lastFocus.focus();
			removeEventListener("resize", pop.resizeListener, false);
			removeEventListener("keydown", pop.keydownListener, false);
		},

		winResize: function(e) {
			this.center();
		},

		keyHandler: function(e) {
			if(e.keyCode===KEY_ESC) {
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
		return pop;

		function confirmClick(e) {
			pop.close();
			if(e.target===btnYes) {
				options.onSubmit(true);
			} else if(e.target===btnNo) {
				options.onSubmit(false);
			}
		}
	};

	_.select = function(options) {
		if(options.closeButton!==false) options.closeButton=true;

		var pop = initPop("select", options);


		var filter = create("input", {type:'search', onKeyDown: selectKeyDown, onKeyUp: selectKeyUp, onSearch:selectKeyUp, appendTo:pop.box});
		var list = create("ul", {class:'xiopop_selectableList', onClick: listClick, appendTo:pop.box});

		var selectedIndex = 0;

		filterOptions("");

		pop.show();
		filter.focus();

		return pop;

		function listClick(e) {
			var li = e.target;
			if(li.nodeName!=="LI") return;

			selectItem(li);
			options.onSubmit(options.options[li.dataset.index]);
			pop.close();
		}

		function selectItem(li) {
			var selected = list.querySelectorAll(".selected");
			for(var i=0; i<selected.length; i++) {
				selected[i].classList.remove("selected");
			}
			li.classList.add("selected");
			li.scrollIntoView();
		}

		function selectKeyDown(e) {
            switch(e.keyCode) {
				case KEY_ENTER:
				e.preventDefault();
				break;

                case KEY_UP:
                e.preventDefault();
				var selected = list.querySelector(".selected");
				var prev = selected.previousSibling;
				if(prev) selectItem(prev);
                break;

                case KEY_DOWN:
                e.preventDefault();
				var selected = list.querySelector(".selected");
				var next = selected.nextSibling;
				if(next) selectItem(next);
                break;
            }
		}

		var lastSearchString;
		function selectKeyUp(e) {
			if(e.keyCode===KEY_UP || e.keyCode===KEY_DOWN) return;

			if(e.keyCode===KEY_ENTER) {
				var selected = list.querySelector(".selected");
				if(!selected) return;
                options.onSubmit(options.options[selected.dataset.index]);
                pop.close();
				e.preventDefault();
				return;
			}

            var searchString = e.target.value.toLowerCase();
			if(lastSearchString===searchString) return;
			lastSearchString=searchString;

			filterOptions(searchString);
		}

		function filterOptions(searchString) {
			list.innerHTML="";
			if(options.options.length>0) {
				for(var i=0; i<options.options.length; i++) {
					var item = options.options[i];
					var html = item.text;

					if(searchString) {
						if(item.text.toLowerCase().search(searchString)===-1) continue;

						var regexp = new RegExp("("+searchString+")", "gi");
						html = html.replace(regexp, '<mark>$1</mark>');
					}

					var li = create("li", {html: html, data:{id:item.id, index:i}, appendTo: list});
					if(i===0) li.classList.add("selected");
					item.li = li;
					item.index = i;
				}

				var selected = list.querySelector(".selected");
				var first = list.querySelector("li");
				if(!selected && !!first) {
					selectItem(first);
				}
			} else {
				var li = create("li", {text: "No functions found.", appendTo: list});
			}
		}
	};

	_.load = function(options) {
		if(options.closeButton!==false) options.closeButton=true;

		var pop = initPop("page", options);

		var xhr = new XMLHttpRequest();
		xhr.open("get", options.url, true);

		xhr.onload = function(e) {
			var content = create("div", {html:e.target.responseText, appendTo:pop.box});
			pop.center();
			if(options.onLoad) options.onLoad(e, content);
		}

		pop.show();
		xhr.send();
		return pop;
	};

	_.showElement = function(options) {
		if(options.closeButton!==false) options.closeButton=true;

		var pop = initPop("element", options);
		pop.box.appendChild(options.element);
		pop.show();
		return pop;
	}



	var initPop = function(type, options) {
		options = options || {};
		return new XioPop(type, options);
	};



	function getById(id) {
		return document.getElementById(id);
	}

	function remove(element) {
		element.parentElement.removeChild(element);
	}

	function create(type, o) {
		var element = document.createElement(type);

		for(var key in o) {
			switch(key) {
				case 'id': element.id = o.id; break;
				case 'class': element.className = o.class; break;
				case 'for': element.setAttribute('for', o.for); break;
				case 'tabindex': element.setAttribute('tabindex', o.tabindex); break;
				case 'type': element.type = o.type; break;
				case 'value': element.value = o.value; break;
				case 'text': element.textContent = o.text; break;
				case 'html': element.innerHTML = o.html; break;
				case 'onSubmit': element.addEventListener("submit", o.onSubmit, false); break;
				case 'onClick': element.addEventListener("click", o.onClick, false); break;
				case 'onKeyUp': element.addEventListener("keyup", o.onKeyUp, false); break;
				case 'onKeyDown': element.addEventListener("keydown", o.onKeyDown, false); break;
				case 'onSearch': element.addEventListener("search", o.onSearch, false); break;
				case 'onMouseMove': element.addEventListener("mousemove", o.onMouseMove, false); break;
				case 'appendTo': o.appendTo.appendChild(element); break;

				case 'data':
					for(var k in o.data) {
						element.dataset[k] = o.data[k];
					}
					break;

				default:
					console.warn("Unhandled key '"+key+"' in create element method");
			}
		}
		return element;
	}

}());
