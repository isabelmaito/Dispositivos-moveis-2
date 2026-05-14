const Database = require("better-sqlite3")
const path = require("path")
const fs = require("fs")

let db

function getDb() {
    if (!db) {
        const dbPath = path.resolve(
            process.env.SQLITE_PATH || "./data/fatec.db",
        )
        const dir = path.dirname(dbPath)
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

        db = new Database(dbPath)
        db.exec(`
      CREATE TABLE IF NOT EXISTS USUARIO (
        id          INTEGER  PRIMARY KEY AUTOINCREMENT,
        nome        TEXT     NOT NULL,
        email       TEXT     NOT NULL,
        cep         TEXT     DEFAULT '',
        logradouro  TEXT     DEFAULT '',
        numero      TEXT     DEFAULT '',
        complemento TEXT     DEFAULT '',
        bairro      TEXT     DEFAULT '',
        cidade      TEXT     DEFAULT '',
        estado      TEXT     DEFAULT '',
        createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt   DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    }
    return db
}

function listar() {
    return getDb().prepare("SELECT * FROM USUARIO ORDER BY id DESC").all()
}

function buscarPorId(id) {
    return getDb().prepare("SELECT * FROM USUARIO WHERE id = ?").get(Number(id))
}

function criar(dados) {
    const {
        nome,
        email,
        cep = "",
        logradouro = "",
        numero = "",
        complemento = "",
        bairro = "",
        cidade = "",
        estado = "",
    } = dados
    const result = getDb()
        .prepare(
            `
      INSERT INTO USUARIO (nome, email, cep, logradouro, numero, complemento, bairro, cidade, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
        )
        .run(
            nome,
            email,
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
        )
    return buscarPorId(result.lastInsertRowid)
}

function atualizar(id, dados) {
    const {
        nome,
        email,
        cep = "",
        logradouro = "",
        numero = "",
        complemento = "",
        bairro = "",
        cidade = "",
        estado = "",
    } = dados
    getDb()
        .prepare(
            `
      UPDATE USUARIO
      SET nome=?, email=?, cep=?, logradouro=?, numero=?, complemento=?,
          bairro=?, cidade=?, estado=?, updatedAt=CURRENT_TIMESTAMP
      WHERE id=?
    `,
        )
        .run(
            nome,
            email,
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            Number(id),
        )
    return buscarPorId(id)
}

function deletar(id) {
    const usuario = buscarPorId(id)
    if (usuario) {
        getDb().prepare("DELETE FROM USUARIO WHERE id = ?").run(Number(id))
    }
    return usuario || null
}

module.exports = { listar, buscarPorId, criar, atualizar, deletar }
