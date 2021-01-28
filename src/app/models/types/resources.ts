export enum ResourceType {
  Gold,
  Wood,
  Stone,
}

export interface Resource {
  type: ResourceType
  count: number
}
