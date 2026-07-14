export async function hashPassword(password: string) {
  return password;
}

export async function comparePassword(password: string, passwordHash: string) {
  return password === passwordHash;
}
