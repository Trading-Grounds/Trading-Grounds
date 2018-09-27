'use strict';

//	Dependencies
var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var basename = path.basename(module.filename);

//	Determine the current environment based upon the .env file (defaults to 'development')
var env = process.env.NODE_ENV || "development";

//	Require the config.json file using the declared environment above
var config = require(__dirname + "/../config/config.json")[env];

//	Initialize a db object to hold all of our models
var db = {};

//	Set DB configurations using either the .env or the config.json properties
if (config.use_env_variable) {
	var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
	var sequelize = new Sequelize(
		config.database,
		config.username,
		config.password,
		config
	);
}

fs
	//	Find all files within the current directory (models)
	.readdirSync(__dirname)
	//	Filter out the this file ('index.js'), any file starting with a '.', and any file not ending in '.js'
	.filter(function(file) {
		return (
			file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
		);
	})
	//	Create a new model for each file using the data within them and "push" that model into the db object
	.forEach(function(file) {
		var model = sequelize.import(path.join(__dirname, file));
		db[model.name] = model;
	});

//	Loop through all the models in the db object and make any necessary associations
Object.keys(db).forEach(function(modelName) {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

//	Add the database connection to the db object
db.sequelize = sequelize;
//	Add the Sequelize package to the db object
db.Sequelize = Sequelize;

//	Export the db object to be used elsewhere in the app
module.exports = db;