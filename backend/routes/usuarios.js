const express = require("express")
const router = express.Router()
const { getAdapter } = require("../db")

/**
 * Resolve o adaptador de banco com base no query param ?db=
 * ou no header X-DB-Type, caindo no padrão definido em DB_TYPE.
 */
function resolveAdapter(req) {
    const tipo = req.query.db || req.headers["x-db-type"]
    return getAdapter(tipo)
}

// GET /usuarios — Listar todos
router.get("/", async (req, res) => {
    try {
        const db = resolveAdapter(req)
        const usuarios = await db.listar()
        res.json(usuarios)
    } catch (err) {
        res.status(500).json({ erro: err.message })
    }
})

// GET /usuarios/:id — Buscar por ID
router.get("/:id", async (req, res) => {
    try {
        const db = resolveAdapter(req)
        const usuario = await db.buscarPorId(req.params.id)
        if (!usuario)
            return res.status(404).json({ erro: "Usuário não encontrado" })
        res.json(usuario)
    } catch (err) {
        res.status(500).json({ erro: err.message })
    }
})

// POST /usuarios — Criar
router.post("/", async (req, res) => {
    const { nome, email } = req.body
    if (!nome || !email) {
        return res
            .status(400)
            .json({ erro: '"nome" e "email" são obrigatórios' })
    }
    try {
        const db = resolveAdapter(req)
        const usuario = await db.criar(req.body)
        res.status(201).json(usuario)
    } catch (err) {
        res.status(500).json({ erro: err.message })
    }
})

// PUT /usuarios/:id — Atualizar
router.put("/:id", async (req, res) => {
    try {
        const db = resolveAdapter(req)
        const usuario = await db.atualizar(req.params.id, req.body)
        if (!usuario)
            return res.status(404).json({ erro: "Usuário não encontrado" })
        res.json(usuario)
    } catch (err) {
        res.status(500).json({ erro: err.message })
    }
})

// DELETE /usuarios/:id — Deletar
router.delete("/:id", async (req, res) => {
    try {
        const db = resolveAdapter(req)
        const usuario = await db.deletar(req.params.id)
        if (!usuario)
            return res.status(404).json({ erro: "Usuário não encontrado" })
        res.json({ mensagem: "Usuário deletado com sucesso", usuario })
    } catch (err) {
        res.status(500).json({ erro: err.message })
    }
})

module.exports = router
