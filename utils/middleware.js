const logger = require("./logger");

const requestLogger = (req, res, next) => {
	logger.info(new Date(), req.method, req.path, req.body);
	next();
};

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (err, req, res, next) => {
	if (err.name === "CastError")
		return res.status(400).send({ error: "invalid id" });

	if (err.name === "ValidationError") {
		let errors = {};
		Object.keys(err.errors).forEach((errorName) => {
			errors[errorName] = err.errors[errorName].message;
		});
		return res.status(400).send({ error: errors });
	}

	if (err.name === "JsonWebTokenError")
		return res.status(401).json({ error: "invalid token" });

	if (err.name === "TokenExpiredError")
		return res.status(401).json({ error: "token expired" });

	logger.error(err.message);
	next(err);
};

module.exports = {
	requestLogger,
	unknownEndpoint,
	errorHandler,
};
