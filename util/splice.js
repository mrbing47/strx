function splice(str, start, length, target) {
	return str.slice(0, start) + target + str.slice(start + length);
}

module.exports = splice;
