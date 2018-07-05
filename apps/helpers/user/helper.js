var bcrypt = require('bcrypt');
var config = require('config');

function isRegister( user ) {
    if((user.email).trim().length == 0 || (user.password).trim().length == 0) return false;
    if((user.password).localeCompare(user.repeat_password) != 0) return false;
    return true;
}

function generatePasswordByBcrypt(password) {
    var saltRounds = config.get('saltRounds');
    var salt = bcrypt.genSaltSync(saltRounds);
    var hash_password = bcrypt.hashSync(password, salt);
    return hash_password;
}

function isMatch(password = '', hash) {
    return bcrypt.compareSync(password, hash);
}

module.exports = {
    isRegister,
    generatePasswordByBcrypt,
    isMatch,
}