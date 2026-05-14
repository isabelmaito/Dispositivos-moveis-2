import { Platform } from "react-native"
import type { Usuario } from "../Conf/Bd"

// Detecta automaticamente a URL correta do backend conforme a plataforma:
//   web / iOS Simulator  → localhost:3000
//   Android Emulator     → 10.0.2.2:3000  (localhost do host no AVD)
//   Dispositivo físico   → defina EXPO_PUBLIC_API_URL no .env com o IP da máquina
//                          ex: EXPO_PUBLIC_API_URL=http://192.168.1.100:3000
const DEFAULT_API_URL =
    Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000"

const API_URL = (process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL).replace(
    /\/$/,
    "",
)

export type ApiDbType = "sqlite" | "mongodb"

function jsonHeaders(): HeadersInit {
    return { "Content-Type": "application/json" }
}

/** Normaliza a resposta da API para o formato interno Usuario */
function mapUsuario(u: Record<string, unknown>): Usuario {
    return {
        ID_US: (u.id ?? u._id) as number | string,
        NOME_US: (u.nome as string) ?? "",
        EMAIL_US: (u.email as string) ?? "",
        CEP_US: (u.cep as string) ?? "",
        LOGRADOURO_US: (u.logradouro as string) ?? "",
        NUMERO_US: (u.numero as string) ?? "",
        COMPLEMENTO_US: (u.complemento as string) ?? "",
        BAIRRO_US: (u.bairro as string) ?? "",
        CIDADE_US: (u.cidade as string) ?? "",
        ESTADO_US: (u.estado as string) ?? "",
    }
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export async function apiListarUsuarios(dbType: ApiDbType): Promise<Usuario[]> {
    const res = await fetch(`${API_URL}/usuarios?db=${dbType}`)
    if (!res.ok) throw new Error("Erro ao listar usuários")
    const data: Record<string, unknown>[] = await res.json()
    return data.map(mapUsuario)
}

export async function apiInserirUsuario(
    dbType: ApiDbType,
    nome: string,
    email: string,
    cep: string,
    logradouro: string,
    numero: string,
    complemento: string,
    bairro: string,
    cidade: string,
    estado: string,
): Promise<void> {
    const res = await fetch(`${API_URL}/usuarios?db=${dbType}`, {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify({
            nome,
            email,
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
        }),
    })
    if (!res.ok) {
        const err = await res
            .json()
            .catch(() => ({ erro: "Erro ao inserir usuário" }))
        throw new Error((err as { erro: string }).erro)
    }
}

export async function apiAtualizarUsuario(
    dbType: ApiDbType,
    id: number | string,
    nome: string,
    email: string,
    cep: string,
    logradouro: string,
    numero: string,
    complemento: string,
    bairro: string,
    cidade: string,
    estado: string,
): Promise<void> {
    const res = await fetch(`${API_URL}/usuarios/${id}?db=${dbType}`, {
        method: "PUT",
        headers: jsonHeaders(),
        body: JSON.stringify({
            nome,
            email,
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
        }),
    })
    if (!res.ok) {
        const err = await res
            .json()
            .catch(() => ({ erro: "Erro ao atualizar usuário" }))
        throw new Error((err as { erro: string }).erro)
    }
}

export async function apiDeletarUsuario(
    dbType: ApiDbType,
    id: number | string,
): Promise<void> {
    const res = await fetch(`${API_URL}/usuarios/${id}?db=${dbType}`, {
        method: "DELETE",
    })
    if (!res.ok) {
        const err = await res
            .json()
            .catch(() => ({ erro: "Erro ao deletar usuário" }))
        throw new Error((err as { erro: string }).erro)
    }
}

// ─── ViaCEP via backend ───────────────────────────────────────────────────────

export async function apiBuscarCep(cep: string): Promise<{
    logradouro: string
    bairro: string
    cidade: string
    estado: string
} | null> {
    try {
        const res = await fetch(`${API_URL}/cep/${cep}`)
        if (!res.ok) return null
        return await res.json()
    } catch {
        return null
    }
}

/** Exporta a URL resolvida para uso em mensagens de diagnóstico */
export { API_URL }
