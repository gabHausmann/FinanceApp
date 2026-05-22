# FinanceApp 💜

Aplicativo de controle financeiro pessoal — design premium fintech, construído com React Native + Expo + TypeScript.

## 🚀 Como rodar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn
- Expo CLI: `npm install -g expo-cli` (opcional, mas recomendado)
- Expo Go no celular **ou** Android Studio (emulador)

### Instalação e execução

```bash
# 1. Entrar na pasta do projeto
cd FinanceApp

# 2. Instalar dependências
npm install

# 3. Iniciar o servidor Expo
npx expo start
```

Após isso:
- **Android Emulator**: pressione `a` no terminal
- **Expo Go (celular)**: escaneie o QR code com o app Expo Go
- **iOS Simulator (Mac)**: pressione `i` no terminal

---

## 📦 Dependências instaladas

| Pacote | Versão | Para que serve |
|--------|--------|----------------|
| expo | ~54.0.33 | SDK base |
| react-native | 0.81.5 | Framework |
| react | 19.1.0 | UI Library |
| @react-navigation/native | ^7.x | Navegação |
| @react-navigation/bottom-tabs | ^7.x | Tab bar |
| @react-navigation/native-stack | ^7.x | Stack navigator |
| react-native-reanimated | ~3.17.4 | Animações |
| react-native-gesture-handler | ~2.24.0 | Gestos |
| react-native-safe-area-context | ^5.x | Safe area |
| react-native-screens | ^4.x | Telas nativas |
| react-native-svg | 15.11.2 | Gráficos SVG |
| expo-linear-gradient | ~14.1.4 | Gradientes |
| expo-camera | ~17.0.10 | Câmera |
| expo-image-picker | ~17.0.11 | Galeria |
| expo-font | ~14.0.11 | Fontes |
| @expo-google-fonts/poppins | ^0.4.2 | Fonte Poppins |

---

## 🗂️ Estrutura do projeto

```
FinanceApp/
├── App.tsx                     # Entrada principal
├── index.ts                    # Entry point Expo
├── app.json                    # Config Expo
├── babel.config.js             # Config Babel (reanimated plugin)
├── tsconfig.json               # Config TypeScript
├── package.json                # Dependências
├── assets/                     # Ícones e splash
└── src/
    ├── components/             # Componentes reutilizáveis
    │   ├── Badge.tsx
    │   ├── Button.tsx
    │   ├── FloatingButton.tsx
    │   ├── Input.tsx
    │   ├── MiniChart.tsx       # Gráficos SVG
    │   └── TransactionItem.tsx
    ├── context/
    │   └── AppContext.tsx      # Estado global
    ├── data/
    │   └── mockData.ts         # Dados simulados
    ├── navigation/
    │   └── RootNavigator.tsx   # Stack + Tab navigator
    ├── screens/
    │   ├── DashboardScreen.tsx
    │   ├── HistoryScreen.tsx
    │   ├── ProfileScreen.tsx
    │   ├── ReportsScreen.tsx
    │   ├── SubscriptionScreen.tsx
    │   └── TransactionFormScreen.tsx
    ├── theme/
    │   ├── colors.ts
    │   ├── spacing.ts
    │   └── typography.ts
    ├── types/
    │   └── index.ts
    └── utils/
        └── formatters.ts
```

---

## 🎨 Design System

- **Paleta**: Dark premium fintech — fundo `#060A12`, primário `#818CF8` (indigo)
- **Fontes**: Poppins (400, 500, 600, 700)
- **Verde**: `#34D399` (receitas) | **Vermelho**: `#F87171` (despesas)
- **Glassmorphism**: cards com `backgroundColor + borderColor` sutil

## 🧩 Funcionalidades

- ✅ Dashboard com saldo, gráfico de linha e transações recentes
- ✅ Botão flutuante animado com glow effect
- ✅ Nova transação (receita/despesa) com toggle animado
- ✅ Captura de foto com câmera (expo-camera)
- ✅ Seleção de imagem da galeria (expo-image-picker)
- ✅ Preview da imagem anexada
- ✅ Histórico com busca e filtros
- ✅ Agrupamento por mês
- ✅ Relatórios com gráfico de barras e rosca (SVG)
- ✅ Score financeiro
- ✅ Tela de planos (Free / Premium / Business)
- ✅ Modal de confirmação de assinatura
- ✅ Perfil com edição de avatar
- ✅ Tab bar personalizada com animações
- ✅ Saldo com opção de ocultar

---

## ⚠️ Possíveis avisos (não impedem execução)

- Avisos de `defaultProps` em componentes React 19 (não crítico)
- Reanimated pode mostrar aviso de worklet em desenvolvimento (normal)

---

## 📝 Notas importantes

1. **Câmera**: funciona apenas em dispositivo físico ou emulador com câmera configurada
2. **Galeria**: funciona normalmente no emulador com imagens de amostra do sistema
3. **Fontes**: carregadas automaticamente na inicialização via expo-font
4. **Dados**: todos os dados são mockados em memória (sem backend)
