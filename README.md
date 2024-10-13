# Simple Shop List

## 1. Conceito

O Simple Shop List é um aplicativo projetado para facilitar a organização e o gerenciamento das compras de produtos. Ele permite que os usuários adicionem, visualizem e gerenciem seus produtos de maneira simples.

## 2. Funcionalidades

- **Adicionar Produtos**: Os usuários podem inserir novos produtos, especificando informações como nome, quantidade, unidade e categoria.
- **Visualização de Produtos**: A aplicação exibe uma lista dos produtos adicionados, permitindo fácil acesso e gerenciamento.
- **Persistência de Dados**: Os produtos são armazenados em um banco de dados Firestore, garantindo que os dados sejam salvos e acessíveis mesmo após a reinicialização do aplicativo.
- **Seleção de Categoria**: Os usuários podem escolher categorias predefinidas para seus produtos, facilitando a organização e a navegação.
- **Validação de Formulários**: A aplicação inclui validações para garantir que as entradas do usuário sejam corretas e completas.

## 3. Tecnologias

- **Next.js**: Utilizado para construção de interfaces de usuário.
- **TypeScript**: Para tipagem estática, melhorando a qualidade e a manutenção do código.
- **Firebase**: Usado para persistência de dados com Firestore.
- **React Hook Form e Zod**: Para validação de formulários.
- **Tailwind CSS**: Para estilização da interface de forma responsiva e moderna.
- **Shadcn**: Para componentes reutilizáveis lindos.
- **Zustand**: Para gerenciamento de estado global

## 4. Uso do Firebase

### Lógica de Usuário

Por ser uma a aplicação simples, foi utilizado o Firestore do Firebase para armazenar os dados dos produtos. Cada documento de produto adicionado carrega consigo o id do usuário na coleção de produtos. A estrutura do Firestore permite uma busca eficiente e a sincronização em tempo real dos dados através da busca com query trazendo apenas os produtos daquele usuário de forma simples.

### Salvar Produtos

Quando um usuário adiciona um produto, a aplicação cria um novo documento de produto, armazenando informações como nome, quantidade, unidade, categoria e id do usuário.

### Busca com Query

Para buscar produtos, a aplicação utiliza consultas baseadas em filtros, permitindo que os usuários localizem rapidamente os produtos desejados. As queries são feitas em tempo real, garantindo que as informações exibidas estejam sempre atualizadas.

## 5. Mudança de Cores e Layout

A aplicação utiliza uma paleta de cores que evoca a natureza e a frescura dos produtos, incorporando tons de verde e tons pastéis. A escolha dessas cores está alinhada com a temática de compras sustentáveis e naturais, remetendo à ideia de frescor e saúde.

Essas cores não apenas criam um ambiente visual agradável, mas também ajudam a transmitir a sensação de estar em um mercado local, onde produtos frescos são vendidos. O layout é clean e intuitivo, facilitando a navegação e tornando a experiência do usuário mais fluida. A combinação de elementos visuais e cores naturais busca inspirar uma conexão mais profunda com os produtos e a experiência de compra, promovendo uma abordagem consciente e saudável.

## 6. Como Executar a Aplicação

### Acessar online

A aplicação também está publicada na Vercel. Para acessá-la, basta visitar o link https://simple-shop-list-self.vercel.app/

### Locamente

1. Clone o repositório:
   ```bash
   git clone https://github.com/owarleysouza/simple-shop-list.git
   ```
2. Navegue até o diretório do projeto:
   cd simple-shop-list

3. Instale as dependências:
   npm install

4. Configure as credenciais do Firebase, criando um arquivo .env com as variáveis necessárias

5. Execute a aplicação:
   npm run dev
