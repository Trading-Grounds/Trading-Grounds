module.exports = (sequelize, Sequelize) => {
	
	var Transaction = sequelize.define('Transaction', {
		
		transaction_type: {
			type: Sequelize.STRING
		},
		asset_name: {
			type: Sequelize.STRING
		},
		asset_type: {
			type: Sequelize.STRING,
			defaultValue: 'equity'
		},
		asset_symbol: {
			type: Sequelize.STRING
		},
		transaction_date: {
			type: Sequelize.DATE,
			defaultValue: Sequelize.NOW
		},
		quantity: {
			type: Sequelize.INTEGER
		},
		price: {
			type: Sequelize.DECIMAL
		}
	},
	{
		underscored: true
	});

	Transaction.associate = (models) => {
		Transaction.belongsTo(models.user, {
			allowNull: false
		});
	};
		
	return Transaction;
}