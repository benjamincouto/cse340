const utilities = require("../utilities/")
const intError = {}

intError.generateError = (req, res, next) => {
    try {
        throw new Error('This is an intentional error');
    } catch (err) {
        next(err);
    }
};

module.exports = intError;