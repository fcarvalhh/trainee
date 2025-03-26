# Amazon Scraper

Um projeto de web scraping da Amazon que permite buscar produtos e exibir informações detalhadas sobre eles.

## Descrição

Este projeto consiste em uma aplicação web que permite buscar produtos na Amazon e exibir informações como título, avaliações, imagens e links dos produtos. O projeto está dividido em duas partes:

- Backend: API REST com Bun + Express que realiza o scraping
- Frontend: Interface web simples e responsiva com Vite

## Requisitos

- Bun (versão mais recente)
- Node.js (versão mais recente)

## Como Executar

### Backend

1. Entre na pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
bun install
```

3. Execute o servidor:
```bash
bun run dev
```

O servidor estará rodando em `http://localhost:3000`

### Frontend

1. Em outro terminal, entre na pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## Como Usar

1. Abra o navegador e acesse `http://localhost:5173`
2. Digite o nome do produto que deseja buscar no campo de busca
3. Clique no botão "Buscar"
4. Os resultados serão exibidos na tela com imagens, títulos, avaliações e links

## Observações Importantes

- Este projeto é apenas para fins educacionais
- O scraping da Amazon pode ser bloqueado se muitas requisições forem feitas em um curto período
- Recomenda-se usar um proxy ou implementar delays entre as requisições em ambiente de produção
- O user-agent e headers são configurados para simular um navegador real
- Alguns produtos podem não exibir todas as informações devido a variações no layout da Amazon 