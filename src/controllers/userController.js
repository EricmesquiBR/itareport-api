const userService = require("../services/usuarioService")

async function createUser(req, res) {
    try {
        const { name, cpf, email, password } = req.body
        let usuario = await userService.findUserByEmail(email)

        if (usuario) {
            return res.json({
                success: false,
                data: { email },
                message: "User with this email already exist"
            })
        }

        usuario = await userService.createUser(name, cpf, email, password)

        return res.json({
            success: true,
            data: usuario,
            message: "User created successfully"
        })
    } catch (error) {
        return res.json({ error })
    }
}

async function checkUserCredentials(req, res) {
    //function thats gonna get user email and password and check if they are correct
    try {
        const { email: email, password: password } = req.body
        let usuario = await userService.findUserByEmail(email)
        usuarioWithoutPassword = { ...usuario }
        delete usuarioWithoutPassword.password

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
            data: usuarioWithoutPassword,
            message: "User logged in successfully"
        })
    } catch (error) {
        return res.json({ error })
    }
}

async function findAllUsers(req, res) {
    try {
        const users = await userService.findAllUsers()
        return res.json({
            success: true,
            data: users,
            message: "Users found successfully"
        })
    } catch (error) {
        return res.json({ error })
    }
}

async function findUser(req, res) {
    try {
        const { id } = req.params
        const usuario = await userService.findUserById(id)

        if (!usuario) {
            return res.json({
                success: false,
                data: { usuario },
                message: "Could not find this user"
            })
        }

        return res.json({
            success: true,
            data: usuario,
            message: "User found successfully"
        })
    } catch (error) {
        return res.json({ error })
    }
}

async function updateUser(req, res) {
    try {
        const { id } = req.params
        const { name, email } = req.body

        let usuario = await userService.updateUser(id)

        if (!usuario) {
            return res.json({
                success: false,
                data: { id },
                message: "Could not update this user"
            })
        }
        user = await userService.updateUser(id, name, email)

        return res.json({
            success: true,
            data: user,
            message: "User updated successfully"
        })
    } catch (error) {
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
