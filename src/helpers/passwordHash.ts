import bycrypt from 'bcrypt'
const saltRounds = 10

const generateHash = async(text: string): Promise<string> => {
  try {
    const salt = await bycrypt.genSalt(saltRounds)
    const hash = await bycrypt.hash(text, salt)
    return hash;
  } catch (error) {
    return Promise.reject(error)
  }
}

const compareHash = async(text: string, hash: string): Promise<boolean> => {
  try {
    const status = await bycrypt.compare(text, hash)
    return status;
  } catch (error) {
    return Promise.reject(error)
  }
}

export { generateHash, compareHash }