function assert(predicate) {
	return function (value, ...message) {
		if (predicate(value)) throw new Error(message.join(" "));
		return value;
	};
}

module.exports = assert;
