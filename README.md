# FitHome - App de Saúde para Home Office 🏋️‍♂️

App de saúde focado em usuário de 23 anos (50kg) em regime de home office, com funcionalidades de:
- ⚡ Registro rápido de alimentos (< 3 segundos)
- 💪 Treinos noturnos de 10 minutos
- 📊 Acompanhamento de peso com gráfico CTM
- 🔔 Sistema completo de notificações diárias
- 🎯 Gamificação com streaks e tiers
- 🏆 Recompensas imediatas pós-treino

## 📋 Pré-requisitos

Antes de compilar o app, certifique-se de ter instalado:

1. **Node.js** (versão 18 ou superior)
   - Download: https://nodejs.org/

2. **EAS CLI** (Expo Application Services)
   ```bash
   npm install -g eas-cli
   ```

3. **Conta Expo**
   - Crie em: https://expo.dev/signup
   - Ou faça login: `eas login`

## 🚀 Instalação e Configuração

### 1. Instalar Dependências

```bash
# Instalar todas as dependências do projeto
npm install
```

### 2. Configurar Expo Account

```bash
# Fazer login na sua conta Expo
eas login

# Configurar o projeto (apenas na primeira vez)
eas build:configure
```

## 📱 Compilar APK para Android

### Opção 1: Build de Preview (Recomendado para Teste)

Gera um APK que pode ser instalado diretamente no seu dispositivo Android:

```bash
# Build de preview
eas build --platform android --profile preview

# Ou use o comando simplificado
npm run build:android:preview
```

Após o build:
1. Acesse o link fornecido no terminal
2. Baixe o APK no seu dispositivo Android
3. Instale o APK (permita instalação de fontes desconhecidas se necessário)

### Opção 2: Build de Produção (Para Google Play Store)

Gera um AAB (Android App Bundle) para publicação na Play Store:

```bash
# Build de produção
eas build --platform android --profile production

# Ou use o comando simplificado
npm run build:android:production
```

### Opção 3: Build Local (Mais Rápido, Requer Android Studio)

Se você tem Android Studio instalado:

```bash
# Build local
eas build --platform android --profile preview --local
```

## 🍎 Compilar para iOS

**Nota:** Requer uma conta Apple Developer ($99/ano)

```bash
# Build de preview para iOS
eas build --platform ios --profile preview

# Build de produção para App Store
eas build --platform ios --profile production
```

## 🛠️ Scripts Disponíveis

Adicione estes scripts ao `package.json` para facilitar os builds:

```json
{
  "scripts": {
    "build:android:preview": "eas build --platform android --profile preview",
    "build:android:production": "eas build --platform android --profile production",
    "build:ios:preview": "eas build --platform ios --profile preview",
    "build:ios:production": "eas build --platform ios --profile production",
    "build:all": "eas build --platform all --profile production"
  }
}
```

## 📦 Estrutura do Projeto

```
.
├── client/                 # Código React Native
│   ├── components/         # Componentes reutilizáveis
│   ├── screens/            # Telas do app
│   ├── navigation/         # Configuração de navegação
│   ├── lib/                # Utilitários (storage, notificações)
│   ├── constants/          # Constantes e temas
│   └── types/              # Definições TypeScript
├── assets/                 # Imagens e ícones
├── app.json                # Configuração Expo
└── package.json            # Dependências
```

## 🔔 Funcionalidades de Notificações

O app possui um sistema completo de notificações diárias:

### Notificações Automáticas
- **10:00** - Shot de Mel (boost de energia)
- **10:30** - Correção de postura
- **12:30** - Lembrete de almoço (frases dinâmicas)
- **15:00** - Correção de postura
- **16:00** - Lanche da tarde
- **18:00** - Shutdown Ritual (treino noturno)

### Notificações Contextuais
- Alerta de meta calórica (quando faltam < 500 kcal após 17h)
- Alerta de streak em risco (quando não completou treino após 20h)
- Recompensa de treino completo (ao finalizar exercícios)

### Configurações
Todas as notificações podem ser ativadas/desativadas na tela de Configurações.

## 🎨 Funcionalidades do App

### Dashboard (Home)
- Quick-Add Buttons para registro instantâneo
- Shot de Mel (widget de energia)
- Gráfico de peso com método CTM
- Card de progresso calórico
- Widget de pull-ups
- Card de streak e tier atual

### Treino Noturno
- Botão "Estender o Tapete" (gatilho de hábito)
- Timer progressivo para cada exercício
- Contador de pull-ups
- Animação de recompensa ao completar

### Configurações
- Ajuste de meta calórica
- Gerenciamento de Streak Freezes
- Toggle de notificações (refeições e postura)
- Visualização de gatilhos de hábito
- Frases dinâmicas personalizadas

## 🐛 Troubleshooting

### Erro: "EXPO_TOKEN not set"
```bash
# Fazer login novamente
eas login
```

### Erro: "Android SDK not found"
Para builds locais, instale Android Studio:
1. Baixe em: https://developer.android.com/studio
2. Abra o SDK Manager e instale Android SDK 34

### Erro de dependências
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### App não abre no dispositivo
1. Verifique se permitiu instalação de fontes desconhecidas
2. Verifique se o dispositivo tem Android 7.0+ (API 24+)
3. Limpe o cache do app nas configurações do Android

## 📊 Requisitos do Dispositivo

### Android
- Android 7.0 (Nougat) ou superior
- Mínimo 2GB RAM
- 100MB de espaço livre

### iOS
- iOS 13.4 ou superior
- iPhone 6s ou mais recente
- 100MB de espaço livre

## 🔐 Permissões do App

O app solicita as seguintes permissões:
- **Notificações** - Para lembretes diários
- **Internet** - Para sincronização de dados (futuro)

## 📝 Próximos Passos Após Build

1. **Testar o APK**
   - Instale no seu dispositivo
   - Teste todas as funcionalidades
   - Verifique notificações

2. **Ajustar Configurações**
   - Configure suas metas calóricas
   - Ative/desative notificações conforme preferência
   - Teste o sistema de streaks

3. **Publicar (Opcional)**
   - Google Play Store: Use o build de produção (AAB)
   - Necessário: Conta Google Play Developer ($25 única vez)

## 💡 Dicas de Uso

1. **Primeiro Acesso**
   - Permita notificações quando solicitado
   - Configure sua meta calórica nas Configurações
   - Faça o primeiro registro rápido para testar

2. **Registro de Alimentos**
   - Um toque = registrado instantaneamente
   - Animação de confete confirma o registro
   - Não há pop-ups ou confirmações extras

3. **Treino Noturno**
   - Toque em "Estender o Tapete" para começar
   - Complete todos os exercícios para ganhar recompensa
   - Notificação automática às 18h

4. **Streak Freezes**
   - Use em dias difíceis de trabalho
   - Recarrega 2x por mês automaticamente
   - Protege sua ofensiva de dias consecutivos

## 📞 Suporte

Para problemas ou dúvidas:
- Abra uma issue no repositório
- Contate o desenvolvedor
- Consulte a documentação Expo: https://docs.expo.dev/

## 📄 Licença

Projeto privado - Todos os direitos reservados

---

**Desenvolvido com ❤️ para melhorar a saúde de quem trabalha de casa**
