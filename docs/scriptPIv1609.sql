-- Criação do banco de dados do PI
CREATE DATABASE IF NOT EXISTS sistema_argenzio;

-- Criação das tabelas do banco de dados
-- Tabela 'usuario' será utilizada só para registro de usuários registrados
CREATE TABLE IF NOT EXISTS usuario (
	idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    tipo ENUM('atendente', 'chefe'),
    nome VARCHAR(45),
    email VARCHAR(50) UNIQUE,
    senha CHAR(8)
);

CREATE TABLE IF NOT EXISTS cliente (
	idCliente INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(60),
    cnpj INT,
    cidade VARCHAR(80)
);

CREATE TABLE IF NOT EXISTS produto (
	idProduto INT PRIMARY KEY AUTO_INCREMENT,
    descricao VARCHAR(100),
    valorUnitario DECIMAL(10, 2)
);

CREATE TABLE IF NOT EXISTS avaliacaoCliente (
	idAvaliacao INT PRIMARY KEY AUTO_INCREMENT,
    nota INT,
    dataAvaliacao DATE,
    descricao TEXT,
    idCliente INT,
    FOREIGN KEY (idCliente) REFERENCES cliente(idCliente) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS venda (
	idVenda INT PRIMARY KEY AUTO_INCREMENT,
    quantidade INT,
    valorTotal DECIMAL(10, 2),
    dataVenda DATE,
    idCliente INT,
    idProduto INT,
    idAvaliacao INT,
    FOREIGN KEY (idCliente) REFERENCES cliente(idCliente) ON DELETE CASCADE,
    FOREIGN KEY (idProduto) REFERENCES produto(idProduto) ON DELETE CASCADE,
    FOREIGN KEY (idAvaliacao) REFERENCES avaliacaoCliente(idAvaliacao) ON DELETE CASCADE
);

-- Criação dos papéis de usuário
CREATE ROLE 'Chefe';
CREATE ROLE 'Atendente';

-- Gerenciamento de permissões
GRANT ALL PRIVILEGES ON sistema_argenzio.* TO 'Chefe';
GRANT SELECT, INSERT, DELETE ON sistema_argenzio.cliente TO 'Atendente';
GRANT SELECT, INSERT, DELETE ON sistema_argenzio.avaliacaocliente TO 'Atendente';
GRANT SELECT, INSERT, DELETE ON sistema_argenzio.venda TO 'Atendente';

-- Dados de teste
INSERT INTO usuario (tipo, nome, email, senha) VALUES
('chefe', 'Henrique Duarte da Costa', 'henrique.duarte@argenzio.com', '123'),
('atendente', 'Sophia Müller', 'sophia.muller@argenzio.com', 'abc');

CREATE USER 'henrique'@'localhost' IDENTIFIED BY '123';
CREATE USER 'sophia'@'localhost' IDENTIFIED BY 'abcd';

GRANT 'Chefe' TO 'henrique'@'localhost';
GRANT 'Atendente' TO 'sophia'@'localhost';

SET DEFAULT ROLE ALL TO 'henrique'@'localhost', 'sophia'@'localhost';