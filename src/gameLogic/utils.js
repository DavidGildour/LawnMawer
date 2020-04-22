export function hsl(h, s, l) {
	return `hsl(${h}, ${s}%, ${l}%)`
};

export function map(val, s1, e1, s2, e2) {
	const ratio = (e2 - s2) / (e1 - s1);
	return val * ratio + s2;
};
