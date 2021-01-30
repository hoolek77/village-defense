export enum ResourceType {
  Gold = 'Gold',
  Wood = 'Wood',
  Stone = 'Stone',
}

export interface Resource {
  type: ResourceType
  count: number
}
