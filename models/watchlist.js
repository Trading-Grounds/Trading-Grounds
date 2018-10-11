module.exports = (sequelize, Sequelize) => {
	
	var Watchlist = sequelize.define('Watchlist', {
		
		name: {
			type: Sequelize.STRING
		},
		asset_type: {
			type: Sequelize.STRING,
			defaultValue: 'equity'
		},
		symbol: {
			type: Sequelize.STRING
		},
	},
	{
		underscored: true
	});

	Watchlist.associate = (models) => {
		Watchlist.belongsTo(models.user, {
			allowNull: false
		});
	};
		
	return Watchlist;
}