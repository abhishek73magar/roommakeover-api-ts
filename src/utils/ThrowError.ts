const ThrowError = (error: unknown): Promise<never> => {
  if(error instanceof Error) return Promise.reject(error.message)
  return Promise.reject(error)
}

export default ThrowError