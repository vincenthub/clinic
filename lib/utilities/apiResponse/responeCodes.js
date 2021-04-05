module.exports = {
    //Auth Code starts with 0001
    USER_TAKEN: { 
        errorCode: "e0001", 
        errorType: "ERROR_USERNAME_NOT_AVAILABLE", 
        errorDescription: "Unable to add new user" 
    },
    WRONG_CREDENTIALS: { 
        errorCode: "e0002", 
        errorType: "ERROR_INVALID_CREDENTIALS", 
        errorDescription: "Invalid credential supplied"  
    },
    ACCOUNT_LOCKED: { 
        errorCode: "e0003", 
        errorType: "ERROR_ACCOUNT_LOCKED", 
        errorDescription: "Your account is locked" 
    },
    UNAUTHORIZE_ACCESS: { 
        errorCode: "e0004", 
        errorType: "ERROR_UNAUTHORIZE_ACCESS", 
        errorDescription: "Authorization access denied!" 
    },
}