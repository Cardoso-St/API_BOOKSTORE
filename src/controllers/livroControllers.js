import { request, response } from "express"
import { autorModel, livroModel } from "../models/association.js"

export const cadastrarLivro = async (request, response) => {
    const { titulo, isbn, descricao, ano_publicacao, genero, quantidade_total, quantidade_disponivel, autores } = request.body

    if (!titulo) {
        response.status(400).json({ mensagem: "O campo titulo não pode ser nulo" })
        return;
    }

    if (!isbn) {
        response.status(400).json({ mensagem: "O campo isbn não pode ser nulo" })
        return;
    }

    if (!descricao) {
        response.status(400).json({ mensagem: "O campo descricao não pode ser nulo" })
        return;
    }

    if (!ano_publicacao) {
        response.status(400).json({ mensagem: "O campo ano publicacao não pode ser nulo" })
        return;
    }

    if (!genero) {
        response.status(400).json({ mensagem: "O campo genero não pode ser nulo" })
        return;
    }

    if (!quantidade_total) {
        response.status(400).json({ mensagem: "O campo quantidade total não pode ser nulo" })
        return;
    }

    if (!quantidade_disponivel) {
        response.status(400).json({ mensagem: "O campo quantidade disponivel não pode ser nulo" })
        return;
    }

    if (!Array.isArray(autores) || autores.length === 0) {
        response.status(400).json({ mensagem: "O campo autores deve ser array e não pode ser nulo" })
        return;
    }

    try {
        const autoresEncontrados = await autorModel.findAll({
            where: {
                id: autores
            }
        })
        console.log("retorno do banco", autoresEncontrados.length)
        console.log("quantidade request", autores.length)
        if (autoresEncontrados.length !== autores.length) {
            response.status(404).json({ mensagem: "um ou mais Id de autores são inválidos ou não existe" })
        }

        const livro = await livroModel.create({ titulo, isbn, descricao, ano_publicacao, genero, quantidade_total, quantidade_disponivel, autores })
        await livro.addAutores(autores)

        const livroComAutor = await livroModel.findByPk(livro.id, {
            attributes: { exclude: ["create_at", "update_at"] },
            include: {
                model: autorModel,
                attributes: { exclude: ["create_at", "update_at"] },
                through: { attributes: [] }
            }
        })
        response.status(200).json({ mensagem: "livro cadastrado" })
    } catch (error) {
        console.log(error)
        response.status(500).json({ mensagem: "erro interno do servidor" })
    }

}