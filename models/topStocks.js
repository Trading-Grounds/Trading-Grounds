module.exports = (sequelize, Sequelize) => {

    var TopStocks = sequelize.define('TopStock', {

            Company: {
            type: Sequelize.STRING,
            notNull: true
            
        },
		symbol: {
            type: Sequelize.STRING,
            notNull: true

        }

    }, {
        timestamps: false
    });



    return TopStocks;
}
