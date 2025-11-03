# 📋 Todoist Clone

Um clone moderno e funcional do Todoist, construído com React e Vite, seguindo as melhores práticas de arquitetura e organização de código.

![React](https://img.shields.io/badge/React-19.2.0-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4.21-646cff?logo=vite)
![License](https://img.shields.io/badge/license-ISC-blue)

## 📸 Preview

Uma aplicação completa de gerenciamento de tarefas com todas as funcionalidades essenciais do Todoist:
- ✅ CRUD completo de tarefas
- 🚩 Sistema de prioridades (P1-P4)
- 📅 Datas de vencimento com formatação inteligente
- 📁 Organização por projetos
- 🔍 Filtros dinâmicos
- 💾 Persistência local (LocalStorage)

---

## 🚀 Começando

### Pré-requisitos

- **Node.js** 16.x ou superior
- **npm** ou **yarn**

### Instalação

```bash
# Clone o repositório
git clone https://github.com/vmelo58/vscode_project_todois.git

# Entre no diretório
cd vscode_project_todois

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Produção
npm run build        # Cria build otimizado
npm run preview      # Preview do build de produção
```

---

## 🏗️ Arquitetura

O projeto segue uma arquitetura modular e profissional, organizada por domínio:

```
src/
├── components/          # Componentes React
│   ├── layout/         # Componentes de layout
│   │   ├── Header/     # Cabeçalho da aplicação
│   │   └── Sidebar/    # Barra lateral com navegação
│   └── tasks/          # Componentes de tarefas
│       └── TaskList/   # Lista e gerenciamento de tarefas
├── constants/          # Configurações centralizadas
│   ├── filters.js      # Filtros disponíveis
│   ├── priorities.js   # Níveis de prioridade
│   └── projects.js     # Projetos do sistema
├── hooks/              # Custom React Hooks
│   ├── useTasks.js     # Lógica de gerenciamento de tarefas
│   └── useToolbar.js   # Integração com 21st.dev toolbar
├── utils/              # Funções utilitárias
│   └── date.js         # Helpers de manipulação de datas
├── styles/             # Estilos globais
│   └── global.css      # CSS global da aplicação
├── App.jsx             # Componente raiz
└── main.jsx            # Entry point
```

### Padrões Aplicados

- ✅ **Separation of Concerns (SoC)** - Separação clara de responsabilidades
- ✅ **Single Responsibility Principle** - Cada módulo tem uma única função
- ✅ **DRY (Don't Repeat Yourself)** - Reutilização de código
- ✅ **Custom Hooks Pattern** - Lógica encapsulada e reutilizável
- ✅ **Co-location** - Arquivos relacionados próximos

---

## ✨ Funcionalidades

### Gerenciamento de Tarefas

- **Criar** tarefas rapidamente com input dedicado
- **Editar** tarefas inline com painel expansível
- **Deletar** tarefas com confirmação visual
- **Marcar** como concluídas/pendentes
- **Validação** de inputs para evitar tarefas vazias

### Sistema de Metadados

#### 🚩 Prioridades
- **P1 (Urgente)** - Vermelho `#d1453b`
- **P2 (Alta)** - Laranja `#eb8909`
- **P3 (Média)** - Azul `#246fe0`
- **P4 (Baixa)** - Cinza `#999`

#### 📅 Datas de Vencimento
- Formatação inteligente: **Hoje**, **Amanhã**, ou data formatada
- Localização em português brasileiro (pt-BR)
- Validação de datas

#### 📁 Projetos
- **Inbox** 📥 - Caixa de entrada padrão
- **Pessoal** 📌 - Tarefas pessoais
- **Trabalho** 💼 - Tarefas profissionais

### Filtros Dinâmicos

- **Entrada** - Todas as tarefas
- **Hoje** - Tarefas com vencimento hoje
- **Próximos 7 dias** - Tarefas da semana
- **Projetos** - Filtros por projeto específico
- **Contadores dinâmicos** - Badge com quantidade de tarefas

### Persistência

- ✅ Salvamento automático no **LocalStorage**
- ✅ Recuperação de dados ao recarregar
- ✅ Tratamento robusto de erros
- ✅ Fallback para dados de demonstração

---

## 🛠️ Stack Tecnológica

### Core
- **React** 19.2.0 - Biblioteca UI
- **React DOM** 19.2.0 - Renderização
- **Vite** 5.4.21 - Build tool e dev server

### Desenvolvimento
- **@vitejs/plugin-react** 4.7.0 - Plugin Vite para React
- **@21st-extension/toolbar** 0.5.14 - Toolbar de desenvolvimento

### Otimizações

- ✅ `useMemo` para cálculos de filtros e contadores
- ✅ `useCallback` para memoização de funções CRUD
- ✅ React.StrictMode para detecção de problemas
- ✅ Code splitting automático pelo Vite

---

## 🔧 Configurações Especiais

### Patch Rollup parseAst

O projeto inclui um patch automático para resolver problemas de módulo do Rollup:

```javascript
// vite.config.js
resolve: {
  alias: {
    'rollup/dist/es/parseAst.js': 'rollup/dist/shared/parseAst.js',
  },
}
```

O patch é aplicado automaticamente via script `postinstall`.

### 21st.dev Toolbar

Integração com a toolbar de desenvolvimento da 21st.dev (apenas em modo DEV):

```javascript
// src/hooks/useToolbar.js
if (import.meta.env.DEV) {
  initToolbar({ plugins: [] })
}
```

---

## 📚 Estrutura de Dados

### Modelo de Tarefa

```javascript
{
  id: number,           // Timestamp único
  title: string,        // Título da tarefa
  completed: boolean,   // Status de conclusão
  priority: number|null,// Prioridade (1-4) ou null
  dueDate: string|null, // Data no formato YYYY-MM-DD
  projectId: string     // ID do projeto ('inbox', 'personal', 'work')
}
```

---

## 🎨 Estilo e Design

- **Paleta de cores** inspirada no Todoist original
- **Cor primária**: `#db4c3f` (vermelho Todoist)
- **Tipografia**: System fonts para performance
- **Layout responsivo** com Flexbox
- **Transições suaves** em hover states
- **Interface em português** (pt-BR)

---

## 🧪 Testes e Qualidade

### Checklist de Qualidade

- ✅ Sem vulnerabilidades XSS ou injection
- ✅ Validação de inputs
- ✅ Tratamento de erros robusto
- ✅ Sem credenciais expostas
- ✅ Code review via Pull Request
- ✅ Commits semânticos

### Segurança

- ✅ Sanitização de inputs com `.trim()`
- ✅ React escape automático (sem `dangerouslySetInnerHTML`)
- ✅ `.gitignore` configurado para proteger secrets
- ✅ LocalStorage com fallback seguro

---

## 📦 Build e Deploy

### Build de Produção

```bash
npm run build
```

Gera build otimizado na pasta `dist/`:
- ✅ Minificação de JS/CSS
- ✅ Tree shaking
- ✅ Code splitting
- ✅ Asset optimization

### Deploy

O projeto pode ser facilmente deployado em:
- **Vercel** - `vercel deploy`
- **Netlify** - `netlify deploy`
- **GitHub Pages** - com `gh-pages`
- **Qualquer host estático**

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga o fluxo:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📝 Histórico de Versões

### v1.0.0 (2025-11-03)
- ✅ Refatoração completa da arquitetura
- ✅ Implementação de custom hooks
- ✅ Criação de constants e utils
- ✅ Otimizações de performance
- ✅ Patch Rollup implementado

### v0.2.0 (2025-11-03)
- ✅ Sistema completo de tarefas com metadados
- ✅ Filtros e projetos
- ✅ Persistência LocalStorage

### v0.1.0 (2025-11-03)
- ✅ Setup inicial do projeto
- ✅ Integração com @21st-extension/toolbar

---

## 📄 Licença

Este projeto está sob a licença **ISC**.

---

## 👨‍💻 Autor

**Victor Melo** - [@vmelo58](https://github.com/vmelo58)

---

## 🙏 Agradecimentos

- Inspirado no [Todoist](https://todoist.com/)
- Desenvolvido com [Claude Code](https://claude.com/claude-code)
- Powered by [21st.dev](https://21st.dev)

---

## 📞 Suporte

Encontrou um bug? Tem uma sugestão?

- 🐛 [Abra uma issue](https://github.com/vmelo58/vscode_project_todois/issues)
- 💬 [Inicie uma discussão](https://github.com/vmelo58/vscode_project_todois/discussions)

---

<div align="center">

**⭐ Se este projeto foi útil, considere dar uma estrela!**

Made with ❤️ and ☕

</div>
