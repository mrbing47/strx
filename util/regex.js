module.exports = {
	brackets: /\[(.*?)\]/g,
	escape: /{{(.+?)}}/g,
	index: /^(\d+)(?:\.|\[)?/,
	key: /^(\w+)(\.\w+|\[\w+\])*$/,
	empty: /^(~[^~{}]+~)?$/,
	template: /(?<!{){([^{}]*)}(?!})/g,
	normaliseKey(key) {
		return key.replaceAll(this.brackets, ".$1");
	},
	normaliseEscape(text) {
		return text.replaceAll(this.escape, "{$1}");
	},
};
