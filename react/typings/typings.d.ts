declare module '*.gql' {
  const content: any
  export default content
}

declare module '*.css' {
  const css: Record<string, string>
  export default css
}
