const prismaClient = require("../db/prismaClient")

async function createUser(name, cpf, email, password) {
    const usuario = await prismaClient.usuario.create({
        data: { name, cpf, email, password }
    })

    return usuario
}

async function findUserByEmail(email) {
    const usuario = await prismaClient.usuario.findUnique({
        where: { email }
    })

    return usuario
}

async function findUserById(id) {
    const user = prismaClient.usuario.findFirst({
        where: { id_user: String(id) }
    })

    return user
}

async function findAllUsers() {
    const users = await prismaClient.usuario.findMany()
    return users
}

async function updateUser(id, name, email) {
    const user = await prismaClient.usuario.update({
        where: { id_user: String(id) },
        data: { name, email }
    })

    return user
}

async function deleteUserById(id) {
    return prismaClient.usuario.delete({ where: { id_user: String(id) } })
}

module.exports = {
    createUser,
    findAllUsers,
    deleteUserById,
    updateUser,
    findUserById,
    findUserByEmail
}
