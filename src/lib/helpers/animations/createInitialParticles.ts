import { DISTANCE_PARTICLES, PARTICLE_COUNT } from '@/lib/utils/constants';

export type Particle = {
	id: number;
	x: number;
	y: number;
};

export const createInitialParticles = () => {
	const particles: Particle[] = [];
	for (let i = 0; i < PARTICLE_COUNT; i++) {
		const angle = ((i * 120) / (PARTICLE_COUNT - 1) + 210) * (Math.PI / 180);
		particles.push({
			id: i,
			x: Math.cos(angle) * DISTANCE_PARTICLES,
			y: Math.sin(angle) * DISTANCE_PARTICLES,
		});
	}
	return particles;
};
