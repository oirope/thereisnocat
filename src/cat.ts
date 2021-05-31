import { Position, randomPosition } from './utils';

export type Cat = {
	position: Position;
};

export function createCat(size: number): Cat {
	return {
		position: randomPosition(size),
	};
}
