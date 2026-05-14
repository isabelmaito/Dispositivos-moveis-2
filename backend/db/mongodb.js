const mongoose = require("mongoose")

const UsuarioSchema = new mongoose.Schema(
    {
        nome: { type: String, required: true },
        email: { type: String, required: true },
        cep: { type: String, default: "" },
        logradouro: { type: String, default: "" },
        numero: { type: String, default: "" },
        complemento: { type: String, default: "" },
        bairro: { type: String, default: "" },
        cidade: { type: String, default: "" },
        estado: { type: String, default: "" },
    },
    { timestamps: true },
)

const UsuarioModel = mongoose.model("Usuario", UsuarioSchema)

async function listar() {
    return await UsuarioModel.find({}).sort({ createdAt: -1 })
}

async function buscarPorId(id) {
    return await UsuarioModel.findById(id)
}

async function criar(dados) {
    const u = new UsuarioModel(dados)
    return await u.save()
}

async function atualizar(id, dados) {
    return await UsuarioModel.findByIdAndUpdate(id, dados, {
        new: true,
        runValidators: true,
    })
}

async function deletar(id) {
    return await UsuarioModel.findByIdAndDelete(id)
}

module.exports = { listar, buscarPorId, criar, atualizar, deletar }
