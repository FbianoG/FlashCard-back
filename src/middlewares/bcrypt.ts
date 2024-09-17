const bcrypt = require('bcrypt')
const saltRounds = 10


export const hashPassword = async (password: string) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds)
        const hash = await bcrypt.hash(password, salt)
        return hash;
    } catch (error) {
        throw error;
    }
}

export const comparePassword = async (plainPassword: string, hashedPassword: string) => {
    try {
        const match = await bcrypt.compare(plainPassword, hashedPassword); // compara a senha (senhaDigitada, senhaNoDataBase)
        return match;
    } catch (error) {
        throw error;
    }
}

