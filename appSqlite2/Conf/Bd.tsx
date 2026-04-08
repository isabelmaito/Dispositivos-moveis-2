import * as SQLite from 'expo-sqlite';

// Tipo do usuário
export type Usuario = {
    ID_US: number;
    NOME_US: string;
    EMAIL_US: string;
    CEP_US: string;
    LOGRADOURO_US: string;
    NUMERO_US: string;
    COMPLEMENTO_US: string;
    BAIRRO_US: string;
    CIDADE_US: string;
    ESTADO_US: string;
};

// Função de criar e abrir o banco de dados

async function Banco() {
    const bd = await SQLite.openDatabaseAsync("FatecV2");
    console.log('Banco CRIADO !!!');
    return bd;
}

// Criar a tabela
async function createTable(x: SQLite.SQLiteDatabase) {
    try {
        await x.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS USUARIO(
                ID_US INTEGER PRIMARY KEY AUTOINCREMENT,
                NOME_US VARCHAR(100),
                EMAIL_US VARCHAR(100),
                CEP_US VARCHAR(10),
                LOGRADOURO_US VARCHAR(200),
                NUMERO_US VARCHAR(20),
                COMPLEMENTO_US VARCHAR(200),
                BAIRRO_US VARCHAR(100),
                CIDADE_US VARCHAR(100),
                ESTADO_US VARCHAR(2)
            )
        `);
        console.log('Tabela CRIADA!!!');
        
        // Adiciona as colunas se elas não existirem (migração)
        await migrarTabela(x);
    } catch (error) {
        console.log('Erro ao Criar tabela', error);
    }
}

// Migração para adicionar colunas faltantes
async function migrarTabela(x: SQLite.SQLiteDatabase) {
    try {
        // Tenta adicionar coluna NUMERO_US
        try {
            await x.execAsync(`ALTER TABLE USUARIO ADD COLUMN NUMERO_US VARCHAR(20) DEFAULT ''`);
            console.log('Coluna NUMERO_US adicionada');
        } catch (e: any) {
            if (e.message && e.message.includes('duplicate column name')) {
                console.log('Coluna NUMERO_US já existe');
            }
        }

        // Tenta adicionar coluna COMPLEMENTO_US
        try {
            await x.execAsync(`ALTER TABLE USUARIO ADD COLUMN COMPLEMENTO_US VARCHAR(200) DEFAULT ''`);
            console.log('Coluna COMPLEMENTO_US adicionada');
        } catch (e: any) {
            if (e.message && e.message.includes('duplicate column name')) {
                console.log('Coluna COMPLEMENTO_US já existe');
            }
        }
    } catch (error) {
        console.log('Erro na migração:', error);
    }
}

// Inserir dados

async function inserirUsuario(
    db: SQLite.SQLiteDatabase,
    nome: string,
    email: string,
    cep: string,
    logradouro: string,
    numero: string,
    complemento: string,
    bairro: string,
    cidade: string,
    estado: string
) {
    try {
        await db.runAsync(
            `INSERT INTO USUARIO(NOME_US, EMAIL_US, CEP_US, LOGRADOURO_US, NUMERO_US, COMPLEMENTO_US, BAIRRO_US, CIDADE_US, ESTADO_US)
             VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            nome, email, cep, logradouro, numero, complemento, bairro, cidade, estado
        );
        console.log('Usuário Inserido !!!');  
    } catch (error) {
        console.log('Erro ao inserir usuário', error);
    }
}

// Exibir os dados

async function selectUsuarios(db: SQLite.SQLiteDatabase): Promise<Usuario[]> {
    try {
        const resultado = await db.getAllAsync(" SELECT * FROM USUARIO ");
        console.log('Usuários encontrados !!!');
        return resultado as Usuario[];
    } catch (error) {
        console.log("Erro ao exibir usuários", error);
        return [];
    }
}

// FILTRO

async function selectUsuarioId(db: SQLite.SQLiteDatabase, id: number) {
    try {
        const resultado = await db.getFirstAsync(" SELECT * FROM USUARIO WHERE ID_US = ?", id);
        console.log('Usuário encontrado!!');
        return resultado as Usuario;
    } catch (error) {
        console.log("Erro ", error);
    }
}

// ATUALIZAR

async function atualizarUsuario(
    db: SQLite.SQLiteDatabase,
    id: number,
    nome: string,
    email: string,
    cep: string,
    logradouro: string,
    numero: string,
    complemento: string,
    bairro: string,
    cidade: string,
    estado: string
) {
    try {
        await db.runAsync(
            `UPDATE USUARIO SET NOME_US = ?, EMAIL_US = ?, CEP_US = ?, LOGRADOURO_US = ?, NUMERO_US = ?, COMPLEMENTO_US = ?, BAIRRO_US = ?, CIDADE_US = ?, ESTADO_US = ? WHERE ID_US = ?`,
            nome, email, cep, logradouro, numero, complemento, bairro, cidade, estado, id
        );
        console.log('Usuário Atualizado !!!');
    } catch (error) {
        console.log('Erro ao atualizar usuário', error);
    }
}

// DELETAR

async function deletaUsuario(db: SQLite.SQLiteDatabase, id: number) {
    try {
        await db.runAsync(" DELETE FROM USUARIO WHERE ID_US = ?", id);
        console.log('Deletado com sucesso');
    } catch (error) {
        console.log('Erro ao deletar', error);
    }
}

// BUSCAR CEP via API ViaCEP

async function buscarCep(cep: string) {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
        return null;
    }
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        if (data.erro) {
            return null;
        }
        return {
            logradouro: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            estado: data.uf || '',
        };
    } catch (error) {
        console.log('Erro ao buscar CEP', error);
        return null;
    }
}

export { Banco, createTable, inserirUsuario, selectUsuarios, selectUsuarioId, atualizarUsuario, deletaUsuario, buscarCep };