module.exports = (sequelize, Sequelize) => {
	
	var Company = sequelize.define('companies', {
		
		symbol: {
			type: Sequelize.STRING
		},
		company: {
			type: Sequelize.STRING,
		},
		last_sale: {
			type: Sequelize.STRING
		},
		market_cap: {
			type: Sequelize.STRING,
		},
		ipo_year: {
			type: Sequelize.STRING
		},
		sector: {
			type: Sequelize.STRING
		},
		industry: {
			type: Sequelize.STRING
		},
		exchange: {
			type: Sequelize.STRING
		},
		created_at: {
			type: Sequelize.DATE,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		apdated_at: {
			type: Sequelize.DATE,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		}
	},
	{
		underscored: true
	});
		
	return Company;
}