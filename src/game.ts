import { cursor } from 'ansi-escape-sequences';
import { cursorTo } from 'readline';
import { Cat, createCat } from './cat';
import { Gun, createGun } from './gun';

export type Game = {
	size: number;
	cat: Cat;
	gun: Gun;
};

export function createGame(initialSize: number): Game {
	return {
		size: initialSize,
		cat: createCat(initialSize),
		gun: createGun(initialSize),
	};
}

export function playGame(game: Game) {}
