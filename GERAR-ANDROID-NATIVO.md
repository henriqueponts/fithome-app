# Como Gerar Projeto Android Nativo para Android Studio

## ⚠️ Importante
Este projeto usa **Expo (Managed Workflow)**, que não gera pastas `/android` e `/ios` por padrão.

Para editar no Android Studio, você tem 2 opções:

---

## Opção 1: Prebuild (Gerar pasta /android)

```bash
# 1. Entre no projeto
cd fithome-app

# 2. Instale dependências
npm install

# 3. Gere a pasta /android
npx expo prebuild --platform android

# 4. Agora você terá uma pasta /android que pode abrir no Android Studio
```

**Depois disso:**
1. Abra o Android Studio
2. File > Open > Selecione a pasta `fithome-app/android`
3. Aguarde o Gradle sincronizar
4. Você pode editar código nativo Android

**⚠️ Atenção:**
- Após `expo prebuild`, você sai do "managed workflow"
- Precisará gerenciar código nativo manualmente
- Builds do Expo podem não funcionar mais

---

## Opção 2: Continuar com Expo + VS Code (Recomendado)

**Melhor para este projeto porque:**
- ✅ Código mais simples (TypeScript/React)
- ✅ Builds automáticos com EAS
- ✅ Não precisa conhecer Android nativo
- ✅ Atualizações OTA possíveis no futuro

**Como editar:**
1. Instale o VS Code: https://code.visualstudio.com/
2. Extraia o projeto
3. Abra a pasta no VS Code
4. Edite os arquivos em `client/`

**Principais arquivos para editar:**
```
client/
├── screens/
│   ├── HomeScreen.tsx      # Dashboard
│   ├── WorkoutScreen.tsx   # Treino
│   └── SettingsScreen.tsx  # Configurações
├── components/
│   ├── QuickAddButton.tsx  # Botões de registro
│   ├── ExerciseCard.tsx    # Cards de exercício
│   └── ...
├── lib/
│   ├── notifications.ts    # Sistema de notificações
│   └── storage.ts          # Armazenamento local
└── constants/
    ├── data.ts            # Dados (alimentos, exercícios)
    └── theme.ts           # Cores e estilos
```

---

## Opção 3: Ejetar do Expo (Não Recomendado)

```bash
# Isso converte para React Native puro (sem volta!)
npx expo eject
```

**⚠️ Não faça isso a menos que:**
- Precise de módulos nativos específicos
- Tenha experiência com React Native
- Saiba que não poderá mais usar Expo

---

## 🎯 Minha Recomendação

**Use VS Code + Expo (Opção 2)**

Por quê?
1. Mais fácil de editar código TypeScript/React
2. Build automático com `eas build`
3. Não precisa conhecer Java/Kotlin
4. Hot reload durante desenvolvimento
5. Documentação melhor

**Quando usar Android Studio:**
- Se precisar editar código nativo (Java/Kotlin)
- Se precisar configurar gradle ou AndroidManifest
- Se precisar debugar código Android específico

---

## 📝 Como Testar suas Alterações

### Com Expo (Simples):
```bash
# 1. Inicie o servidor de desenvolvimento
npm install
npx expo start

# 2. Escaneie o QR Code com o app Expo Go
# Ou aperte 'a' para abrir no emulador Android
```

### Com Android Studio (Após prebuild):
```bash
# 1. Gere a pasta /android
npx expo prebuild --platform android

# 2. Abra Android Studio e rode o app
# Run > Run 'app'
```

---

## ❓ Precisa Editar Algo Específico?

Me diga o que você quer alterar e eu te mostro exatamente qual arquivo editar:

- 🎨 Cores e visual?
- ⏰ Horários de notificações?
- 🍔 Adicionar/remover alimentos?
- 💪 Mudar exercícios?
- 🔔 Personalizar mensagens?

---

**Resumo:**
- ✅ Recomendo: VS Code para editar código React Native
- ⚠️ Android Studio: Use só se precisar editar código nativo
- 🚫 Não ejete do Expo sem necessidade
