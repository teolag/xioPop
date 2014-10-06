var btnAlert = document.getElementById("btnAlert");
var btnConfirm = document.getElementById("btnConfirm");
var btnPrompt = document.getElementById("btnPrompt");
var btnPage = document.getElementById("btnPage");
var btnForm = document.getElementById("btnForm");
var btnWebPage = document.getElementById("btnWebPage");
var btnSelect = document.getElementById("btnSelect");



btnAlert.addEventListener("click", function(e) {
	XioPop.alert("Du har skrivarproblem", "Var god se skrivarens bruksanvisning"); 
}, false);


btnConfirm.addEventListener("click", function(e) {
	XioPop.confirm("Äta glass?", "Är du säker på att du verkligen vill äta glass?", function(answer) {
		console.log("The answer was:", answer);
	}); 
}, false);


btnPrompt.addEventListener("click", function(e) {
	XioPop.prompt("Vad heter du?", "Skriv in ditt fullständiga namn:", "", function(answer) {
		console.log("Answer:", answer);
	}); 
}, false);


btnPage.addEventListener("click", function(e) {
	XioPop.load("lorem_ipsum.txt"); 
}, false);


btnWebPage.addEventListener("click", function(e) {
	XioPop.load("http://dn.se"); 
}, false);


btnForm.addEventListener("click", function(e) {
	XioPop.load("form.php", function(e) {
		var form = document.getElementById("frmAddPerson");
		console.log("Form loaded", form);
		form.addEventListener("submit", formSaved, false);
	}); 
}, false);


btnSelect.addEventListener("click", function(e) {

	var list = [
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

	XioPop.select(list, function(chosen) {
		console.log("Chosen list item:", chosen);
	});
}, false);



function formSaved(e) {
	e.preventDefault();
	var form = e.target;
	var xhr = new XMLHttpRequest();
	
	xhr.open("post", "index.php", true);
	var formData = new FormData(form);
	xhr.send(formData);
	
	XioPop.close();
}












/*

var btnAlert2 = document.getElementById("btnAlert2");
btnAlert2.addEventListener("click", function(e) {
	var popAlert = new XioPop2("alert", {title:"Welcome", text:"Welcome to my site mr Unknown"});
});


*/