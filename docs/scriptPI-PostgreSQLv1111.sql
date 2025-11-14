-- Criação do banco de dados do PI
CREATE DATABASE sistema_argenzio;

CREATE TABLE cliente (
    idCliente SERIAL PRIMARY KEY,
    nome VARCHAR(60),
    cnpj VARCHAR(14),
    cidade VARCHAR(80)
);

CREATE TABLE produto (
    idProduto SERIAL PRIMARY KEY,
    descricao VARCHAR(100),
    valorUnitario DECIMAL(10, 2)
);

CREATE TABLE avaliacaocliente (
    idAvaliacao SERIAL PRIMARY KEY,
    nota INT,
    dataAvaliacao DATE,
    descricao TEXT,
    idCliente INT REFERENCES cliente(idCliente) ON DELETE CASCADE,
    idProduto INT REFERENCES produto(idProduto) ON DELETE CASCADE,
    idVendedor INT REFERENCES vendedor(idVendedor) ON DELETE CASCADE,
    tag INTEGER
);

CREATE TABLE venda (
    idVenda SERIAL PRIMARY KEY,
    quantidade INT,
    valorTotal DECIMAL(10, 2),
    dataVenda DATE,
    idCliente INT REFERENCES cliente(idCliente) ON DELETE CASCADE,
    idProduto INT REFERENCES produto(idProduto) ON DELETE CASCADE,
    idVendedor INT REFERENCES vendedor(idVendedor) ON DELETE CASCADE,
    idAvaliacao INT REFERENCES avaliacaocliente(idAvaliacao) ON DELETE CASCADE
);

CREATE TABLE contexto (
    idContexto SERIAL NOT NULL PRIMARY KEY,
    descricao VARCHAR(50) NOT NULL
);

CREATE TABLE vendedor (
    idVendedor SERIAL NOT NULL PRIMARY KEY,
    nome VARCHAR(60)
);

CREATE TABLE log_auditoria (
    idlog SERIAL PRIMARY KEY,
    tabela TEXT,
    operacao TEXT,
    registro_antigo jsonb,
    registro_novo jsonb,
    usuario VARCHAR(45),
    horario TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Criação dos papéis de usuário
CREATE ROLE chefe;
CREATE ROLE atendente;

-- Gerenciamento de permissões
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO chefe;
ALTER ROLE chefe WITH NOSUPERUSER;
GRANT SELECT, INSERT, DELETE ON cliente TO atendente;
GRANT SELECT, INSERT, DELETE ON avaliacaocliente TO atendente;
GRANT SELECT, INSERT, DELETE ON venda TO atendente;
GRANT INSERT ON log_auditoria TO atendente;

GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO chefe;