import { prismaClient } from "../db/prismaClient"


const prisma = new prismaClient()

async function CriarUsuario(userData) {
    const usuario = await prisma.usuario.create({
        data: {
            name: userData.name || "",
            email: userData.email || "",
            cpf: userData.cpf || "",
            password: userData.password || ""
        }
    })

    return usuario
}

export { CriarUsuario }
