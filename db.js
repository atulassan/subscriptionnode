const mysql = require("mysql2");

class Database {
  constructor(config) {
    this.pool = mysql.createPool({
      connectionLimit: 10,
      ...config,
    });
  }

  // Low-level query method
  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, params, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  // ✅ Your runQuery wrapper with status, error, etc.
  async runQuery(sql, args = []) {
    try {
      const result = await this.query(sql, args);
      return {
        status: true,
        error: false,
        result: JSON.parse(JSON.stringify(result)), // deep clone for safety
      };
    } catch (error) {
      console.error("SQL Error:", error);
      return {
        status: false,
        error: true,
        code: error.code,
        sqlMessage: error.sqlMessage,
      };
    }
  }

//use instead above two functions
/*
async runQuery(sql, params = []) {
  return new Promise((resolve) => {
    this.pool.query(sql, params, (err, results) => {
      if (err) {
        console.error("SQL Error:", err);
        return resolve({
          status: false,
          error: true,
          code: err.code,
          sqlMessage: err.sqlMessage,
        });
      }

      // Detect query type (first word of SQL)
      const queryType = sql.trim().split(" ")[0].toUpperCase();

      if (queryType === "SELECT") {
        resolve({
          status: true,
          error: false,
          result: JSON.parse(JSON.stringify(results)), // array of rows
        });
      } else if (queryType === "INSERT") {
        resolve({
          status: true,
          error: false,
          insertId: results.insertId, // ID of new row
          affectedRows: results.affectedRows,
        });
      } else if (["UPDATE", "DELETE"].includes(queryType)) {
        resolve({
          status: true,
          error: false,
          affectedRows: results.affectedRows, // how many rows changed/removed
        });
      } else {
        resolve({
          status: true,
          error: false,
          result: results, // fallback for other queries
        });
      }
    });
  });
}
}
*/

  // Close pool
  close() {
    return new Promise((resolve, reject) => {
      this.pool.end(err => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}

module.exports = Database;
