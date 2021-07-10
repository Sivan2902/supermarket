let connection = require("./connection-wrapper");
let ErrorType = require("./../errors/error-type");
let ServerError = require("./../errors/server-error");
let cacheModule = require("../Dao/cache-module");


async function addUser(user) {

  let sql = "INSERT INTO users (id_number, first_name, last_name, user_name, password, city, street, user_type, email, phone_number)  VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
  let userType = "CUSTOMER";
  let parameters = [user.idNumber,user.firstName,user.lastName,user.userName,user.password,user.city,user.street,userType,user.email,user.phoneNumber];

  try {
    
      let response = await connection.executeWithParameters(sql, parameters);
      return response.insertId;
  
  } catch (e) {

      console.log(error);
      throw new ServerError(ErrorType.GENERAL_ERROR,JSON.stringify(user), e);
  }

  
}

//calls DB to check if the new user name is not already taken by another user.
async function isUserExistByName(userName) {

  let sql = "SELECT user_name FROM users where user_name = ?";
  let parameters = [userName];
  try {
 
      let result = await connection.executeWithParameters(sql, parameters);
      return result;
  }
  catch(e) {

      console.log(e);
      throw new ServerError(ErrorType.GENERAL_ERROR,sql, e);
   
  }
}

async function isUserExistByIdNumber(idNumber) {

  let sql = `SELECT id_number as "idNumber" FROM users where id_number = ?;`;
  let parameters = [idNumber];

  try {
   
      let result = await connection.executeWithParameters(sql, parameters);
      return result;

  }
  catch(e) {

      console.log(e);
      throw new ServerError(ErrorType.GENERAL_ERROR,sql, e);

  }
}


async function login(user) {

  let sql = "SELECT * FROM users where user_name =? and password =?";
  let parameters = [user.userName, user.password];
  let usersLoginResult;

  try {
  
      usersLoginResult = await connection.executeWithParameters(sql, parameters);
  
  } catch (e) {

      console.log(e);
      throw new ServerError(ErrorType.GENERAL_ERROR, JSON.stringify(user), e);
  }

  // A functional (!) issue which means - the userName + password do not match
  if (usersLoginResult == null || usersLoginResult.length == 0) {
    throw new ServerError(ErrorType.UNAUTHORIZED);
  }

  return usersLoginResult[0];
}


async function getUserPurchaseDetails(userId) {

  let sql = "SELECT city,street FROM users where id =?";
  let parameters = [userId];
  let usersPurchaseDetails;

  try {
  
      usersPurchaseDetails = await connection.executeWithParameters(sql, parameters);
      return usersPurchaseDetails[0];

  } catch (e) {

      console.log(e);
      throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }

}

function deleteUserFromServerCache(userToken) {
  
  if(cacheModule.dataMap.has(userToken)) {

      cacheModule.dataMap.delete(userToken);
  }

  else {

    throw new ServerError(ErrorType.ACCESS_DENIED);
  }

} 

module.exports = {
  addUser,
  deleteUserFromServerCache,
  login,
  isUserExistByName,
  isUserExistByIdNumber,
  getUserPurchaseDetails,
  
}
