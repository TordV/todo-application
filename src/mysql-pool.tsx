import mysql from 'mysql';

export let pool = mysql.createPool({
  host: 'mysql-ait.stud.idi.ntnu.no',
  connectionLimit: 5,
  user: 'tordvale', // Replace "username" with your mysql-ait.stud.idi.ntnu.no username
  password: 'ycwEH6rx', // Replae "password" with your mysql-ait.stud.idi.ntnu.no password
  database: 'tordvale', // Replace "username" with your mysql-ait.stud.idi.ntnu.no username
});
