import mysql from 'mysql';

export let pool = mysql.createPool({
  host: '',
  connectionLimit: 5,
  user: '', 
  password: '', 
  database: '',
});
