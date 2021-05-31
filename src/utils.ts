export type Position = {
	x: number;
	y: number;
};

export function randomPosition(size: number): Position {
	return {
		x: Math.random() * (size - 1) + 1,
		y: Math.random() * (size - 1) + 1,
	};
}
