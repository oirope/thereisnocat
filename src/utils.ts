export enum Direction {
	North,
	East,
	South,
	West,
}

export function opposite(direction: Direction): Direction {
	return (direction + 2) % 4;
}

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

export function validatePosition(position: Position, size: number): boolean {
	return (
		position.x >= 0 && position.x < size && position.y >= 0 && position.y < size
	);
}

export function moveInDirection(
	position: Position,
	direction: Direction,
): Position {
	let pos = { ...position };

	switch (direction) {
		case Direction.North:
			pos.y--;
			break;
		case Direction.East:
			pos.x++;
			break;
		case Direction.South:
			pos.y++;
			break;
		case Direction.West:
			pos.x--;
			break;
	}

	return pos;
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
