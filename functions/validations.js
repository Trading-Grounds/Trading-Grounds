var validations = {
	is_blank: (value) => {
		return typeof value === undefined || value.trim() === '';
	},
	
	has_presence: (value) => {
		return !validations.is_blank(value);
	},
	
	has_length_greater_than: (value, min) => {
		return value.length > min
	},
	
	has_length_less_than: (value, max) => {
		return value.length < max
	},
	
	has_length_exactly: (value, exact) => {
		return value.length == parseInt(exact);
	},
	
	has_length: (value, optionsObj) => {
		if('min' in optionsObj  && !validations.has_length_greater_than(value, optionsObj.min -1)) {
			return false;
		} else if('max' in optionsObj && !validations.has_length_less_than(value, optionsObj.max +1)) {
			return false;
		} else if('exact' in optionsObj && !validations.has_length_exactly(value, optionsObj.exact)) {
			return false;
		} else if(validations.is_blank(value)) {
			return false;
		} else {
			return true;
		}
	},
	
	in_array: (value, array) => {
		return array.indexOf(value) >= 0;
	},
	
	is_empty: (array) => {
		return array === undefined || array.length == 0
	},
	
	strpos: (substring, string) => {
		return string.indexOf(substring) < 0 ? false : string.indexOf(substring)
	},
	
	has_substr: (substring, string) => {
		return string.includes(substring);
	//	This would also work:
	//	return this.strpos(substring, string) !== false;
	},
	
	has_valid_email_format: (value) => {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(value).toLowerCase());
	},
	has_word_chars_only: (value) => {
		return /^[A-Za-z0-9_-]*$/.test(value);
	},
	has_number: (value) => {
		return /(?=.*\d)/.test(value);
	},
	has_uppercase: (value) => {
		return /(?=.*[A-Z])/.test(value);
	},
	has_lowercase: (value) => {
		return /(?=.*[a-z])/.test(value);
	},
	has_whitespace: (value) => {
		return /(?=^\S*$)/.test(value);
	},
	has_non_alphanumeric: (value) => {
		return /(?=.*[\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\{\}\\\|\;\:\'\"\,\.\<\>\/\?])/.test(value);
	}
	/*
	
	has_unique_username: (username, current_id='0') => {
		//	TODO
	}
	*/
}

module.exports = validations;