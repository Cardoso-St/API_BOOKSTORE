import { request, response } from "express";
import { autorModel, livroModel } from "../models/association.js";

export const cadastrarLivro = async (request, response) => {
  const {
    titulo,
    isbn,
    descricao,
    ano_publicacao,
    genero,
    quantidade_total,
    quantidade_disponivel,
    autores,
  } = request.body;

  if (!titulo) {
    response.status(400).json({ mensagem: "O campo titulo não pode ser nulo" });
    return;
  }

  if (!isbn) {
    response.status(400).json({ mensagem: "O campo isbn não pode ser nulo" });
    return;
  }

  if (!descricao) {
    response
      .status(400)
      .json({ mensagem: "O campo descricao não pode ser nulo" });
    return;
  }

  if (!ano_publicacao) {
    response
      .status(400)
      .json({ mensagem: "O campo ano publicacao não pode ser nulo" });
    return;
  }

  if (!genero) {
    response.status(400).json({ mensagem: "O campo genero não pode ser nulo" });
    return;
  }

  if (!quantidade_total) {
    response
      .status(400)
      .json({ mensagem: "O campo quantidade total não pode ser nulo" });
    return;
  }

  if (!quantidade_disponivel) {
    response
      .status(400)
      .json({ mensagem: "O campo quantidade disponivel não pode ser nulo" });
    return;
  }

  if (!Array.isArray(autores) || autores.length === 0) {
    response
      .status(400)
      .json({ mensagem: "O campo autores deve ser array e não pode ser nulo" });
    return;
  }

  try {
    const autoresEncontrados = await autorModel.findAll({
      where: {
        id: autores,
      },
    });
    console.log("retorno do banco", autoresEncontrados.length);
    console.log("quantidade request", autores.length);
    if (autoresEncontrados.length !== autores.length) {
      response.status(404).json({
        mensagem: "um ou mais Id de autores são inválidos ou não existe",
      });
    }

    const livro = await livroModel.create({
      titulo,
      isbn,
      descricao,
      ano_publicacao,
      genero,
      quantidade_total,
      quantidade_disponivel,
      autores,
    });
    await livro.addAutores(autores);

    const livroComAutor = await livroModel.findByPk(livro.id, {
      attributes: { exclude: ["create_at", "update_at"] },
      include: {
        model: autorModel,
        attributes: { exclude: ["create_at", "update_at"] },
        through: { attributes: [] },
      },
    });
    response.status(200).json({ mensagem: "livro cadastrado" });
  } catch (error) {
    console.log(error);
    response.status(500).json({ mensagem: "erro interno do servidor" });
  }
};

export const listarTodosLivros = async (request, response) => {
  const page = parseInt(request.query.page) || 1;
  const limit = parseInt(request.query.limit) || 10;
  const offset = page - 1;

  try {
    const livros = await livroModel.findAndCountAll({
      include: {
        model: autorModel,
        through: { attributes: [] },
      },
      limit,
      offset,
    });

    const livrosFormatados = livros.rows.map((livro) => {
      return {
        id: livro.id,
        titulo: livro.titulo,
        isbn: livro.isbn,
        descricao: livro.descricao,
        ano_publicacao: livro.ano_publicacao,
        genero: livro.genero,
        quantidade_total: livro.quantidade,
        quantidade_disponivel: livro.quantidade_disponivel,
        autores: livro.autores.map((autor) => ({
          id: autor.id,
          nome: autor.nome,
        })),
      };
    });
    const totalDePaginas = Math.ceil(livros.count / limit);
    response.status(200).json({
      totalLivros: livros.count,
      totalPaginas: totalDePaginas,
      paginaAtual: page,
      livrosPorPagina: limit,
      livros: livrosFormatados,
    });
  } catch (error) {
    response.status(500).json({ mensagem: "erro interno do servidor" });
  }
};

export const listarLivro = async (request, response) => {
  const { id } = request.params;

  if (!id) {
    response.status(400).json({ mensagem: "Id obrigátorio" });
    return;
  }

  try {
    const livro = await livroModel.findByPk(id, {
      include: {
        model: autorModel,
        through: { attributes: [] },
        attributes: { exclude: ["created_at", "updated_at"] },
      },
    });

    if (!livro) {
      response.status(404).json({ mensagem: "Livro não encontrado" });
    }

    response.status(200).json({ livro });
  } catch (error) {
    response.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const buscarLivrosPorAutor = async (request, response) => {
  const { autor_id } = request.query;

  if (!autor_id) {
    response.status(400).json({ message: "Erro ao achar ID" });
    return;
  }
  try {
    const livro = await livroModel.findByPk(autor_id, {
      include: {
        model: autorModel,
        through: { attributes: [] },
        attributes: { exclude: ["created_at", "updated_at"] },
      },
    });

    if (!autor_id) {
      response.status(404).json({ message: "Autor não encontrado" });
      return;
    }

    response.status(200).json(livro);
  } catch (error) {
    response.status(500).json({ message: "Erro ao buscar livros por id" });
    console.log(error);
  }
};

export const atualizarLivro = async (request, response) => {
  const { id } = request.params;
  const {
    titulo,
    isbn,
    descricao,
    ano_publicacao,
    genero,
    quantidade_total,
    quantidade_disponivel,
    autores,
  } = request.body;

  if (!id) {
    response.status(400).json({ message: "ID obrigátorio" });
    return;
  }

  try {
    const livro = await livroModel.findByPk(id, {
      attributes: { exclude: ["created_at", "updated_at"] },
      include: {
        model: autorModel,
        through: { attributes: [] },
        attributes: { exclude: ["created_at", "updated_at"] },
      },
    });

    livro.titulo = titulo;
    livro.isbn = isbn;
    livro.descricao = descricao;
    livro.ano_publicacao = ano_publicacao;
    livro.genero = genero;
    livro.quantidade_total = quantidade_total;
    livro.quantidade_disponivel = quantidade_disponivel;
    livro.autores = autores;

    await livro.save();

    response.status(200).jsom({ message: "Livro atualizado" });
  } catch (error) {
    response.status(500).json({ message: "Erro interno ao atualizar livro" });
    console.log(error);
  }
};

export const deletarLivro = async (request, response) => {
  const { id } = request.params;

  if (!id) {
    response.status(400).json({ message: "ID obrigátorio" });
    return;
  }

  try {
    const livro = await livroModel.findByPk(id, {
      attributes: { exclude: ["created_at", "updated_at"] },
      include: {
        model: autorModel,
        through: { attributes: [] },
        attributes: { exclude: ["created_at", "updated_at"] },
      },
    });

    await livroModel.destroy({ where: { id } });

    response.status(204).send();
  } catch (error) {
    response.status(500).json({ message: "Erro interno ao deletar livro" });
    console.log(error);
  }
};

//Control imagem
export const cadastrarCapaLivro = async (request, response) => {
  const { id } = request.params;
  const { filename, path } = request.file;

  if (!id) {
    response.status(400).json({ mensagem: "o id é obrigatorio" });
    return;
  }

  try {
    const livro = await livroModel.findByPk(id);

    if (!livro) {
      response.status(400).json({ mensagem: "Livro não existe" });
    }

    livro.imagem_capa = filename;
    livro.imagem_url = path;

    await livro.save();

    response.status(200).json({ mensagem: "capa cadastrada", livro });
  } catch (error) {
    console.log(error);
    response.status(500).json({ mensagem: "Erro interno" });
  }
};
