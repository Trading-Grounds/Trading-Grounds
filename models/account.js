module.exports = (sequelize, Sequelize) => {

    var Account = sequelize.define('account', {

        username: {
            type: Sequelize.STRING,
            
        },
		stock_symbol: {
            type: Sequelize.STRING,

        },
        stock_shares: {
            type: Sequelize.INTEGER,
            isNumeric: true
        },
        date: {
            type: Sequelize.DATE,
        },
        stock_dollar_amount: {
            type: Sequelize.INTEGER,
            isNumeric: true
        }
    });

    return Account;
}
