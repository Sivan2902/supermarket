const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "34.65.238.69", // Computer
  user: "root", // Username
  password: "1234", // Password
  database: "supermarket", // Database name
  multipleStatements: true,

});

// Connect to the database:
connection.connect((err) => {
  if (err) {
    console.log("Failed to create connection + " + err);
    return;
  }
  console.log("We're connected to MySQL");
});



function executeWithNoParam(sql) {
  return new Promise((resolve, reject) => {
    connection.execute(sql, (err, result) => {
      if (err) {
        
         console.log("Error " + err);
        reject(err);
        return;
      }

      resolve(result);
    });
  });
}



function executeWithParameters(sql, parameters) {
  return new Promise((resolve, reject) => {
      connection.query(sql, parameters, (err, result) => {
          if (err) {
              console.log("Failed interacting with DB, calling reject");
              reject(err);
              return;
          }
          resolve(result);
      });
  });
}


module.exports = {
  executeWithNoParam,
  executeWithParameters,
};
