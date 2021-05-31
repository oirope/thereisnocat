import { Position, randomPosition } from './utils';

export type Gun = {
	position: Position;
};

export function createGun(size: number): Gun {
	return {
		position: randomPosition(size),
	};
}
