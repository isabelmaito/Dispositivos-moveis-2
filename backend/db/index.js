const mongodb = require("./mongodb")
const sqlite = require("./sqlite")

/**
 * Retorna o adaptador de banco de dados conforme o tipo solicitado.
 * Prioridade: argumento > variável de ambiente DB_TYPE > padrão mongodb
 * @param {string} [tipo] - 'mongodb' | 'sqlite'
 */
function getAdapter(tipo) {
    const dbType = (tipo || process.env.DB_TYPE || "mongodb").toLowerCase()
    return dbType === "sqlite" ? sqlite : mongodb
}

module.exports = { getAdapter }
