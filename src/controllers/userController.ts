import * as userService from "../services/usuarioService.js";
import type { Request, Response } from "express";

export async function createUser(req: Request, res: Response) {
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
    const { password: _, ...usuarioSemSenha } = usuario as any;

    return res.status(201).json({
      success: true,
      data: usuarioSemSenha,
      message: "User created successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function checkUserCredentials(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const usuario = (await userService.findUserByEmail(email)) as any;

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
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function findAllReports(_req: Request, res: Response) {
  try {
    const usuarios = await userService.findAllUsers();
    const usuariosSemSenha = usuarios.map((user: any) => {
      const { password: _, ...usuarioSemSenha } = user;
      return usuarioSemSenha;
    });

    return res.json({
      success: true,
      data: usuariosSemSenha,
      message: "Users found successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function findUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const usuario = (await userService.findUserById(id)) as any;

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
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function updateUser(req: Request, res: Response) {
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

    const novoUsuario = (await userService.updateUser(id, name, email, password)) as any;
    const { password: _, ...usuarioSemSenha } = novoUsuario;

    return res.json({
      success: true,
      data: usuarioSemSenha,
      message: "User updated successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function deleteUser(req: Request, res: Response) {
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
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
