export function unique<T>(arr: Array<T>): Array<T> {
	return arr.filter((v, i, a) => a.indexOf(v) === i);
}

export function difference<T>(a: Array<T>, b: Array<T>): Array<T> {
	const arr = new Array<T>();
	for (const e of a) {
		if (!b.includes(e)) {
			arr.push(e);
		}
	}
	return arr;
}