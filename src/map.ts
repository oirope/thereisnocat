import { sample } from 'lodash';
import { Direction, ObjectType, GameObject, Position } from './utils';

export type Map = {
	map: GameObject[][];
};

type Cell = Position & {
	type: ObjectType;
	visited: boolean;
	connections: Direction[];
};

type Neighbor = Cell & {
	direction: Direction;
};

export function createMap(size: number): Map {
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
				(neighbor.direction + 2) % 3,
			);
			maze[neighbor.y][neighbor.x].visited = true;
			stack.push(neighbor);
		}
	}

	return {
		map: maze.map((row, y) =>
			row.map((cell, x): GameObject => {
				return {
					type: cell.type,
					position: { x, y },
					connections: cell.connections,
				};
			}),
		),
	};
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
