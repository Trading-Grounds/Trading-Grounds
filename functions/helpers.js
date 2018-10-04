var helpers = {
	
	//	Converts Unit-Abbreviated Numbers into floats
	convertUAN: (num) => {
		
		//	Return FALSE if num is falsey, n/a or blank
		if(!num || num.toLowerCase() == 'n/a' || num.trim() == '') { return false; }
		
		//	Strip out any $, spaces, and commas
		num = num.replace('$', '');
		num = num.replace(/ /g, '');
		num = num.replace(',', '');
		
		//	Helper function to parse and trim the num value
		function par(num) {
			return parseFloat(num.trim());
		}
		
		//	If no abbreviation letter exists, just return back the parsed number
		if(!/[a-z]/i.test(num)) { return par(num); }
		
		//	Convert num to UpperCase just in case it's not
		num = num.toUpperCase();
		
		//	Main converter function that mashes together the string before returning it as a number
		function addEnding(num, ending) {
		//	Remove letters
			num = num.replace(/[a-z]/gi, '');
			//	Separate by the decimal point
			num = num.split('.');
			var whole = num[0];
			var decimal = num[1];
			
			//	Determine the length of decimal place. Default to 0.
			var decLength = decimal ? decimal.length : 0;
			
			//	Convert decimal place into 3 digit string
			switch(decLength) {
				case 1:
					decimal += '00';
				break;
				case 2:
					decimal += '0';
				break;
				case 3:
					decimal = decimal;
				break;
				default:
					decimal = '000';
				break;
			} 
			
			//	Return the number as a mashed together string
			var output = whole + decimal + ending;
			return output;
		}
		
		//	Call the main converter function for the various abbreviation cases
		if(num.includes('T')) { return par(addEnding(num, '000000000')); }
		if(num.includes('B')) { return par(addEnding(num, '000000')); }
		if(num.includes('M')) { return par(addEnding(num, '000')); }
		if(num.includes('K')) { return par(addEnding(num, '')); }
		
		//	Return FALSE if none of these converter methods were applicable
		return false;
	}
}

//	Testing
/*

//	Test variables
var k = '$ 12.35 K';
var k2 = '$12.35k';
var m = '$ 183.00 M';
var m2 = '$183 m';
var b = '$ 1.62 B';
var b2 = '$1.666B';
var c = '$ 987135.12';
var na = 'n/a';
var NA = 'N/A';
var t = ' 123.45 t ';

console.log(k, convert(k));
console.log(k2, convert(k2));
console.log(m, convert(m));
console.log(m2, convert(m2));
console.log(b, convert(b));
console.log(b2, convert(b2));
console.log(c, convert(c));
console.log(na, convert(na));
console.log(NA, convert(NA));
console.log(t, convert(t));
console.log('emptyString', convert(''));
console.log('null', convert(null));
console.log('undefined', convert(undefined));
console.log('false', convert(false));
*/

module.exports = helpers;