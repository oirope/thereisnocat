import { emitKeypressEvents } from 'readline';
import onChange from 'on-change';
import { Map, createMap } from './map';
import { Direction } from './utils';

type Game = {
	facing: Direction;
	map: Map;
};

export function createGame(): Game {
	return {
		facing: Direction.North,
		map: createMap(7),
	};
}

export function startGame(game: Game) {
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

function drawGame(game: Game) {
}
