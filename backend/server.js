require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")

const usuariosRouter = require("./routes/usuarios")
const cepRouter = require("./routes/cep")

const app = express()
const PORT = process.env.PORT || 3000
const DB_TYPE = (process.env.DB_TYPE || "mongodb").toLowerCase()
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/DSM_2026"

// ─── Middlewares ──────────────────────────────────────────────────────────────
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// ─── MongoDB ──────────────────────────────────────────────────────────────────
// Tenta conectar sempre para permitir troca dinâmica de banco pelo cliente.
mongoose
    .connect(MONGO_URL)
    .then(() => console.log(`MongoDB conectado: ${MONGO_URL}`))
    .catch((err) =>
        console.warn(
            `MongoDB indisponivel (modo SQLite continua funcional): ${err.message}`,
        ),
    )

// ─── Rotas ────────────────────────────────────────────────────────────────────
app.use("/usuarios", usuariosRouter)
app.use("/cep", cepRouter)

// Status / documentação inline
app.get("/", (_req, res) => {
    res.json({
        mensagem: "API CRUD + ViaCEP operacional",
        bancoPadrao: DB_TYPE,
        mongo:
            mongoose.connection.readyState === 1 ? "conectado" : "desconectado",
        dica: "Adicione ?db=sqlite ou ?db=mongodb em qualquer rota para escolher o banco",
        endpoints: {
            "GET    /usuarios": "Listar todos os usuários",
            "GET    /usuarios/:id": "Buscar usuário por ID",
            "POST   /usuarios":
                "Criar usuário { nome, email, cep, logradouro, numero, complemento, bairro, cidade, estado }",
            "PUT    /usuarios/:id": "Atualizar usuário",
            "DELETE /usuarios/:id": "Deletar usuário",
            "GET    /cep/:cep": "Consultar endereço pelo CEP (ViaCEP)",
        },
    })
})

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
    console.log(`Banco padrao: ${DB_TYPE.toUpperCase()}`)
})
