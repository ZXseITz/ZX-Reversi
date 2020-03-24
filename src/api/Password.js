const crypto = require('crypto');

module.exports = {
    /**
     * Creates a random string with given length
     * @param {number} length - length of random string
     * @returns {string}
     */
    generateRandomString: (length) => {
        return crypto.randomBytes(Math.ceil(length / 2))
            .toString('hex')
            .slice(0, length);
    },

    /**
     * Hashes the password with given salt
     * @param {string} password - plain text password
     * @param {string} salt - random salt
     * @returns {string}
     */
    hashPasswordWithSHA512: (password, salt) => {
        return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    },

    /**
     * Encrypts a password
     * @param {string} password - plain text password
     * @returns {string}
     */
    generateHashedPasswordWithSalt: (password) => {
        const salt = generateRandomString(16);
        const hashedPassword = hashPasswordWithSHA512(password, salt);
        return `${salt}:${hashedPassword}`
    }
}