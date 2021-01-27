export interface elementConfig {
  type: string
  content?: string
  id?: string
  classes?: string[]
  handleEvent?: { type: string; callback: () => void }
  innerHTML?: string
  properties?: object
  styles?: { property: string; value: string }
}
