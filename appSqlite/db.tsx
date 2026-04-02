
import * as SQLite from 'expo-sqlite';

const dbName = 'users.db';

export async function Banco() {
  try {
    const db = await SQLite.openDatabaseAsync(dbName);
    return db;
  } catch (error) {
    console.error('Erro ao abrir banco de dados:', error);
    throw error;
  }
}

export async function createTable(db: SQLite.SQLiteDatabase){
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      );
    `);
    console.log('Tabela criada com sucesso!');
  } catch (error) {
    console.error('Erro ao criar tabela:', error);
  }
}

// Inserir Dados

async function inserirUsuario(df: SQLite.SQLiteDatabase, 
  name: string, email: string) {
  try {
    await db.runAsync(
      'INSERT INTO USUARIO (name, email) VALUES (?, ?)',
      [name, email]
   );
   console.log('Usuário inserido com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir usuário:', error);
  }
}

export { Banco, createTable, inserirUsuario };