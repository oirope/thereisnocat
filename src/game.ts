import { emitKeypressEvents } from 'readline';
import onChange from 'on-change';
import { Cat, createCat } from './cat';
import { Gun, createGun } from './gun';

enum Direction {
	North,
	East,
	South,
	West,
}

type Game = {
	size: number;
	facing: Direction;
	cat: Cat;
	gun: Gun;
};

export function createGame(size: number): Game {
	return {
		size: size,
		facing: Direction.North,
		cat: createCat(size),
		gun: createGun(size),
	};
}

export function playGame(game: Game) {
	emitKeypressEvents(process.stdin);
	process.stdin.setRawMode(true);

	process.stdin.on('keypress', (_, key) => {
		if (key) {
			switch (key.name) {
				case 'a':
					if (game.facing-- === Direction.North) game.facing = Direction.West;
					break;
				case 'd':
					if (game.facing++ === Direction.West) game.facing = Direction.North;
					break;
				case 'c':
					if (key.ctrl) process.exit();
					break;
			}
		}
	});

	game = onChange(game, function () {
		drawGame(this);
	});
	drawGame(game);
}

function drawGame(game: Game) {}
