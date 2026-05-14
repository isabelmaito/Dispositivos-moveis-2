const express = require("express")
const router = express.Router()
const { buscarCep } = require("../services/viacep")

// GET /cep/:cep — Consulta endereço pelo CEP via ViaCEP
router.get("/:cep", async (req, res) => {
    try {
        const endereco = await buscarCep(req.params.cep)
        res.json(endereco)
    } catch (err) {
        res.status(err.status || 500).json({ erro: err.message })
    }
})

module.exports = router
