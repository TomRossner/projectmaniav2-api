import { INewUser } from "./interfaces.js";

// Regex patterns
const REGEX_PATTERNS = {
    EMAIL: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
    PASSWORD: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
    NAME: /([a-zA-Z]{3,30}\s*)+/,
}

// Pattern types
const PATTERN_TYPES = {
    EMAIL: 'email',
    PASSWORD: 'password',
    NAME: 'name'
}



// Check regex pattern
const checkPattern = (type: string, input: string) => {
    
    const {EMAIL, PASSWORD, NAME} = REGEX_PATTERNS;

    switch(type) {
        case PATTERN_TYPES.EMAIL:
            return input.match(EMAIL);
        case PATTERN_TYPES.PASSWORD:
            return input.match(PASSWORD);
        case PATTERN_TYPES.NAME:
            return input.match(NAME);
        default:
            return false;
    }
}

// Check user inputs
const validateUserData = (userData: INewUser) => {
    const {email, password, firstName, lastName} = userData;
    
    if (
        !checkPattern(PATTERN_TYPES.EMAIL, email) ||
        !checkPattern(PATTERN_TYPES.PASSWORD, password) ||
        !checkPattern(PATTERN_TYPES.NAME, firstName) ||
        !checkPattern(PATTERN_TYPES.NAME, lastName)
    ) return false;

    else return true;
}

export {
    checkPattern,
    validateUserData
}