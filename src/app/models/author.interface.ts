import { Work } from "./work.interface";

export interface Author {
  key: string,
  name: string,
  works: Work[]
}
