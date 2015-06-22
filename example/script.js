var btnAlert = document.getElementById("btnAlert");
var btnConfirm = document.getElementById("btnConfirm");
var btnPrompt = document.getElementById("btnPrompt");
var btnPage = document.getElementById("btnPage");
var btnForm = document.getElementById("btnForm");
var btnWebPage = document.getElementById("btnWebPage");
var btnSelect = document.getElementById("btnSelect");
var btnChoose = document.getElementById("btnChoose");



btnAlert.addEventListener("click", function(e) {
	XioPop.alert({
		title: "Du har skrivarproblem",
		text: "Var god se skrivarens bruksanvisning",
		onClose: function() {
			console.log("callback after alert close");
		}
	});
}, false);


btnPrompt.addEventListener("click", function(e) {
	XioPop.prompt({
		title: "Vad heter du?",
		label: "Skriv in ditt fullständiga namn:",
		onSubmit: function(answer) {
			console.log("Answer:", answer);
		}
	});
}, false);


btnConfirm.addEventListener("click", function(e) {
	XioPop.confirm({
		title: "Äta glass?",
		text: "Är du säker på att du verkligen vill äta glass?",
		onSubmit: function(answer) {
			console.log("The answer was:", answer);
		}
	});
}, false);


btnPage.addEventListener("click", function(e) {
	XioPop.load("lorem_ipsum.txt");
}, false);


btnWebPage.addEventListener("click", function(e) {
	XioPop.load("page.html");
}, false);


btnForm.addEventListener("click", function(e) {
	XioPop.load("form.php", function(e, content) {
		var form = content.querySelector("#frmAddPerson");
		console.log("Form loaded", form);
		form.addEventListener("submit", formSaved, false);

		function formSaved(e) {
			e.preventDefault();
			console.debug("Send post to save form");
			XioPop.close();
		}
	});
}, false);


btnChoose.addEventListener("click", function(e) {
	var options = [
		{id:"glass", text:"Äta glass i parken"},
		{id:"jogga", text:"Jogga ett varv runt kvarteret"}
	];
	XioPop.choose("Välj ett av valen", "Vad vill du göra i eftermiddag?", options, function(answer) {
		console.log("Chosen option:", answer)
	});

}, false);

btnSelect.addEventListener("click", function(e) {

	var options = [
		{id:1, text:"Val ett"},
		{id:2, text:"Val två"},
		{id:3, text:"Val tre"},
		{id:3, text:"Val tre"},
		{id:4, text:"Val fyra"},
		{id:5, text:"Val fem"},
		{id:6, text:"Val sex"},
		{id:7, text:"Val sju"},
		{id:8, text:"Val åtta"},
		{id:9, text:"Val nio"},
		{id:10, text:"Val tio"},
		{id:11, text:"Val elva"},
		{id:12, text:"Val tolv"},
		{id:13, text:"Val tretton"},
		{id:14, text:"Val fjorton"},
		{id:15, text:"Val femton"},
		{id:16, text:"Val sexton"},
		{id:17, text:"Val sjutton"},
		{id:18, text:"Val arton"},
		{id:19, text:"Val nitton"},
		{id:20, text:"Val tjugo"},
		{id:21, text:"Val tjugoett"},
	];

	XioPop.select(options, function(chosen) {
		console.log("Chosen list item:", chosen);
	});
}, false);















/*

var btnAlert2 = document.getElementById("btnAlert2");
btnAlert2.addEventListener("click", function(e) {
	var popAlert = new XioPop2("alert", {title:"Welcome", text:"Welcome to my site mr Unknown"});
});


*/