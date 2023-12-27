function merge(evaluator = (e) => e, ...args) {
	const pointers = Array(args.length).fill(0);

	const resultLength = args.reduce(
		(acc, curr) => acc + curr.length,
		0
	);

	const merged = [];

	while (merged.length < resultLength) {
		const current = {
			value: Infinity,
			data: undefined,
			pointer: -1,
		};

		for (const [ix, arg] of args.entries()) {
			if (pointers[ix] == arg.length) continue;

			const compareValue = evaluator(arg[pointers[ix]]);
			if (compareValue < current.value)
				[current.value, current.data, current.pointer] = [
					compareValue,
					arg[pointers[ix]],
					ix,
				];
		}

		merged.push(current.data);
		pointers[current.pointer]++;
	}

	return merged;
}

module.exports = merge;
