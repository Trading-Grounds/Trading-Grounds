USE trading_grounds_db;

CREATE TABLE companies (
	id INT NOT NULL AUTO_INCREMENT,
	symbol VARCHAR(10),
	company VARCHAR(255),
	last_sale VARCHAR(30),
	market_cap VARCHAR(30),
	ipo_year VARCHAR(30),
	sector VARCHAR(100),
	industry VARCHAR(100),
	exchange VARCHAR(10),
	PRIMARY KEY (id),
	INDEX (id),
	INDEX (symbol),
	INDEX (sector)
);

ALTER TABLE companies MODIFY COLUMN updated_at DATE NULL DEFAULT NULL;

LOAD DATA INFILE 'path/to/exchanges.csv'
replace INTO TABLE companies
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n';