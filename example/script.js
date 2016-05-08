var btnAlert = document.getElementById("btnAlert");
var btnConfirm = document.getElementById("btnConfirm");
var btnPrompt = document.getElementById("btnPrompt");
var btnPage = document.getElementById("btnPage");
var btnForm = document.getElementById("btnForm");
var btnWebPage = document.getElementById("btnWebPage");
var btnSelect = document.getElementById("btnSelect");
var btnSelectOrCreate = document.getElementById("btnSelectOrCreate");
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

btnChoose.addEventListener("click", function(e) {
	var options = [
		{id:"glass", text:"Äta glass i parken"},
		{id:"ro", text:"Ro till Kanada"},
		{id:"bygga", text:"Bygga en stor katt av granbarr"},
		{id:"jogga", text:"Jogga ett varv runt kvarteret"}
	];
	XioPop.select({
		title:"Välj ett av valen",
		text:"Vad vill du göra i eftermiddag?",
		options: options,
		onSubmit: function(answer) {
			console.log("Chosen option:", answer)
		}
	});
}, false);

btnSelect.addEventListener("click", function(e) {
	var options = [
		{id:1, text:"Val ett"},
		{id:2, text:"Val två"},
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
		{id:67575494, text:"Sextiosjumiljoner femhundrasjuttiofemtusen fyrahundranittiofyra"}
	];

	XioPop.select({
		title: "Välj",
		text: "Vad väljer du?",
		options: options,
		onSubmit: function(chosen) {
			console.log("Chosen list item:", chosen);
		}
	});
}, false);


btnSelectOrCreate.addEventListener("click", function(e) {
	var options = [
		{id:1, text:"Grävskopa"},
		{id:2, text:"Flygplan"},
		{id:3, text:"Hoppinne"},
		{id:4, text:"Rymdraket"}
	];

	XioPop.select({
		title: "Välj fordon",
		text: "Vilket är ditt favoritfordon?",
		allowCreate: true,
		options: options,
		onSubmit: function(chosen) {
			console.log("Chosen list item:", chosen);
		}
	});
}, false);

btnPage.addEventListener("click", function(e) {
	XioPop.load({url:"lorem_ipsum.txt"});
}, false);


