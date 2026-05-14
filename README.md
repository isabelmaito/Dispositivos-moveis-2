Faculdade de Tecnologia de Votorantim - Fatec
<br>Trabalhos e Exercícios da Disciplina Dispositivos Móveis 2
<br>Professor Emerson Rocha

---

# Projeto Integrado — appSqlite2 + backend

Aplicativo React Native (Expo) com backend Node.js/Express que implementa **cadastro de usuários com endereço via CEP**, persistência dual em **SQLite** e **MongoDB**, e seleção dinâmica de banco de dados pelo usuário.

---

## Estrutura do Projeto

```
Dispositivos-moveis-2/
├── appSqlite2/          # App React Native (Expo)
│   ├── Conf/Bd.tsx      # SQLite local: funções de banco e tipo Usuario
│   ├── services/api.ts  # Serviço HTTP para comunicação com o backend
│   ├── App.tsx          # Componente principal com seletor de armazenamento
│   └── .env             # EXPO_PUBLIC_API_URL (URL do backend)
│
└── backend/             # API REST Node.js/Express
    ├── db/
    │   ├── index.js     # Factory: seleciona o adaptador conforme DB_TYPE
    │   ├── mongodb.js   # Adaptador MongoDB (Mongoose)
    │   └── sqlite.js    # Adaptador SQLite (better-sqlite3)
    ├── routes/
    │   ├── usuarios.js  # CRUD completo de usuários
    │   └── cep.js       # Consulta de CEP via ViaCEP
    ├── services/
    │   └── viacep.js    # Integração com a API pública ViaCEP
    ├── server.js        # Ponto de entrada do servidor
    ├── .env             # Variáveis de ambiente (não versionar)
    └── .env.example     # Template das variáveis de ambiente
```

---

## Pré-requisitos

| Ferramenta | Versão mínima                                         |
| ---------- | ----------------------------------------------------- |
| Node.js    | 18+                                                   |
| npm        | 9+                                                    |
| MongoDB    | 6+ (opcional — necessário apenas para o modo MongoDB) |

---

## Configuração e Execução

### 1. Backend

```bash
cd backend

# Copie e edite as variáveis de ambiente
cp .env.example .env
```

Edite o arquivo `.env`:

```env
PORT=3000

# Banco padrão quando o cliente não especificar: mongodb | sqlite
DB_TYPE=mongodb

# Conexão MongoDB
MONGO_URL=mongodb://localhost:27017/DSM_2026

# Caminho do arquivo SQLite (criado automaticamente)
SQLITE_PATH=./data/fatec.db
```

```bash
# Instale as dependências
npm install

# Inicie em modo desenvolvimento (hot-reload)
npm run dev

# Ou em produção
npm start
```

O servidor sobe em **http://localhost:3000**.  
Acesse `GET /` para ver todos os endpoints disponíveis.

---

### 2. App React Native (appSqlite2)

```bash
cd appSqlite2

# Instale as dependências
npm install
```

Edite o arquivo `.env` com o endereço correto do backend:

```env
# Android Emulator
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000

# iOS Simulator ou Web
# EXPO_PUBLIC_API_URL=http://localhost:3000

# Dispositivo físico (substitua pelo IP da máquina na rede local)
# EXPO_PUBLIC_API_URL=http://192.168.0.100:3000
```

```bash
# Inicie o Expo
npm start

# Ou direto para plataforma específica
npm run android
npm run ios
npm run web
```

---

## Endpoints da API

| Método   | Rota            | Descrição                            |
| -------- | --------------- | ------------------------------------ |
| `GET`    | `/`             | Status da API e lista de endpoints   |
| `GET`    | `/usuarios`     | Listar todos os usuários             |
| `GET`    | `/usuarios/:id` | Buscar usuário por ID                |
| `POST`   | `/usuarios`     | Criar novo usuário                   |
| `PUT`    | `/usuarios/:id` | Atualizar usuário                    |
| `DELETE` | `/usuarios/:id` | Deletar usuário                      |
| `GET`    | `/cep/:cep`     | Consultar endereço pelo CEP (ViaCEP) |

### Seleção dinâmica de banco de dados

Adicione o parâmetro `?db=` em qualquer rota de usuários:

```
GET  /usuarios?db=sqlite
GET  /usuarios?db=mongodb
POST /usuarios?db=sqlite
```

Alternativamente, envie o header `X-DB-Type: sqlite` ou `X-DB-Type: mongodb`.

Se omitido, o banco usado é o definido em `DB_TYPE` no `.env`.

---

### Corpo das requisições (POST / PUT)

```json
{
    "nome": "Maria Silva",
    "email": "maria@exemplo.com",
    "cep": "01310100",
    "logradouro": "Avenida Paulista",
    "numero": "1000",
    "complemento": "Apto 42",
    "bairro": "Bela Vista",
    "cidade": "São Paulo",
    "estado": "SP"
}
```

---

## Seleção de Armazenamento no App

O app exibe uma barra de seleção no topo com três opções:

| Opção            | Comportamento                                     |
| ---------------- | ------------------------------------------------- |
| 📱 Local SQLite  | Usa o SQLite do dispositivo via `expo-sqlite`     |
| 🗄️ API – SQLite  | Chama o backend; backend persiste no SQLite local |
| 🍃 API – MongoDB | Chama o backend; backend persiste no MongoDB      |

A troca é instantânea — os dados de cada banco são independentes.

---

## Integração ViaCEP

Ao digitar um CEP com 8 dígitos no formulário, o app consulta automaticamente a [API ViaCEP](https://viacep.com.br/) e preenche logradouro, bairro, cidade e estado.

O backend também expõe `GET /cep/:cep` para consultas independentes.

---

## Variáveis de Ambiente

### Backend (`backend/.env`)

| Variável      | Padrão                               | Descrição                            |
| ------------- | ------------------------------------ | ------------------------------------ |
| `PORT`        | `3000`                               | Porta do servidor                    |
| `DB_TYPE`     | `mongodb`                            | Banco padrão (`mongodb` ou `sqlite`) |
| `MONGO_URL`   | `mongodb://localhost:27017/DSM_2026` | String de conexão MongoDB            |
| `SQLITE_PATH` | `./data/fatec.db`                    | Caminho do arquivo SQLite            |

### App (`appSqlite2/.env`)

| Variável              | Padrão                 | Descrição           |
| --------------------- | ---------------------- | ------------------- |
| `EXPO_PUBLIC_API_URL` | `http://10.0.2.2:3000` | URL base do backend |
