// types/package.d.ts
declare module '*/package.json' {
  export interface PackageJson {
    name: string
    version: string
    author: string
    description: string
    [key: string]: any
  }

  const value: PackageJson
  export default value
}
