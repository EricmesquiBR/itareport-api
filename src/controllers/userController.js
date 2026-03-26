import * as userService from "../services/usuarioService.js";

export async function createUser(req, res) {
  try {
    const { name, cpf, email, password } = req.body;
    const existingUser = await userService.findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        data: { email },
        message: "User with this email already exist",
      });
    }

    const usuario = await userService.createUser(name, cpf, email, password);
    const { password: _, ...usuarioSemSenha } = usuario;

    return res.status(201).json({
      success: true,
      data: usuarioSemSenha,
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function checkUserCredentials(req, res) {
  try {
    const { email, password } = req.body;
    const usuario = await userService.findUserByEmail(email);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        data: { email },
        message: "Could not find this user",
      });
    }

    if (usuario.password !== password) {
      return res.status(401).json({
        success: false,
        data: { email },
        message: "Incorrect password",
      });
    }

    const { password: _, ...usuarioSemSenha } = usuario;

    return res.json({
      success: true,
      data: usuarioSemSenha,
      message: "User logged in successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function findAllUsers(req, res) {
  try {
    const usuarios = await userService.findAllUsers();
    const usuariosSemSenha = usuarios.map((user) => {
      const { password: _, ...usuarioSemSenha } = user;
      return usuarioSemSenha;
    });

    return res.json({
      success: true,
      data: usuariosSemSenha,
      message: "Users found successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function findUser(req, res) {
  try {
    const { id } = req.params;
    const usuario = await userService.findUserById(id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Could not find this user",
      });
    }

    const { password: _, ...usuarioSemSenha } = usuario;

    return res.json({
      success: true,
      data: usuarioSemSenha,
      message: "User found successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const usuario = await userService.findUserById(id);

    if (!usuario) {
      return res.status(404).json({
        success: false,
        data: { id },
        message: "Could not find this user",
      });
    }

    const novoUsuario = await userService.updateUser(id, name, email, password);
    const { password: _, ...usuarioSemSenha } = novoUsuario;

    return res.json({
      success: true,
      data: usuarioSemSenha,
      message: "User updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const usuario = await userService.findUserById(id);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        data: { id },
        message: "Could not find this user",
      });
    }

    await userService.deleteUserById(id);
    return res.json({
      success: true,
      data: { id },
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
