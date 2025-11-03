# Projeto com @21st-extension/toolbar

## Instalação Completa ✅

A extensão `@21st-extension/toolbar` foi instalada com sucesso!

## Arquivos Criados

- [package.json](package.json) - Configuração do projeto com a dependência instalada
- [setup-toolbar.js](setup-toolbar.js) - Exemplo de integração da toolbar

## Como Usar

### 1. Executar em modo desenvolvimento:

```bash
npm run dev
```

### 2. Integração em seu projeto:

Importe e inicialize a toolbar no ponto de entrada da sua aplicação:

```javascript
import { initToolbar } from '@21st-extension/toolbar';

const stagewiseConfig = {
  plugins: [],
};

function setupStagewise() {
  if (process.env.NODE_ENV === 'development') {
    initToolbar(stagewiseConfig);
  }
}

setupStagewise();
```

## Integração com Frameworks

Para frameworks específicos, você pode usar pacotes dedicados:

- **React.js**: `@21st-extension/toolbar-react`
- **Next.js**: `@21st-extension/toolbar-next`
- **Nuxt.js**: `@21st-extension/toolbar-nuxt`
- **Vue.js**: `@21st-extension/toolbar-vue`
- **SvelteKit**: `@21st-extension/toolbar-svelte`

## Nota Importante

⚠️ Se você tiver múltiplas janelas do Cursor abertas, a toolbar pode enviar prompts para a janela errada. Mantenha apenas uma janela aberta ao usar o stagewise.

## Versão Instalada

- @21st-extension/toolbar: ^0.5.14
