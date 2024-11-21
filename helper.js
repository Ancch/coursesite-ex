const bcrypt = require('bcrypt');

function hashPassword(password) {
    return bcrypt.hashSync(password, becrypt.genSaltSync());
}

function comparePassword(raw, hash) {
    return bcrypt.compareSync(raw, hash);
}

module.exports = {
    hashPassword,
    comparePassword,
}