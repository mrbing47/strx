function isObject(obj) {
	return (
		typeof obj === "object" && !Array.isArray(obj) && obj !== null
	);
}

module.exports = isObject;
