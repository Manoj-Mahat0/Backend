let user_type = {
    ADMIN: "ADMIN",
    USER: "USER",
    GYM_OWNER: "GYM_OWNER"
}

let login_messages = {
    userNotFound: "User not found!",
    wrongCombination: "Please enter correct userEmail and Password",
    userAlreadyFound: "User already exist",
    passwordLength: "Password length should be more than 8 chars"
}

let error_messages = {
    500: "Server Error",
    400: "Bad Request"
}

let domainConst = "/api/v1";

module.exports = {
    user_type,
    login_messages,
    error_messages,
    domainConst
};

