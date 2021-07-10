let usersDao = require("../dao/users-dao");
let ServerError = require("../errors/server-error");
let ErrorType = require("../errors/error-type");

//variables for hashing the token
const jwt = require("jsonwebtoken");
const config = require("../config.json");

const RIGHT_SALT = "sdvlmcksoWDfR3$29!@$uuI9mn";
const LEFT_SALT = "l0fr77Rf5!~TTc;%%sXk#$dc";

let cacheModule = require("../Dao/cache-module");
const crypto = require("crypto");



async function addUser(user) {

  // Validations
  let userExist = await usersDao.isUserExistByName(user.userName);

  if (userExist[0]) {

    throw new ServerError(ErrorType.USER_NAME_ALREADY_EXIST);
  }
  
  //validate id number(doesn't exist in DB)
  let userIdNumberExist = await usersDao.isUserExistByIdNumber(user.idNumber);

  if (userIdNumberExist[0]) {

    throw new ServerError(ErrorType.ID_NUMBER_ALREADY_EXIST);
  }
 
  //validate user input
  if(!validateUserInput(user)) {
    
    throw new ServerError(ErrorType.INVALID_INPUT);

  }

  //hashing user's password
  user.password = crypto
                 .createHash("md5")
                 .update(LEFT_SALT + user.password + RIGHT_SALT)
                 .digest("hex");
  
  // add user to DB,returns user's id from DB.
  let userID = await usersDao.addUser(user);
  //generate token
  let saltedUserName = LEFT_SALT + user.userName + RIGHT_SALT;
  const token = jwt.sign({ sub: saltedUserName }, config.secret);

  //save user's id and token in cache
  cacheModule.set(token, userID);

  // login details return to client
  let successfulLoginResponse = { token: token, userType: "CUSTOMER",userName: user.userName };
  return successfulLoginResponse;
}

// delete user from cache
function deleteUserFromServerCache(userToken) {

  let userId = cacheModule.get(userToken);

  if(!userId) { // if the user isn't registered in cache--> throw an error
                   // protects hacking through "Postman" request if it got the token from client
      throw new ServerError(ErrorType.ACCESS_DENIED);

  }

  usersDao.deleteUserFromServerCache(userToken);

}

// login user
async function login(user) {
  
  LoginDetailsValidation(user.userName,user.password)  
  
  // //hashing user's password
  user.password = crypto
                 .createHash("md5")
                 .update(LEFT_SALT + user.password + RIGHT_SALT)
                 .digest("hex");

  let userLoginData = await usersDao.login(user);
  let saltedUserName = LEFT_SALT + user.userName + RIGHT_SALT;
  const token = jwt.sign({ sub: saltedUserName }, config.secret);
  
  //caching user
  cacheModule.set(token,userLoginData.id);

  //what will return to client
  let serverResponse = {
     token : token,
     userType : userLoginData.user_type,

  }

  userLoginData = serverResponse;
  return userLoginData;

}


// validate login input details
function LoginDetailsValidation(userName,password) {

  const maxUserCharacters = 25;
  const maxPasswordCharacters = 20;

  if(!userName) {

    throw new ServerError(ErrorType.UNAUTHORIZED,"user name was not entered");
  }

  if(!password) {

    throw new ServerError(ErrorType.UNAUTHORIZED,"password was not entered");
  }
  
  if(userName.length > maxUserCharacters || password.length > maxPasswordCharacters ) {
  
    throw new ServerError(ErrorType.UNAUTHORIZED,"user name or password > max characters");
  }


}


function validateUserInput(user) {

  // id pattern
  let regex = new RegExp("^[0-9]{9}$");
  let result = regex.test(user.idNumber);

  if(!result) {
    return false;
  }

  //email pattern
  regex = new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$");
  result = regex.test(user.email);
  let emailLength = user.email.length;

  if(!result || emailLength > 30) {
    return false;
  }

  //user name pattern
  regex = new RegExp("^[a-zA-Z0-9_]{3,25}$");
  result = regex.test(user.userName);

  if(!result) {
    return false;
  }

  //password pattern
  let passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*]).{6,20}/;
  regex = new RegExp(passwordPattern);
  result = regex.test(user.password);

  if(!result) {
    return false;
  }

  //city validation
  let cities =  ["Tel-Aviv","Jerusalem","Rishon Letsiyon","Haifa",
                 "Petach Tikva","Ashdod","Be'er Sheva","Netanya",
                 "Bnei Brak","Holon"];
  let isCityValid = cities.includes(user.city);

  if(!isCityValid) {
    return false;
  }
  
  //street pattern
  regex = new RegExp("^[a-zA-Z0-9_ ]{3,150}$");
  result = regex.test(user.street);

  if(!result) {
    return false;
  }

  //first and last name pattern
  regex = new RegExp("^[A-Za-z0-9_-]*$");
  result = regex.test(user.firstName);

  if(!result || user.firstName.length > 25) {
    return false;
  }

  result = regex.test(user.lastName);

  if(!result || user.lastName.length > 25) {
    return false;
  }

  //phone number pattern
  regex = new RegExp("^[0-9]{9,10}$");
  result = regex.test(user.phoneNumber);

  if(!result) {
    return false;
  }

  //input is valid
  return true;

}

//get user address for pre purchase confirmation
async function getUserPurchaseDetails(userToken) {

  let userId = cacheModule.get(userToken);

  if(!userId) { // if the user isn't registered in cache--> throw an error
                // protects hacking through "Postman" request if it got the token from client
        throw new ServerError(ErrorType.ACCESS_DENIED);

  }

  let userPurchaseDetails = await usersDao.getUserPurchaseDetails(userId);
  return userPurchaseDetails;
}


module.exports = {
  addUser,
  deleteUserFromServerCache,
  login,
  getUserPurchaseDetails,
};
