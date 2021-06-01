export enum Direction {
	North,
	East,
	South,
	West,
}

export enum ObjectType {
	Wall,
	Cat,
	Gun,
}

export type GameObject = {
	type: ObjectType;
	position: Position;
	connections: Direction[];
};

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
