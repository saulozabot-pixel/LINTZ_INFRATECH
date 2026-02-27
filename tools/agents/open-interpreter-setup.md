# 🤖 Open Interpreter — Guia de Instalação e Uso

## O que é o Open Interpreter?

O Open Interpreter é um agente de IA que pode **controlar seu computador**:
- Executar código (Python, JavaScript, Shell)
- Abrir e fechar programas
- Navegar na web
- Criar, editar e deletar arquivos
- Controlar o mouse e teclado
- Tirar screenshots
- Qualquer coisa que você faria manualmente

---

## 📋 Pré-requisitos

- ✅ Python 3.12 (instalado via winget)
- ✅ Uma chave de API (OpenAI, Anthropic, ou modelo local)

---

## 🚀 Instalação

### 1. Abra um novo terminal (após reiniciar o VS Code)

```powershell
# Verificar Python
python --version
# Deve mostrar: Python 3.12.x

# Verificar pip
pip --version
```

### 2. Instalar Open Interpreter

```powershell
pip install open-interpreter
```

### 3. Configurar chave de API

**Opção A: OpenAI (GPT-4)**
```powershell
# Definir variável de ambiente permanente
setx OPENAI_API_KEY "sua-chave-openai-aqui"
```
Obter chave em: https://platform.openai.com/api-keys

**Opção B: Anthropic (Claude)**
```powershell
setx ANTHROPIC_API_KEY "sua-chave-anthropic-aqui"
```
Obter chave em: https://console.anthropic.com/

**Opção C: Modelo local (GRATUITO com Ollama)**
```powershell
# Instalar Ollama
winget install Ollama.Ollama

# Baixar modelo (ex: llama3)
ollama pull llama3

# Usar com Open Interpreter
interpreter --model ollama/llama3
```

---

## 💻 Como usar

### Modo interativo (chat)
```powershell
interpreter
```

### Com modelo específico
```powershell
# GPT-4
interpreter --model gpt-4

# Claude
interpreter --model claude-3-5-sonnet-20241022

# Modelo local
interpreter --model ollama/llama3
```

### Modo seguro (pede confirmação antes de executar)
```powershell
interpreter --safe_mode ask
```

---

## 🎯 Exemplos de comandos para o seu workflow

Após iniciar o `interpreter`, você pode digitar em português:

```
"Tire um screenshot do site https://lux-driver-assistent-18y8.vercel.app"

"Abra o VS Code na pasta C:\Users\SAULO\AndroidStudioProjects\Lux"

"Execute npm run build no projeto LUX e me diga se teve erros"

"Crie um PDF da página https://lux-driver-assistent-18y8.vercel.app/pitch-deck-locadora-ev.html"

"Verifique se o deploy do Vercel está funcionando acessando as URLs do projeto"

"Abra o Chrome e navegue até o Vercel Dashboard"

"Faça git add, commit com mensagem 'feat: atualização' e push"
```

---

## 🔐 Segurança

- Use `--safe_mode ask` para confirmar antes de executar comandos
- Nunca dê acesso a arquivos sensíveis (.env, keystores)
- Monitore o que o agente está fazendo
- Use modelos locais (Ollama) para dados confidenciais

---

## 📊 Comparação de opções

| Modelo | Custo | Velocidade | Qualidade | Privacidade |
|--------|-------|------------|-----------|-------------|
| GPT-4o | ~$0.01/msg | Rápido | ⭐⭐⭐⭐⭐ | Nuvem |
| Claude 3.5 | ~$0.01/msg | Rápido | ⭐⭐⭐⭐⭐ | Nuvem |
| Llama3 (local) | Grátis | Médio | ⭐⭐⭐⭐ | Local ✅ |
| Mistral (local) | Grátis | Rápido | ⭐⭐⭐ | Local ✅ |

---

## 🔗 Links úteis

- Documentação: https://docs.openinterpreter.com
- GitHub: https://github.com/OpenInterpreter/open-interpreter
- Ollama (modelos locais): https://ollama.com
- OpenAI API: https://platform.openai.com
- Anthropic API: https://console.anthropic.com
