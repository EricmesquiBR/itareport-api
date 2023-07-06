import { PrismaClient, Usuario } from "@prisma/client"


const prisma = new PrismaClient()

async function CriarUsuario(userData: Partial<Usuario>): Promise<Usuario> {
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
