export interface ElementConfig {
  type: string
  content?: string
  id?: string
  classes?: string[]
  handleEvent?: { type: string; callback: () => void }
  innerHTML?: string
  properties?: object
}
