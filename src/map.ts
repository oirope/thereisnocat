import { sample } from 'lodash';
import { Direction, opposite, Position, ObjectType, GameObject } from './utils';

export type Maze = GameObject[][];

type Cell = Position & {
	type: ObjectType;
	visited: boolean;
	connections: Direction[];
};

type Neighbor = Cell & {
	direction: Direction;
};

export function createMap(size: number): Maze {
	let maze: Array<Array<Cell>> = new Array(size).fill(new Array(size));
	maze = maze.map((_, y): Cell[] =>
		maze.map((_, x) => {
			return {
				type: ObjectType.Wall,
				visited: false,
				connections: new Array<Direction>(),
				x,
				y,
			};
		}),
	);

	const stack = new Array<Cell>();
	const init = maze[0][Math.floor(size / 2)];
	init.visited = true;
	stack.push(init);

	while (stack.length !== 0) {
		let current: Cell = stack.pop()!;
		let neighbors = getNeighbors(size, maze, current);

		if (neighbors.length !== 0) {
			stack.push(current);
			let neighbor: Neighbor = sample(neighbors)!;
			current.connections.push(neighbor.direction);
			maze[neighbor.y][neighbor.x].connections.push(
				opposite(neighbor.direction),
			);
			maze[neighbor.y][neighbor.x].visited = true;
			stack.push(neighbor);
		}
	}

	return maze.map((row, y) =>
		row.map((cell, x): GameObject => {
			return {
				type: cell.type,
				position: { x, y },
				connections: [...new Set(cell.connections)],
			};
		}),
	);
}

function getNeighbors(size: number, maze: Cell[][], cell: Cell): Neighbor[] {
	let neighbors = new Array<Neighbor>();

	if (cell.x !== 0 && !maze[cell.y][cell.x - 1].visited)
		neighbors.push({ ...maze[cell.y][cell.x - 1], direction: Direction.West });
	if (cell.x !== size - 1 && !maze[cell.y][cell.x + 1].visited)
		neighbors.push({ ...maze[cell.y][cell.x + 1], direction: Direction.East });
	if (cell.y !== 0 && !maze[cell.y - 1][cell.x].visited)
		neighbors.push({ ...maze[cell.y - 1][cell.x], direction: Direction.North });
	if (cell.y !== size - 1 && !maze[cell.y + 1][cell.x].visited)
		neighbors.push({ ...maze[cell.y + 1][cell.x], direction: Direction.South });

	return neighbors;
}
