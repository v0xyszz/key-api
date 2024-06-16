# Key Management API

Esta é uma API para gerenciamento de chaves, construída com Node.js, Express e MongoDB. A API permite gerar, ativar, desativar e consultar o status de chaves.

## Tecnologias Utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- Axios

## Instalação

Siga os passos abaixo para configurar e executar o projeto localmente.

1. Clone o repositório:
    ```bash
    git clone https://github.com/v0xyszz/key-api.git
    cd key-api
    ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Configure as variáveis de ambiente:
    - Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:
        ```
        PORT=80
        MONGO_URI=URL_DO_SEU_MONGODB
        SECRET_KEY=CHAVE_SECRETA_JWT
        ```

4. Inicie o servidor:
    ```bash
    npm start
    ```

O servidor estará rodando em `http://localhost:80`.

## Endpoints

### Autenticação

- **Gerar Token JWT**
    ```
    POST /api/token
    ```
    Gera um token JWT para autenticação.

### Gerenciamento de Chaves

- **Gerar Chave**
    ```
    POST /api/key/generate
    ```
    Gera uma nova chave. Necessário autenticação JWT.

- **Ativar Chave**
    ```
    POST /api/key/activate
    ```
    Ativa uma chave existente. Necessário autenticação JWT.
    - Body: `{ "key": "xxxx-xxxx-xxxx-xxxx", "computerId": "ID_DO_COMPUTADOR" }`

- **Deletar Chave**
    ```
    DELETE /api/key/delete/:key
    ```
    Deleta uma chave existente. Necessário autenticação JWT.

- **Listar Chaves**
    ```
    GET /api/keys
    ```
    Lista todas as chaves. Necessário autenticação JWT.

- **Status das Chaves**
    ```
    GET /api/keys/status
    ```
    Lista o status (ativa/inativa) de todas as chaves. Necessário autenticação JWT.

## Exemplo de Uso

### Gerar Token JWT

```bash
curl -X POST http://localhost/api/token
