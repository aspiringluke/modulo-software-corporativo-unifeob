CREATE USER 'chefeTeste' WITH LOGIN PASSWORD 'chefe123';
GRANT chefe TO 'chefeTeste';

CREATE USER 'atendTeste' WITH LOGIN PASSWORD 'atend123';
GRANT atendente TO 'atendTeste';

INSERT INTO cliente (nome  cnpj, cidade) VALUES
('SP Pierin', '45667854300012', 'Santa Cruz das Palmeiras'),
('Henrique', '34567432500001', 'Casa Branca'),
('Max', '23456788765432', 'SJBV'),
('Bom Gosto', '56342534879765', 'Vargem Grande do Sul');

INSERT INTO contexto (descricao) VALUES
('Vendas'),
('Produtos'),
('Atendimento');

INSERT INTO produto (descricao, valorunitario) VALUES
('Bebida láctea morango 1L',  8.00),
('Mussarela Comercial 4KG', 144.00),
('Parmesao 6 meses fracionado', 30.00),
('Queijo Minas Frescal', 25.00),
('Queijo Minas Padrão', 25.00),
('Ricota Prensada', 20.00);

INSERT INTO vendedor (nome) VALUES
('Marcos'), 
('Mateus'),
('Lucas'),
('João'),
('Pedro');