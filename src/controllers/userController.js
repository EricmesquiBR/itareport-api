const userService = require("../services/usuarioService")

async function createUser(req, res) {
    try {
        const { name, cpf, email, password } = req.body
        const usuario = await userService.findUserByEmail(email)

        if (usuario) {
            return res.json({
                success: false,
                data: { email },
                message: "User with this email already exist"
            })
        }

        usuario = await userService.createUser(name, cpf, email, password)

        usuarioSemSenha = { ...usuario }

        return res.json({
            success: true,
            data: usuarioSemSenha,
            message: "User created successfully"
        })
    } catch (error) {
        return res.json({ error })
    }
}

async function checkUserCredentials(req, res) {
    try {
        const { email, password } = req.body
        const usuario = await userService.findUserByEmail(email)
        const usuarioSemSenha = { ...usuario }

        if (!usuario) {
            return res.json({
                success: false,
                data: { email },
                message: "Could not find this user"
            })
        }

        if (usuario.password !== password) {
            return res.json({
                success: false,
                data: { email },
                message: "Incorrect password"
            })
        }

        return res.json({
            success: true,
            data: usuarioSemSenha,
            message: "User logged in successfully"
        })
    } catch (error) {
        return res.json({ error })
    }
}

async function findAllUsers(req, res) {
    try {
        const usuarios = await userService.findAllUsers()
        const usuariosSemSenha = usuarios.map(user => {
            const { password, ...usuarioSemSenha } = user
            return usuarioSemSenha
        })

        return res.json({
            success: true,
            data: usuariosSemSenha,
            message: "Users found successfully"
        })
    }
    catch (error) {
        return res.json({ error })
    }  
}

async function findUser(req, res) {
    try {
        const { id } = req.params
        const usuario = await userService.findUserById(id)

        const usuarioSemSenha = { ...usuario }

        if (!usuario) {
            return res.json({
                success: false,
                data: { usuarioSemSenha },
                message: "Could not find this user"
            })
        }

        return res.json({
            success: true,
            data: usuarioSemSenha,
            message: "User found successfully"
        })
    } catch (error) {
        return res.json({ error })
    }
}

async function updateUser(req, res) {
    try {
        const { id } = req.params
        const { name, email, password } = req.body

        const usuario = await userService.findUserById(id)

        if (!usuario) {
            return res.json({
                success: false,
                data: { id },
                message: "Could not update this user"
            })
        }

        const novoUsuario = await userService.updateUser(id, name, email, password)

        const usuarioSemSenha = { ...novoUsuario }

        return res.json({
            success: true,
            data: usuarioSemSenha,
            message: "User updated successfully"
        })
    }
    catch (error) {
        return res.json({ error })
    }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.params

        const usuario = await userService.findUserById(id)
        if (!usuario) {
            return res.json({
                success: false,
                data: { id },
                message: "Could not find this user"
            })
        }

        await userService.deleteUserById(id)
        return res.json({
            success: true,
            data: { id },
            message: "User deleted successfully"
        })
    } catch (error) {
        return res.json({ error })
    }
}

module.exports = {
    createUser,
    checkUserCredentials,
    findAllUsers,
    findUser,
    updateUser,
    deleteUser
}
