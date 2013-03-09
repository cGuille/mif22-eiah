function Client(){
//if not a DOM browser, hopeless
	this.min = false; if (document.getElementById){this.min = true;};

	this.ua = navigator.userAgent;
	this.name = navigator.appName;
	this.ver = navigator.appVersion;  

//Get data about the browser
	this.mac = (this.ver.indexOf('Mac') != -1);
	this.win = (this.ver.indexOf('Windows') != -1);

//Look for Gecko
	this.gecko = (this.ua.indexOf('Gecko') > 1);
	if (this.gecko){
		this.geckoVer = parseInt(this.ua.substring(this.ua.indexOf('Gecko')+6, this.ua.length));
//		if (this.geckoVer < 20020000){this.min = false;}
	}
	
//Look for Firebird
	this.firebird = (this.ua.indexOf('Firebird') > 1);
	
//Look for Safari
	this.safari = (this.ua.indexOf('Safari') > 1);
	if (this.safari){
		this.gecko = false;
	}
	
//Look for IE
	this.ie = (this.ua.indexOf('MSIE') > 0);
	if (this.ie){
		this.ieVer = parseFloat(this.ua.substring(this.ua.indexOf('MSIE')+5, this.ua.length));
		if (this.ieVer < 5.5){this.min = false;}
	}
	
//Look for Opera
	this.opera = (this.ua.indexOf('Opera') > 0);
	if (this.opera){
		this.operaVer = parseFloat(this.ua.substring(this.ua.indexOf('Opera')+6, this.ua.length));
		if (this.operaVer < 7.04){this.min = false;}
	}
	if (this.min == false){
//		alert('Your browser may not be able to handle this page.');
	}
	
//Special case for the horrible ie5mac
	this.ie5mac = (this.ie&&this.mac&&(this.ieVer<6));
}

var C = new Client();

//CODE FOR HANDLING NAV BUTTONS AND FUNCTION BUTTONS

//[strNavBarJS]
function NavBtnOver(Btn){
	if (Btn.className != 'NavButtonDown'){Btn.className = 'NavButtonUp';}
}

function NavBtnOut(Btn){
	Btn.className = 'NavButton';
}

function NavBtnDown(Btn){
	Btn.className = 'NavButtonDown';
}
//[/strNavBarJS]

function FuncBtnOver(Btn){
	if (Btn.className != 'FuncButtonDown'){Btn.className = 'FuncButtonUp';}
}

function FuncBtnOut(Btn){
	Btn.className = 'FuncButton';
}

function FuncBtnDown(Btn){
	Btn.className = 'FuncButtonDown';
}

function FocusAButton(){
	if (document.getElementById('CheckButton1') != null){
		document.getElementById('CheckButton1').focus();
	}
	else{
		if (document.getElementById('CheckButton2') != null){
			document.getElementById('CheckButton2').focus();
		}
		else{
			document.getElementsByTagName('button')[0].focus();
		}
	}
}

//CODE FOR HANDLING DISPLAY OF POPUP FEEDBACK BOX

var topZ = 1000;

function ShowMessage(Feedback){
	var Output = Feedback + '<br /><br />';
	document.getElementById('FeedbackContent').innerHTML = Output;
	var FDiv = document.getElementById('FeedbackDiv');
	topZ++;
	FDiv.style.zIndex = topZ;
	FDiv.style.top = TopSettingWithScrollOffset(30) + 'px';

	FDiv.style.display = 'block';

	ShowElements(false, 'input');
	ShowElements(false, 'select');
	ShowElements(false, 'object');
	ShowElements(true, 'object', 'FeedbackContent');

//Focus the OK button
	setTimeout("document.getElementById('FeedbackOKButton').focus()", 50);
	
//
}

function ShowElements(Show, TagName, ContainerToReverse){
// added third argument to allow objects in the feedback box to appear
//IE bug -- hide all the form elements that will show through the popup
//FF on Mac bug : doesn't redisplay objects whose visibility is set to visible
//unless the object's display property is changed

	//get container object (by Id passed in, or use document otherwise)
	TopNode = document.getElementById(ContainerToReverse);
	var Els;
	if (TopNode != null) {
		Els = TopNode.getElementsByTagName(TagName);
	} else {
		Els = document.getElementsByTagName(TagName);
	}

	for (var i=0; i<Els.length; i++){
		if (TagName == "object") {
			//manipulate object elements in all browsers
			if (Show == true){
				Els[i].style.visibility = 'visible';
				//get Mac FireFox to manipulate display, to force screen redraw
				if (C.mac && C.gecko) {Els[i].style.display = '';}
			}
			else{
				Els[i].style.visibility = 'hidden';
				if (C.mac && C.gecko) {Els[i].style.display = 'none';}
			}
		} 
		else {
			// tagName is either input or select (that is, Form Elements)
			// ie6 has a problem with Form elements, so manipulate those
			if (C.ie) {
				if (C.ieVer < 7) {
					if (Show == true){
						Els[i].style.visibility = 'visible';
					}
					else{
						Els[i].style.visibility = 'hidden';
					}
				}
			}
		}
	}
}



function HideFeedback(){
	document.getElementById('FeedbackDiv').style.display = 'none';
	ShowElements(true, 'input');
	ShowElements(true, 'select');
	ShowElements(true, 'object');
	if (Finished == true){
		Finish();
	}
}


//GENERAL UTILITY FUNCTIONS AND VARIABLES

//PAGE DIMENSION FUNCTIONS
function PageDim(){
//Get the page width and height
	this.W = 600;
	this.H = 400;
	this.W = document.getElementsByTagName('body')[0].clientWidth;
	this.H = document.getElementsByTagName('body')[0].clientHeight;
}

var pg = null;

function GetPageXY(El) {
	var XY = {x: 0, y: 0};
	while(El){
		XY.x += El.offsetLeft;
		XY.y += El.offsetTop;
		El = El.offsetParent;
	}
	return XY;
}

function GetScrollTop(){
	if (typeof(window.pageYOffset) == 'number'){
		return window.pageYOffset;
	}
	else{
		if ((document.body)&&(document.body.scrollTop)){
			return document.body.scrollTop;
		}
		else{
			if ((document.documentElement)&&(document.documentElement.scrollTop)){
				return document.documentElement.scrollTop;
			}
			else{
				return 0;
			}
		}
	}
}

function GetViewportHeight(){
	if (typeof window.innerHeight != 'undefined'){
		return window.innerHeight;
	}
	else{
		if (((typeof document.documentElement != 'undefined')&&(typeof document.documentElement.clientHeight !=
     'undefined'))&&(document.documentElement.clientHeight != 0)){
			return document.documentElement.clientHeight;
		}
		else{
			return document.getElementsByTagName('body')[0].clientHeight;
		}
	}
}

function TopSettingWithScrollOffset(TopPercent){
	var T = Math.floor(GetViewportHeight() * (TopPercent/100));
	return GetScrollTop() + T; 
}

//CODE FOR AVOIDING LOSS OF DATA WHEN BACKSPACE KEY INVOKES history.back()
var InTextBox = false;

function SuppressBackspace(e){ 
	if (InTextBox == true){return;}
	if (C.ie) {
		thisKey = window.event.keyCode;
	}
	else {
		thisKey = e.keyCode;
	}

	var Suppress = false;

	if (thisKey == 8) {
		Suppress = true;
	}

	if (Suppress == true){
		if (C.ie){
			window.event.returnValue = false;	
			window.event.cancelBubble = true;
		}
		else{
			e.preventDefault();
		}
	}
}

if (C.ie){
	document.attachEvent('onkeydown',SuppressBackspace);
	window.attachEvent('onkeydown',SuppressBackspace);
}
else{
	if (window.addEventListener){
		window.addEventListener('keypress',SuppressBackspace,false);
	}
}

function ReduceItems(InArray, ReduceToSize){
	var ItemToDump=0;
	var j=0;
	while (InArray.length > ReduceToSize){
		ItemToDump = Math.floor(InArray.length*Math.random());
		InArray.splice(ItemToDump, 1);
	}
}

function Shuffle(InArray){
	var Num;
	var Temp = new Array();
	var Len = InArray.length;

	var j = Len;

	for (var i=0; i<Len; i++){
		Temp[i] = InArray[i];
	}

	for (i=0; i<Len; i++){
		Num = Math.floor(j  *  Math.random());
		InArray[i] = Temp[Num];

		for (var k=Num; k < (j-1); k++) {
			Temp[k] = Temp[k+1];
		}
		j--;
	}
	return InArray;
}


function EscapeDoubleQuotes(InString){
	return InString.replace(/"/g, '&quot;')
}

function TrimString(InString){
        var x = 0;

        if (InString.length != 0) {
                while ((InString.charAt(InString.length - 1) == '\u0020') || (InString.charAt(InString.length - 1) == '\u000A') || (InString.charAt(InString.length - 1) == '\u000D')){
                        InString = InString.substring(0, InString.length - 1)
                }

                while ((InString.charAt(0) == '\u0020') || (InString.charAt(0) == '\u000A') || (InString.charAt(0) == '\u000D')){
                        InString = InString.substring(1, InString.length)
                }

                while (InString.indexOf('  ') != -1) {
                        x = InString.indexOf('  ')
                        InString = InString.substring(0, x) + InString.substring(x+1, InString.length)
                 }

                return InString;
        }

        else {
                return '';
        }
}

function FindLongest(InArray){
	if (InArray.length < 1){return -1;}

	var Longest = 0;
	for (var i=1; i<InArray.length; i++){
		if (InArray[i].length > InArray[Longest].length){
			Longest = i;
		}
	}
	return Longest;
}

//UNICODE CHARACTER FUNCTIONS
function IsCombiningDiacritic(CharNum){
	var Result = (((CharNum >= 0x0300)&&(CharNum <= 0x370))||((CharNum >= 0x20d0)&&(CharNum <= 0x20ff)));
	Result = Result || (((CharNum >= 0x3099)&&(CharNum <= 0x309a))||((CharNum >= 0xfe20)&&(CharNum <= 0xfe23)));
	return Result;
}

function IsCJK(CharNum){
	return ((CharNum >= 0x3000)&&(CharNum < 0xd800));
}

//SETUP FUNCTIONS
//BROWSER WILL REFILL TEXT BOXES FROM CACHE IF NOT PREVENTED
function ClearTextBoxes(){
	var NList = document.getElementsByTagName('input');
	for (var i=0; i<NList.length; i++){
		if ((NList[i].id.indexOf('Guess') > -1)||(NList[i].id.indexOf('Gap') > -1)){
			NList[i].value = '';
		}
		if (NList[i].id.indexOf('Chk') > -1){
			NList[i].checked = '';
		}
	}
}

//EXTENSION TO ARRAY OBJECT
function Array_IndexOf(Input){
	var Result = -1;
	for (var i=0; i<this.length; i++){
		if (this[i] == Input){
			Result = i;
		}
	}
	return Result;
}
Array.prototype.indexOf = Array_IndexOf;

//HOTPOTNET-RELATED CODE

var HPNStartTime = (new Date()).getTime();
var SubmissionTimeout = 30000;
var Detail = ''; //Global that is used to submit tracking data

function Finish(){
//If there's a form, fill it out and submit it
	if (document.store != null){
		Frm = document.store;
		Frm.starttime.value = HPNStartTime;
		Frm.endtime.value = (new Date()).getTime();
		Frm.mark.value = Score;
		Frm.detail.value = Detail;
		Frm.submit();
	}
}

//JCROSS CORE JAVASCRIPT CODE

var InGap = false;
var CurrentBox = null;
var Feedback = '';
var AcrossCaption = '';
var DownCaption = '';
var Correct = 'Bravo !';
var Incorrect = 'Certaines de vos réponses sont fausses. Les champs incorrects ont été effacés.'; 
var GiveHint = 'Une lettre correcte a été ajoutée.';
var YourScoreIs = 'Votre score est de ';
var BuiltGrid = '';
var BuiltExercise = '';
var Penalties = 0;
var Score = 0;
var InTextBox = false;
var Locked = false;
var TimeOver = false;
var CaseSensitive = false; 

var InputStuff = '<form method="post" action="" onsubmit="return false;"><span class="ClueNum">[strClueNum]: </span>';
InputStuff += '[strClue] <input onfocus="CurrentBox=this;InTextBox=true;" onblur="InTextBox=false;" id="[strBoxId]" type="edit" size="[strEditSize]" maxlength="[strMaxLength]"></input>';
InputStuff += '<button class="FuncButton" onfocus="FuncBtnOver(this)" onblur="FuncBtnOut(this)" onmouseover="FuncBtnOver(this)" onmouseout="FuncBtnOut(this)" onmousedown="FuncBtnDown(this)" onmouseup="FuncBtnOut(this)" onclick="EnterGuess([strParams])">Valider</button>';
InputStuff += '<button class="FuncButton" onfocus="FuncBtnOver(this)" onblur="FuncBtnOut(this)" onmouseover="FuncBtnOver(this)" onmouseout="FuncBtnOut(this)" onmousedown="FuncBtnDown(this)" onmouseup="FuncBtnOut(this)" onclick="ShowHint([strParams])">Aide</button>';
InputStuff += '</form>';

var CurrBoxElement = null;
var Finished = false;

function GetAnswerLength(Across,x,y){
	Result = 0;
	if (Across == false){
		while ((x<L.length)&&(L[x][y].length > 0)){
			Result += L[x][y].length;
			x++;
		} 
		return Result;
	}
	else{
		while ((y<L[x].length)&&(L[x][y].length > 0)){
			Result += L[x][y].length;
			y++;
		} 	
		return Result;
	}
}

function GetEditSize(Across,x,y){
	var Len = GetAnswerLength(Across,x,y);
	if (IsCJK(L[x][y].charCodeAt(0))){
		Len *= 2;
	}
	return Len;
}

function ShowClue(ClueNum,x,y){
	var Result = '';
	var Temp;
	var strParams;
	var Clue = document.getElementById('Clue_A_' + ClueNum);
	if (Clue != null){
		Temp = InputStuff.replace(/\[ClueNum\]/g, ClueNum);
		Temp = Temp.replace(/\[strClueNum\]/g, AcrossCaption + ' ' + ClueNum);
		strParams = 'true,' + ClueNum + ',' + x + ',' + y + ',\'[strBoxId]\'';
		Temp = Temp.replace(/\[strParams\]/g, strParams);
		Temp = Temp.replace(/\[strBoxId\]/g, 'GA_' + ClueNum + '_' + x + '_' + y);
		Temp = Temp.replace(/\[strEditSize\]/g, GetEditSize(true,x,y));
		Temp = Temp.replace(/\[strMaxLength\]/g, GetAnswerLength(true,x,y));
		Temp = Temp.replace(/\[strClue\]/g, Clue.innerHTML, Temp);
		Result += Temp;
	}
	Clue = document.getElementById('Clue_D_' + ClueNum);
	if (Clue != null){
		Temp = InputStuff.replace(/\[ClueNum\]/g, ClueNum);
		Temp = Temp.replace(/\[strClueNum\]/g, DownCaption + ' ' + ClueNum);
		strParams = 'false,' + ClueNum + ',' + x + ',' + y + ',\'[strBoxId]\'';
		Temp = Temp.replace(/\[strParams\]/g, strParams);
		Temp = Temp.replace(/\[strBoxId\]/g, 'GD_' + ClueNum + '_' + x + '_' + y);
		Temp = Temp.replace(/\[strEditSize\]/g, GetAnswerLength(false,x,y));
		Temp = Temp.replace(/\[strClue\]/g, Clue.innerHTML, Temp);
		Result += Temp;
	}
	document.getElementById('ClueEntry').innerHTML = Result;
}

function EnterGuess(Across,ClueNum,x,y,BoxId){
	if (document.getElementById(BoxId) != null){
		var Guess = document.getElementById(BoxId).value;
		var AnsLength = GetAnswerLength(Across,x,y);
		EnterAnswer(Guess,Across,AnsLength,x,y);
	}
}

function SplitStringToPerceivedChars(InString, PC){
	var Temp = InString.charAt(0);
	if (InString.length > 1){
		for (var i=1; i<InString.length; i++){
			if (IsCombiningDiacritic(InString.charCodeAt(i)) == true){
				Temp += InString.charAt(i);
			}
			else{
				PC.push(Temp);
				Temp = InString.charAt(i);
			}
		}
	}
	PC.push(Temp);
}

function EnterAnswer(Guess,Across,AnsLength,x,y){
	var PC = new Array();
	SplitStringToPerceivedChars(Guess, PC);
	
	var i=x;
	var j=y;
	var Letter = 0;
	while (Letter < AnsLength){
		if (Letter < PC.length){
			G[i][j] = PC[Letter];
			if (document.getElementById('L_' + i + '_' + j) != null){
				document.getElementById('L_' + i + '_' + j).innerHTML = PC[Letter];
			}
		}
		if (Across == true){
			j++;
		}
		else{
			i++;
		}
		Letter++;
	}
}

function SetGridSquareValue(x,y,Val){
	var GridId = 'L_' + x + '_' + y;
	if (document.getElementById(GridId) != null){
		document.getElementById(GridId).innerHTML = Val;
	}
}

function ShowHint(Across,ClueNum,x,y,BoxId){
	var i=x;
	var j=y;
	var LetterFromGuess = '';
	var LetterFromKey = '';
	var OutString = '';
	if (Across==true){
		while (j<L[i].length){
			if (L[i][j] != ''){
				OutString += L[i][j];
				if (CaseSensitive == true){
					LetterFromKey = L[i][j];
					LetterFromGuess = G[i][j];
				}
				else {
					LetterFromKey = L[i][j].toUpperCase();
					LetterFromGuess = G[i][j].toUpperCase();
				}
				if (LetterFromGuess != LetterFromKey){
//				if (G[i][j] != L[i][j]){
					G[i][j] = L[i][j];
					Penalties++;
					break;
				}
			}
			else{
				break;
			}
		j++;
		}
	}
	else{
		while (i<L.length){
			if (L[i][j] != ''){
				OutString += L[i][j];
				if (CaseSensitive == true){
					LetterFromKey = L[i][j];
					LetterFromGuess = G[i][j];
				}
				else {
					LetterFromKey = L[i][j].toUpperCase();
					LetterFromGuess = G[i][j].toUpperCase();
				}
				if (LetterFromGuess != LetterFromKey){
//				if (G[i][j] != L[i][j]){
					G[i][j] = L[i][j];
					Penalties++;
					break;
				}
			}
			else{
				break;
			}
		i++;
		}
	}
	if (document.getElementById(BoxId) != null){
		document.getElementById(BoxId).value = OutString;
	}
}

L = new Array();
L[0] = new Array('','','C','','','','','','');
L[1] = new Array('','','Y','','','','','','');
L[2] = new Array('','','P','','','','','','');
L[3] = new Array('','','H','','','','','P','');
L[4] = new Array('S','C','O','L','I','O','S','E','');
L[5] = new Array('','','S','','','','','R','');
L[6] = new Array('','','E','','','','','I','');
L[7] = new Array('','','','','','','','O','');
L[8] = new Array('M','E','T','A','T','A','R','S','E');
L[9] = new Array('','','','','','','','T','');
L[10] = new Array('','','','','','','','I','');
L[11] = new Array('','','','','','','','Q','');
L[12] = new Array('','','C','U','B','I','T','U','S');
L[13] = new Array('','','','','','','','E','');


CL = new Array();
CL[0] = new Array(0,0,1,0,0,0,0,0,0);
CL[1] = new Array(0,0,0,0,0,0,0,0,0);
CL[2] = new Array(0,0,0,0,0,0,0,0,0);
CL[3] = new Array(0,0,0,0,0,0,0,2,0);
CL[4] = new Array(3,0,0,0,0,0,0,0,0);
CL[5] = new Array(0,0,0,0,0,0,0,0,0);
CL[6] = new Array(0,0,0,0,0,0,0,0,0);
CL[7] = new Array(0,0,0,0,0,0,0,0,0);
CL[8] = new Array(4,0,0,0,0,0,0,0,0);
CL[9] = new Array(0,0,0,0,0,0,0,0,0);
CL[10] = new Array(0,0,0,0,0,0,0,0,0);
CL[11] = new Array(0,0,0,0,0,0,0,0,0);
CL[12] = new Array(0,0,5,0,0,0,0,0,0);
CL[13] = new Array(0,0,0,0,0,0,0,0,0);


G = new Array();
G[0] = new Array('','','','','','','','','');
G[1] = new Array('','','','','','','','','');
G[2] = new Array('','','','','','','','','');
G[3] = new Array('','','','','','','','','');
G[4] = new Array('','','','','','','','','');
G[5] = new Array('','','','','','','','','');
G[6] = new Array('','','','','','','','','');
G[7] = new Array('','','','','','','','','');
G[8] = new Array('','','','','','','','','');
G[9] = new Array('','','','','','','','','');
G[10] = new Array('','','','','','','','','');
G[11] = new Array('','','','','','','','','');
G[12] = new Array('','','','','','','','','');
G[13] = new Array('','','','','','','','','');


function CheckAnswers(){
	if (Locked == true){return;}

	var AllCorrect = true;
	var TotLetters = 0;
	var CorrectLetters = 0;
	var LetterFromKey = ''; 
	var LetterFromGuess = '';
	
//Check each letter
	for (var i=0; i<L.length; i++){
		for (var j=0; j<L[i].length; j++){
			if (L[i][j] != ''){
				TotLetters++;
				if (CaseSensitive == true) {
					LetterFromKey = L[i][j];
					LetterFromGuess = G[i][j];
				}
				else {
					LetterFromKey = L[i][j].toUpperCase();
					LetterFromGuess = G[i][j].toUpperCase();
				}
				if (LetterFromGuess != LetterFromKey){ 
					G[i][j] = '';
//Blank that square in the grid
					SetGridSquareValue(i,j,'');
					AllCorrect = false;
				}
				else{
					CorrectLetters++;
				}
			}
		}
	}

	Score = Math.floor(((CorrectLetters-Penalties) * 100)/TotLetters);
	if (Score < 0){Score = 0;}

//Compile the output
	var Output = '';

	if (AllCorrect == true){
		Output = Correct + '<br />';
	}

	Output += YourScoreIs + ' ' + Score + '%.<br />';
	if (AllCorrect == false){
		Output += Incorrect;
		Penalties++;
	}

	ShowMessage(Output);
	
	if ((AllCorrect == true)||(TimeOver == true)){


		TimeOver = true;
		Locked = true;
		Finished = true;
		setTimeout('Finish()', SubmissionTimeout);
	}

}

function Finish(){
//If there's a form, fill it out and submit it
	if (document.store != null){
		Frm = document.store;
		Frm.starttime.value = HPNStartTime;
		Frm.endtime.value = (new Date()).getTime();
		Frm.mark.value = Score;
		Frm.submit();
	}
}

function TypeChars(Chars){
	if (CurrentBox != null){
		CurrentBox.value += Chars;
	}
}