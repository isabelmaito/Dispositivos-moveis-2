/**
 * Consulta endereço de um CEP via API pública ViaCEP.
 * @param {string} cep - CEP (apenas números, 8 dígitos)
 * @returns {Promise<{cep, logradouro, bairro, cidade, estado}>}
 */
async function buscarCep(cep) {
    const cepLimpo = cep.replace(/\D/g, "")
    if (cepLimpo.length !== 8) {
        const err = new Error("CEP inválido: informe 8 dígitos numéricos")
        err.status = 400
        throw err
    }

    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
    if (!response.ok) {
        const err = new Error("Erro ao consultar a API ViaCEP")
        err.status = 502
        throw err
    }

    const data = await response.json()
    if (data.erro) {
        const err = new Error("CEP não encontrado")
        err.status = 404
        throw err
    }

    return {
        cep: data.cep || "",
        logradouro: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
    }
}

module.exports = { buscarCep }
