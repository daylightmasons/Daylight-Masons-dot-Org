
// Constants that can be Changed through time
var petitionAssesment = 50;
var petitionHours = 20;
var paypalConstFee = .30;
var paypalPercFee = .029;
var minimumWage = 8.55; 
var seniorHours = 8;
var regHours = 20;
var grandLodgeAssessment = 15; 
var seniorAge = 65;
var lifeFees = new Array(900,800,700,650,600,550);
var cutOffYears = new Array(25,35,45,55,65,300);

// Cache Vars
var calcLifeFee;
var calcProrate;
var regularMemberRate = Math.round(regHours * minimumWage) + grandLodgeAssessment;
var seniorMemberRate = Math.round(seniorHours * minimumWage) + grandLodgeAssessment;

// Paypal attaches a transaction fee that is a percent added plus some constant
// Pre: moneyNeeded must be a float of 2 decimals
// Throws Exception if not pre condition
// returns moneyNeeded net times 1+paypalPercent + Paypal const
function calculatePaypalFee(moneyNeeded) {
	if (moneyNeeded <= 0) {
		return 0;
	} else {
		return (Math.round(((1+paypalPercFee)*moneyNeeded + paypalConstFee)*100)/100).toFixed(2);
	}
}

function loadDues() {
	document.forms.regDues.amount.value = calculatePaypalFee(regularMemberRate);
	document.forms.seniorDues.amount.value = calculatePaypalFee(seniorMemberRate);
	document.forms.lifeDues.amount.value = calculatePaypalFee(grandLodgeAssessment);
}

function breakDown(type, rate) {
	output = "<table style='width: 100%;background-color:#eee; border:3px solid #aaa; font-size:14pt;'><tr><td>";
	output += type + ":</td><td style='text-align:right;'>$" + rate.toFixed(2);
	output += "</td></tr><tr style='border-bottom: 1px solid #000;'><td>Paypal Fee:</td>";
	output += "<td style='width: 20%;text-align:right;'>$" + (Math.round((paypalPercFee * rate + paypalConstFee)*100)/100).toFixed(2) + "</td></tr><tr ><td >";
	output += "Total:</td><td style='border-top:1px solid #000; text-align:right;'><font style='background-color:#ee0;'>$" +calculatePaypalFee(rate) + "</font></td></tr></table>"; 
	return output;
}

// Prorates dues for the year depending on whether a senior or not
// year must be 4 integers no float
// Month must be <= 2 digits and >0
// senior boolean true for senior or not true for regular
// duesFee must be a float of two
// returns Prorated fee
function prorate(month, regular) {
var diff = (12 == month) ? 12 : 12 - month;
if (regular[0].checked) {
	var monthRate = (regularMemberRate - grandLodgeAssessment) / 12;
} else {
	var monthRate = (seniorMemberRate - grandLodgeAssessment) / 12;
}

var rate = Math.round(monthRate * diff*100)/100 + ((month == 12) ? grandLodgeAssessment : 0 );

document.forms.prorateDues.amount.value = calculatePaypalFee(rate);
if (month == 12) {
	document.getElementById('Proration').innerHTML = breakDown("Full Dues for Next Year", rate);
	document.getElementById('prorateNotice').style.display = 'block';
} else {
	document.getElementById('Proration').innerHTML = breakDown("Prorated Membership Fee", rate);
}
document.getElementById('prorateDuesSubmit').style.display = 'block';
}

//Calculates Age based on todays date and the year month and day entered
function calcAge(year, month, day) {
if (IsValidDate(day,month,year)){
	var today = new Date();
	var birthday = new Date(year, month-1, day);
	var age = today.getFullYear().valueOf() - birthday.getFullYear().valueOf();
	if (birthday.getMonth().valueOf() > today.getMonth().valueOf()){
		age--;
	} else if (birthday.getMonth().valueOf() == today.getMonth().valueOf() && birthday.getDate().valueOf() > today.getDate().valueOf()){
		age--;
	}
	return age;
}
}

//Returns life time fee based on table
function lifeTimeFee(year, month, day) {
var type = "Lifetime Membership Fee";
	if (IsValidDate(day,month,year)){
		var age = calcAge(year, month, day);
		var num = 0;
		for (i = 0; i < lifeFees.length; i++) {
			if (age <= cutOffYears[i]){
				num = i;
				break;
			}
		}
		document.forms.lifeDues.item_name.value = type;
		document.forms.lifeDues.amount.value = calculatePaypalFee(lifeFees[num]);
		document.getElementById('lifeFee').innerHTML = breakDown("Lifetime Membership", lifeFees[num]);
		document.getElementById('lifeDuesSubmit').style.display = 'block';
	}
}

function petitionFee(){
	document.getElementById('petition').innerHTML = breakDown("Petition Fee", (petitionHours * minimumWage) + petitionAssesment);
	document.forms.petitionFee.amount.value = calculatePaypalFee((petitionHours * minimumWage) + petitionAssesment);
}

function IsValidDate(Day,Mn,Yr){
   var DateVal = Mn + "/" + Day + "/" + Yr;
   var dt = new Date(DateVal);

   if(dt.getDate()!=Day){
       alert('Invalid Date');
       return false;
       }
   else if(dt.getMonth()!=Mn-1){
   //this is for the purpose JavaScript starts the month from 0

       alert('Invalid Date');
       return false;
       }
   else if(dt.getFullYear()!=Yr){
       alert('Invalid Date');
       return false;
       }
   return true;
}

