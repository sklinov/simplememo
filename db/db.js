const mariadb = require('mariadb');
var database = require('../config');

var dbQuery = async function(query) {
  const pool = mariadb.createPool(database);
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(query);
    conn.end();
    return result;
  } catch (err) {
    console.log(err);
  } 
}

module.exports = dbQuery;