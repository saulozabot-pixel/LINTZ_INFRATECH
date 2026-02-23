# Documento de Arquitetura de Solução
## Plataforma de Gestão Hierárquica de Informações

Aplicação web corporativa para apresentação institucional técnica da arquitetura de solução de um sistema de gestão hierárquica de informações para consultores de banco de investimentos.

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 18+ instalado
- npm 9+

### Instalação

```bash
# Acesse o diretório do projeto
cd docs/arquitetura-solucao

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em: **http://localhost:5173**

### Build para Produção

```bash
npm run build
npm run preview
```

---

## 📁 Estrutura do Projeto

```
docs/arquitetura-solucao/
├── index.html                    # Entry point HTML
├── package.json
├── vite.config.js                # Configuração Vite
├── tailwind.config.js            # Configuração TailwindCSS
├── postcss.config.js
└── src/
    ├── main.jsx                  # Bootstrap React
    ├── App.jsx                   # Componente raiz + roteamento de seções
    ├── index.css                 # Estilos globais + Tailwind directives
    ├── layouts/
    │   ├── Header.jsx            # Header fixo com navegação por âncoras
    │   └── Footer.jsx            # Footer corporativo
    ├── components/
    │   ├── FlowDiagram.jsx       # Diagrama de fluxo reutilizável com setas
    │   ├── SecurityCard.jsx      # Card de segurança com variantes de cor
    │   └── SectionHeader.jsx     # Cabeçalho padronizado de seção
    └── sections/
        ├── HeroSection.jsx       # Seção 1 — Capa executiva
        ├── ExecutiveSummarySection.jsx  # Seção 2 — Sumário executivo
        ├── ArchitectureSection.jsx      # Seção 3 — Arquitetura geral (diagrama)
        ├── AuthFlowSection.jsx          # Seção 4 — Fluxo de autenticação
        ├── HierarchySection.jsx         # Seção 5 — Modelo hierárquico (tabela)
        ├── SecuritySection.jsx          # Seção 6 — Segurança da informação
        ├── InfrastructureSection.jsx    # Seção 7 — Infraestrutura (diagrama)
        └── GovernanceSection.jsx        # Seção 8 — Governança
```

---

## 🧱 Stack Tecnológica

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 18.3 | Framework UI |
| Vite | 5.4 | Bundler e dev server |
| TailwindCSS | 3.4 | Estilização utilitária |
| Lucide React | 0.344 | Ícones corporativos |

---

## 📋 Seções do Documento

| # | Seção | Conteúdo |
|---|---|---|
| 01 | Capa | Título, subtítulo, metadados do documento |
| 02 | Sumário Executivo | Visão geral, pilares estratégicos, métricas |
| 03 | Arquitetura Geral | Diagrama em camadas com setas visuais |
| 04 | Fluxo de Autenticação | Diagrama de autenticação JWT + hierarquia |
| 05 | Modelo Hierárquico | Tabela + cards detalhados (A/AA/AAA/ABC) |
| 06 | Segurança da Informação | 6 cards de segurança + conformidade LGPD |
| 07 | Infraestrutura | Diagrama de topologia + especificações |
| 08 | Governança | Políticas, logs, rastreamento, relatórios |

---

## 🎨 Design

- **Paleta**: Navy blue (#102a43) + Gold (#d4a017) + Slate gray
- **Tipografia**: Inter (Google Fonts)
- **Layout**: Responsivo — desktop e mobile
- **Estilo**: Corporativo minimalista com sombras suaves

---

## 📄 Classificação

**Confidencial** — Uso restrito a destinatários autorizados.
