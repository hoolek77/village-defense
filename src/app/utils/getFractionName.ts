import { Fractions } from '../models'
import { capitalizeFirstLetter } from './strings'

export function getFractionForName(fractionName: string) {
  return (<any>Fractions)[capitalizeFirstLetter(fractionName)]
}
