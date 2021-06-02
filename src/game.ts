import { emitKeypressEvents } from 'readline';
import onChange from 'on-change';
import { style } from 'ansi-escape-sequences';
import { Maze, createMap } from './map';
import {
	Direction,
	opposite,
	Position,
	validatePosition,
	moveInDirection,
	GameObject,
} from './utils';

type Game = {
	facing: Direction;
	position: Position;
	map: Maze;
	size: number;
};

export function createGame(size: number): Game {
	return {
		facing: Direction.South,
		position: {
			x: Math.floor(size / 2),
			y: 0,
		},
		map: createMap(size),
		size,
	};
}

export function startGame(game: Game) {
	emitKeypressEvents(process.stdin);
	process.stdin.setRawMode(true);

	process.stdin.on('keypress', (_, key) => {
		if (key) {
			switch (key.name) {
				case 'w':
					let next = moveInDirection(game.position, game.facing);
					if (
						validateMove(game.map, game.position, next, game.facing, game.size)
					)
						game.position = next;
					break;
				case 'a':
					if (game.facing-- === 0) game.facing = 3;
					break;
				case 's':
					let back = moveInDirection(game.position, opposite(game.facing));
					if (
						validateMove(
							game.map,
							game.position,
							back,
							opposite(game.facing),
							game.size,
						)
					)
						game.position = back;
					break;
				case 'd':
					game.facing = (game.facing + 1) % 4;
					break;
				case 'e':
					break;
				case 'c':
					if (key.ctrl) quit();
					break;
			}
		}
	});

	game = onChange(game, function (path) {
		if (path === 'facing' || path === 'position') drawGame(this);
	});
	drawGame(game);
}

function drawGame(game: Game) {
	console.clear();

	let ray = castRay(game.map, game.position, game.facing, game.size);
	let depth = ray.length;

	const depth_array = [4, 3, 3, 2, 2];
	const width = 28;
	const height = 22;
	let head = 0;

	process.stdout.write(style.red);

	for (let i = 0; i < depth; i++) {
		const d = depth_array[i];
		const right = ray[i].connections.includes((game.facing + 1) % 4);
		const left = ray[i].connections.includes(
			game.facing - 1 === -1 ? 3 : game.facing - 1,
		);

		for (let j = head; j < Math.min(head + d, Math.floor(height / 2)); j++) {
			if (left && i !== 0) {
				for (let k = head; k <= height - head; k++) writeAt(']', head, k);
			} else if (!left) {
				writeAt('\\', j, j);
				writeAt('/', j, height - j);
			} else {
				writeAt('_', j, head + d - 1);
				writeAt('_', j, height - head - d);
			}

			if (right && i !== 0) {
				for (let k = head; k <= height - head; k++)
					writeAt('[', width - head, k);
			} else if (!right) {
				writeAt('\\', width - j, height - j);
				writeAt('/', width - j, j);
			} else {
				writeAt('_', width - j, head + d - 1);
				writeAt('_', width - j, height - head - d);
			}
		}
		head += d;
	}

	for (let i = head; i <= width - head; i++) {
		writeAt('_', i, head - 1);
		writeAt('_', i, height - head);
	}

	let gun = `
	\\\\__ 
	 ,\\ #\\)
	 \\   ##\\_
	  \\    ##\\_
	   \\     ##\\
	   /  _    /
	   \\( )    |
	`.split('\n');

	process.stdout.write(style.gray);

	for (let line = 0; line < gun.length; line++) {
		process.stdout.cursorTo(18, 15 + line);
		process.stdout.write(gun[line]);
	}

	process.stdout.cursorTo(0, height);
}

function castRay(
	maze: Maze,
	position: Position,
	direction: Direction,
	size: number,
): GameObject[] {
	const cast = (ray: GameObject[]): GameObject[] => {
		let current = ray.slice(-1).pop()!;
		let next = moveInDirection(current.position, direction);

		if (validateMove(maze, current.position, next, direction, size)) {
			ray.push(mazeObject(maze, next));
		} else return ray;

		return cast(ray);
	};

	return cast([maze[position.y][position.x]]);
}

function validateMove(
	maze: Maze,
	initial: Position,
	position: Position,
	direction: Direction,
	size: number,
): boolean {
	if (!validatePosition(initial, size) || !validatePosition(position, size))
		return false;

	const init = mazeObject(maze, initial);
	const pos = mazeObject(maze, position);

	if (
		!init.connections.some(
			(dir) => dir === direction && pos.connections.includes(opposite(dir)),
		)
	)
		return false;

	return true;
}

function mazeObject(maze: Maze, position: Position): GameObject {
	return maze[position.y][position.x];
}

function writeAt(text: string, x: number, y: number) {
	process.stdout.cursorTo(x, y);
	process.stdout.write(text);
}

function quit() {
	process.stdout.write(style.reset);
	console.clear();
	process.exit();
}
