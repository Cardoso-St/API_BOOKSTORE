import { request, response } from "express";
import autorModel from "../models/autorModel.js"

export const cadastrarAutor = async (request, response) => {
    const { nome, biografia, dataNascimento, nacionalidade } = request.body;

    if (!nome) {
        return response.status(400).json({
            error: "Campo nome inválido",
            mensagem: "O campo nome não pode ser nulo"
        });
    }
    if (!biografia) {
        return response.status(400).json({
            error: "Campo biografia inválido",
            mensagem: "O campo biografia não pode ser nulo"
        });
    }
    if (!dataNascimento) {
        return response.status(400).json({
            error: "Campo data de nascimento inválido",
            mensagem: "O campo data de nascimento não pode ser nulo"
        });
    }
    if (!nacionalidade) {
        return response.status(400).json({
            error: "Campo nacionalidade inválido",
            mensagem: "O campo nacionalidade não pode ser nulo"
        });
    }

    const validaData = new Date(dataNascimento);
    if (validaData.toString() === "Invalid Date") {
        return response.status(400).json({
            erro: "data inválida",
            mensagem: "formato inválido"
        });
    }

    const Autor = {
        nome,
        biografia,
        dataNascimento,
        nacionalidade
    };

    try {
        const novoAutor = await autorModel.create(Autor);
        response.status(201).json({ mensagem: "Autor criado com sucesso", novoAutor });
    } catch (error) {
        console.error(error);
        response.status(500).json({ mensagem: "Erro interno ao cadastrar autor" });
    }
}


export const listarTodosAutores = async (request, response) => {
    const page = parseInt(request.query.page) || 1
    const limit = parseInt(request.query.limit) || 10
    const offset = (page - 1) * limit

    try {
        const autores = await autorModel.findAndCountAll({
            offset,
            limit
        })
        const totalPaginas = Math.ceil(autores.count / limit)
        response.status(200).json({
            totalAutores: autores.count,
            totalPaginas,
            paginaAtual: page,
            autoresPorPagina: limit,
            autores: autores.rows
        })
    } catch (error) {
        console.log(error)
        response.status(500).json({ mensagem: "Erro interno ao listar autores" })

    }

}

export const listarAutor = async (request, response) => {
    try {
        const { id } = request.params
        const autorId = await autorModel.findByPk(id)
        console.log(autorId);

        if (!autorId) {
            return response.status(404).json({ mensagem: "autor não encontrado" })
        }

        response.status(200).json({ mensagem: autorId })
    } catch (error) {
        console.error(error);
        response.status(500).json({ mensagem: "erro INterno servidor" })
    }

}

export const atualizarAutor = async (request, response) => {
    try {
        const { id } = request.params
        const { nome, biografia, dataNascimento, nacionalidade } = request.body

        const autor = await autorModel.findByPk(id)

        if (!autor) {
            return response.status(404).json({ mensagem: "Autor não encontrado" })
        }

        await autor.update({ nome, biografia, dataNascimento, nacionalidade })

        response.status(200).json(autor);

    } catch (error) {
        response.status(400).json({ mensagem: "Erro ao atualizar autor" })
    }
}

export const deletarAutor = async (request, response) => {
    try {
        const { id } = request.params
        const autorId = await autorModel.findByPk(id)
        if (!autorId) {
            response.status(404).json({ mensagem: "Error ao encontrar autor" })
        }

        await autorId.destroy()
        response.status(200).json({ mensagem: `Autor: ${autorId} deletado com sucesso` })
    } catch (error) {
        response.status(400).json({ mensagem: "Erro ao deletar autor" })
    }
}