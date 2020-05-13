const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const fs = require('fs')

const apiKey = fs.readFileSync('./config/apikey');

/**
 * Creates a random string with given length
 * @param {number} length - length of random string
 * @returns {string}
 */
const generateRandomString = (length) => {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

/**
 * Hashes the password with given salt
 * @param {string} password - plain text password
 * @param {string} salt - random salt
 * @returns {string}
 */
const hashPasswordWithSHA512 = (password, salt) => {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
};

/**
 * Encrypts a password
 * @param {string} password - plain text password
 * @returns {string}
 */
const generateHashedPasswordWithSalt = (password) => {
    const salt = generateRandomString(16);
    const hashedPassword = hashPasswordWithSHA512(password, salt);
    return `${salt}:${hashedPassword}`
};

/**
 * Verifies if a password is correct
 *
 * @param password - given password
 * @param hashedPasswordWithSalt - stored hashed password
 * @returns {boolean} - true if the password is correct, or false otherwise
 */
const verifyPassword = (password, hashedPasswordWithSalt) => {
    const [salt, hashedPassword] = hashedPasswordWithSalt.split(":");
    const pw = hashPasswordWithSHA512(password, salt);
    return pw === hashedPassword;
};

const generateJWT = (authObject) => {
    return jwt.sign(authObject, apiKey, { expiresIn: '1d' });
}

const verifyJWT = (token, callback) => {
    return jwt.verify(token, apiKey, callback);
}

module.exports = {
    generateHashedPasswordWithSalt,
    generateJWT,
    verifyPassword,
    verifyJWT
};