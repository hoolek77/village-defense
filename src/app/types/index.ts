export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export enum ResourceType {
  Gold,
  Wood,
  Stone,
}

export type Resource = {
  type: ResourceType
  count: number
}

export enum Fractions {
  Humans,
  Elves,
  Dwarves,
}

export const ONE_SECOND = 1000
