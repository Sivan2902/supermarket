let ErrorType = {
  
    GENERAL_ERROR: {
      id: 1,
      httpCode: 600,
      message:"general error occured.Please refresh the page and try again",
      isShowStackTrace: true,
    },
    USER_NAME_ALREADY_EXIST: {
      id: 2,
      httpCode: 601,
      message: "User name already exist,Please choose a different user name",
      isShowStackTrace: false,
    },
    UNAUTHORIZED: {
      id: 3,
      httpCode: 401,
      message: "Login failed, invalid user name or password. Please try again",
      isShowStackTrace: true,
    },
    INVALID_INPUT: {
      id: 4,
      httpCode:603,
      message: "input fields weren't filled, or the inserted value is invalid",
      isShowStackTrace: false,
    },
    ACCESS_DENIED: {
      id: 5,
      httpCode:604,
      message: "Please logout and login again,Thanks",
      isShowStackTrace: true,
    },
    IMAGE_UPLOAD_FAILED: {
      id: 6,
      httpCode:605,
      message: "image upload failed",
      isShowStackTrace: false,
    },
    CART_ITEM_DELETION_FAILED: {
      id: 7,
      httpCode:606,
      message: "cart item deletion process failed",
      isShowStackTrace: true,
    },
    ID_NUMBER_ALREADY_EXIST: {
      id: 8,
      httpCode:607,
      message:"id number already exist",
      isShowStackTrace: false,
    
    }
  
    
  };
  
  module.exports = ErrorType;
  