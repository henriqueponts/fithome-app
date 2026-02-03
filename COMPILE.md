# 🚀 Guia Rápido: Como Compilar o APK

## Passos Simples para Gerar seu APK

### 1️⃣ Preparação (Apenas na primeira vez)

```bash
# 1. Instalar dependências
npm install

# 2. Instalar EAS CLI globalmente
npm install -g eas-cli

# 3. Fazer login no Expo
eas login
```

Se não tem conta Expo:
- Acesse: https://expo.dev/signup
- Crie sua conta gratuita
- Volte e execute: `eas login`

### 2️⃣ Compilar APK (Apenas 1 comando!)

```bash
# Compilar APK de teste/preview
eas build --platform android --profile preview
```

**O que acontece:**
1. O Expo vai perguntar se quer criar um keystore (responda **Yes**)
2. Build inicia nos servidores da Expo (leva 5-15 minutos)
3. Você receberá um link para baixar o APK

### 3️⃣ Baixar e Instalar

1. **Acesse o link** fornecido no terminal (ou acesse https://expo.dev)
2. **Baixe o APK** no seu celular Android
3. **Instale o APK**:
   - Pode precisar permitir "Instalar de fontes desconhecidas"
   - Configurações > Segurança > Fontes Desconhecidas

### 4️⃣ Testar o App

Abra o app e teste:
- ✅ Registro rápido de alimentos
- ✅ Sistema de notificações (permita quando solicitar)
- ✅ Treino noturno
- ✅ Configurações e metas

---

## 🎯 Comandos Úteis

### Ver status dos builds
```bash
eas build:list
```

### Cancelar build em andamento
```bash
eas build:cancel
```

### Build local (mais rápido, requer Android Studio)
```bash
eas build --platform android --profile preview --local
```

### Build de produção (para Play Store)
```bash
eas build --platform android --profile production
```

---

## ❓ Problemas Comuns

### "EXPO_TOKEN not set"
**Solução:** Execute `eas login` novamente

### "Build failed"
**Solução:** Verifique o log de erro e:
1. Confirme que todas as dependências estão instaladas
2. Tente novamente: `eas build --platform android --profile preview`

### APK não instala
**Solução:**
1. Ative "Instalar apps de fontes desconhecidas"
2. Verifique se tem Android 7.0 ou superior
3. Limpe downloads antigos e tente baixar novamente

### Notificações não funcionam
**Solução:**
1. Permita notificações quando o app solicitar
2. Vá em Configurações do app
3. Ative os toggles de notificações

---

## 📱 Requisitos Mínimos

- **Android:** 7.0 ou superior
- **RAM:** 2GB mínimo
- **Espaço:** 100MB livre
- **Internet:** Necessária apenas para download

---

## 🎉 Pronto!

Seu app estará funcionando com:
- ⚡ Registro instantâneo de alimentos
- 🔔 Notificações diárias automáticas
- 💪 Treinos de 10 minutos
- 📊 Gráfico de peso e progresso
- 🏆 Sistema de streaks e gamificação

**Tempo total:** ~20 minutos (incluindo build no servidor)

---

## 💡 Dica Pro

Adicione estes scripts ao seu `package.json` para facilitar:

```json
{
  "scripts": {
    "android": "eas build --platform android --profile preview",
    "android:prod": "eas build --platform android --profile production",
    "status": "eas build:list"
  }
}
```

Depois use apenas:
```bash
npm run android
```
