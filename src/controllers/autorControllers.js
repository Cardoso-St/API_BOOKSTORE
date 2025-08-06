import autorModel from "../models/autorModel.js"

export const cadastrarAutor = async (resquest, response) => {
    const { nome, biografia, data_nascimento, nacionalidade } = resquest.body;

    if (!nome) {
        response.status(400).json({
            error: "Campo nome inválido",
            mensagem: "O campo nome não pode ser nulo"
        })
        return
    }
    if (!biografia) {
        response.status(400).json({
            error: "Campo biografia inválido",
            mensagem: "O campo biografia não pode ser nulo"
        })
        return
    }
    if (!data_nascimento) {
        response.status(400).json({
            error: "Campo data de nascimento inválido",
            mensagem: "O campo data de nascimento não pode ser nulo"
        })

    }
    if (!nacionalidade) {
        response.status(400).json({
            error: "Campo nacionalidade inválido",
            mensagem: "O campo nacionalidade não pode ser nulo"
        })
        return
    }

    const validaData = new Date(data_nascimento)
    if (validaData == "Invalid Date") {
        response.status(400).json({
            erro: "data inválida",
            mensagem: "formato inválido"
        })
        return
    }

    const novoAutor = {
        nome,
        biografia,
        data_nascimento,
        nacionalidade
    }

    try {
        const novoAutor = await autorModel.create(novoAutor)
        response.status(201).json({ mensagem: "Autor criado com sucesso", novoAutor })
    } catch (error) {
        console.error(error)
        response.status(500).json({mensagem: "Erro interno ao cadastrar autor"})
    }
}