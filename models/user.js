module.exports = (sequelize, Sequelize) => {
	
	var User = sequelize.define('user', {
		
		username: {
			type: Sequelize.STRING,
			notEmpty: true
		},
		email: {
			type: Sequelize.STRING,
			notEmpty: true,
			validate: {
				isEmail: true
			}
		},
		hashed_password: {
			type: Sequelize.STRING,
			allowNull: false
		},
		first_name: {
			type: Sequelize.STRING,
			notEmpty: true,
		},
		last_name: {
			type: Sequelize.STRING,
			notEmpty: true
		},
		bio: {
			type: Sequelize.TEXT
		},
		last_login: {
			type: Sequelize.DATE
		},
		status: {
			type: Sequelize.ENUM('active', 'inactive'),
			defaultValue: 'active'
		}, 
        bank_balance: {
            type: Sequelize.INTEGER,
            isNumeric: true
        }
	});
	
	return User;
}