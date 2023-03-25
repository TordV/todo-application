const mysql = require('mysql');

let pool = mysql.createPool({
  host: '',
  connectionLimit: 1,
  user: '',
  password: '',
  database: '', 
});

pool.query('CREATE TABLE Tasks (id INT AUTO_INCREMENT PRIMARY KEY, name TEXT, description TEXT, priority_id INT, category_id INT, exp_date DATE, finished BOOLEAN)', 
    (error) => {
      if (error) return console.error(error);
});

pool.query('CREATE TABLE Notes (id INT AUTO_INCREMENT PRIMARY KEY, name TEXT, description TEXT, color TEXT)', 
    (error) => {
      if (error) return console.error(error);
});

pool.query('CREATE TABLE Categories (id INT AUTO_INCREMENT PRIMARY KEY, name TEXT)', 
    (error) => {
      if (error) return console.error(error);
});

pool.query('CREATE TABLE Priorities (id INT AUTO_INCREMENT PRIMARY KEY, name TEXT)', 
    (error) => {
      if (error) return console.error(error);
});

pool.query('INSERT INTO Categories (id, name) VALUES (NULL, ?)', ["General"],
    (error) => {
      if (error) return console.error(error);
});

pool.query('INSERT INTO Priorities (id, name) VALUES (NULL, ?)', ["High"],
    (error) => {
      if (error) return console.error(error);
});

pool.query('INSERT INTO Priorities (id, name) VALUES (NULL, ?)', ["Medium"],
    (error) => {
      if (error) return console.error(error);
});

pool.query('INSERT INTO Priorities (id, name) VALUES (NULL, ?)', ["Low"],
    (error) => {
      if (error) return console.error(error);
});

setTimeout(function () {
  console.log("Closing the setup-application")
  process.exit(0);
}, 5000)
