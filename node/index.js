const express = require('express');
const mysql = require('mysql');

const app = express();
const porta = 3000;

const config = {
    host: 'db',
    user: 'root',
    password: '123456'
};

const conexao = mysql.createConnection(config);

// Conectar ao MySQL
conexao.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados');
    
    // Verificar e criar o banco de dados nodedb, se não existir
    conexao.query('CREATE DATABASE IF NOT EXISTS nodedb', (erro) => {
        if (erro) {
            console.error('Erro ao criar o banco de dados nodedb:', erro);
            return;
        }
        console.log('Banco de dados nodedb verificado/criado com sucesso');
        // Alterar a conexão para utilizar o banco de dados nodedb
        config.database = 'nodedb';
        conexao.changeUser({database: 'nodedb'}, (err) => {
            if (err) {
                console.error('Erro ao mudar para o banco de dados nodedb:', err);
                return;
            }
            console.log('Conexão alterada para o banco de dados nodedb');
        });
    });
});



// Rota para inserir dados na tabela
app.get('/', (req, res) => {
  // Criar tabela se não existir
const sqlCriarTabela = `
CREATE TABLE IF NOT EXISTS people (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
)
`;
conexao.query(sqlCriarTabela, (erro, resultados) => {
if (erro) {
    console.error('Erro ao criar tabela:', erro);
}
});
    const sqlInserirDados = `INSERT INTO people (name) VALUES ('JULIO')`;
    conexao.query(sqlInserirDados, (erro, resultados) => {
        if (erro) {
            console.error('Erro ao inserir dados:', erro);
            res.status(500).send('Erro ao inserir dados');
            return;
        }
        console.log('Dados inseridos com sucesso');
        obterTodos(res);
    });
});

// Rota para obter todos os dados da tabela
function obterTodos(res) {
    const SELECT_QUERY = `SELECT id, name FROM people`;
    conexao.query(SELECT_QUERY, (erro, resultados) => {
        if (erro) {
            console.error('Erro ao obter pessoas:', erro);
            res.status(500).send('Erro ao obter pessoas');
            return;
        }
        const linhasTabela = resultados.map(pessoa => `
            <tr>
                <td>${pessoa.id}</td>
                <td>${pessoa.name}</td>
            </tr>
        `).join('');

        const tabela = `
            <table>
                <tr>
                    <th>#</th>
                    <th>Nome</th>
                </tr>
                ${linhasTabela}
            </table>
        `;

        res.send(`
            <h1>Full Cycle Rocks!</h1>
            ${tabela}
        `);
    });
}

// Iniciar o servidor
app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});
