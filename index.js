const { regex, merge, splice, isObject, assert } = require("./util");

const assertUndefined = assert((value) => value == undefined);

function populateData(string, templates, valueFn) {
	templates = templates.toSorted((a, b) => valueFn(b) - valueFn(a));

	for (const temp of templates)
		string = splice(string, temp.start, temp.length, temp.value);

	return string;
}

function extractKeys(string) {
	const templates = {
		empty: [],
		array: [],
		key: [],
	};

	let match = [];

	while ((match = regex.template.exec(string)) !== null) {
		let key, store;
		if (regex.empty.test(match[1]))
			[key, store] = [match[1], templates.empty];
		else if (regex.index.test(match[1]))
			[key, store] = [
				regex.normaliseKey(match[1]),
				templates.array,
			];
		else if (regex.key.test(match[1]))
			[key, store] = [
				regex.normaliseKey(match[1]),
				templates.key,
			];
		else throw new Error("Invalid template format =>", match[0]);

		store.push({
			key,
			start: match.index,
			length: match[0].length,
			value: undefined,
		});
	}

	return templates;
}

function segregateValues(values) {
	return values.reduce(
		(acc, curr) => {
			if (isObject(curr))
				return {
					...acc,
					object: { ...acc.object, ...curr },
				};
			else
				return {
					...acc,
					array: [...acc.array, curr],
				};
		},
		{ array: [], object: {} }
	);
}

function updateKey(key, max) {
	const index = regex.index.exec(key)[1];
	return key.replace(index, index == 0 ? index : index - max);
}

function resolveValue(key, obj) {
	const keyParts = key.split(".");
	for (let part of keyParts) obj = obj?.[part];
	return obj;
}

function strx(string, ...args) {
	const templates = extractKeys(string);

	const unUsedTemplateIndex = Object.fromEntries(
		Object.keys(templates).map((ele) => [
			ele,
			new Set(Array(templates[ele].length).keys()),
		])
	);

	function process(...values) {
		const { array, object } = segregateValues(values);

		const maxIndex = array.length;
		const usedIndex = new Set();

		if (array.length > 0) {
			for (const ix of unUsedTemplateIndex.array) {
				const element = templates.array[ix];
				const workingKey = element.updated ?? element.key;

				const elementIndex = parseInt(
					regex.index.exec(workingKey)[1]
				);

				if (elementIndex < maxIndex) {
					element.value = assertUndefined(
						resolveValue(workingKey, array),
						`Received undefined for ${element.key} in array arguments.`
					);

					usedIndex.add(elementIndex);
					unUsedTemplateIndex.array.delete(ix);
				} else {
					element.updated = updateKey(workingKey, maxIndex);
				}
			}

			const unUsedArray = array.filter(
				(_, index) => !usedIndex.has(index)
			);

			for (const ix of unUsedTemplateIndex.empty) {
				if (unUsedArray.length === 0) break;

				const element = templates.empty[ix];
				element.value = unUsedArray.shift();
				unUsedTemplateIndex.empty.delete(ix);
			}
		}

		if (Object.keys(object).length > 0) {
			for (const ix of unUsedTemplateIndex.key) {
				const element = templates.key[ix];

				const value = resolveValue(element.key, object);
				if (value !== undefined) {
					element.value = value;
					unUsedTemplateIndex.key.delete(ix);
				}
			}
		}

		if (
			Object.values(unUsedTemplateIndex).some(
				(ele) => ele.size > 0
			)
		) {
			process.templates = templates;
			return process;
		}

		const merged = merge(
			(e) => e.start,
			...Object.values(templates)
		);

		return regex.normaliseEscape(
			populateData(string, merged, (e) => e.start)
		);
	}

	return args.length > 0 ? process(...args) : process;
}

module.exports = strx;
