<div align="center">

```
![applogo](https://github.com/user-attachments/assets/3d610453-c1f1-4319-b08c-275cc3de10e7)<svg width="115" height="37" viewBox="0 0 115 37" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.54561 8.16V20.6016H13.4208V26.1888H7.54561V35.424H1.04538e-05V0.921601H16.4544V8.16H7.54561ZM28.5519 29.0304C32.9871 29.0304 32.5839 21.6768 32.5839 18.7584V0.921601H40.1295V20.4864C40.1295 28.1856 37.6719 36.3456 28.5519 36.3456C19.2975 36.3456 16.9743 28.3008 16.9743 20.4864V0.921601H24.5199V18.7584C24.5199 21.5424 24.2703 29.0304 28.5519 29.0304ZM56.0442 25.6896L58.8858 0.921601H70.3098V35.4048H62.7642V8.16H62.6874L59.577 35.4048H52.4538L49.3434 8.16H49.2666V35.4048H41.721V0.921601H53.145L55.9866 25.6896H56.0442ZM79.6521 26.1888V29.952H88.5801L88.5417 35.424H72.1065V0.921601H88.5417V8.16H79.6521V20.6016H85.5081V26.1888H79.6521ZM105.757 18.4128C106.102 17.2608 106.064 15.8208 106.064 14.6496C106.064 11.8848 105.104 8.1792 101.686 8.1792C98.1726 8.1792 97.2702 11.7888 97.2702 14.6496C97.2702 23.04 105.872 19.7376 110.691 22.5408C112.88 23.808 114.301 25.92 114.301 28.4736C114.301 34.9248 106.697 36.3456 101.667 36.3456C96.1374 36.3456 90.915 34.8096 89.1486 29.0304L96.8862 26.2272C97.5582 28.512 99.1134 29.952 101.629 29.952C102.8 29.952 106.064 29.8944 106.064 28.1472C106.064 26.3424 102.838 26.2464 101.629 26.1888C93.4302 25.7472 89.0334 21.4272 89.0334 13.0944C89.0334 5.1264 93.5262 1.18637e-06 101.648 1.18637e-06C109.731 1.18637e-06 114.301 5.1648 114.301 13.0944C114.301 14.8608 114.32 16.6464 114.147 18.4128H105.757Z" fill="url(#paint0_linear_105_2)"/>
<defs>
<linearGradient id="paint0_linear_105_2" x1="95.9301" y1="-1.45599" x2="56.7207" y2="39.5437" gradientUnits="userSpaceOnUse">
<stop stop-color="#FF611D"/>
<stop offset="1" stop-color="#FEA680"/>
</linearGradient>
</defs>
</svg>
```

### *Your Food, Your Way, Delivered Today.*



<br/>

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Appwrite](https://img.shields.io/badge/Appwrite-FD366E?style=for-the-badge&logo=appwrite&logoColor=white)](https://appwrite.io/)
[![NativeWind](https://img.shields.io/badge/NativeWind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://www.nativewind.dev/)
[![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white)](https://zustand-demo.pmnd.rs/)







<br/>

> **FUMES** is a blazing-fast, mobile-first food delivery app.  
> Browse menus, customize every bite, and get it delivered — your way, every time.

<br/>

---

</div>

## 🔥 About

FUMES is a modern food delivery experience built entirely in **TypeScript** with **React Native + Expo**. Backed by **Appwrite** for auth, database, and file storage — FUMES is designed to be fast, offline-ready, and user-first.

No bloat. No friction. Just 🔥 food.

---

## ✨ Features

| Feature | Status |
|--------|--------|
| 🍔 Browse menu with category filters | ✅ Done |
| 🔍 Local-first smart search | 🚧 Planned |
| 🛒 Cart with item customizations | ✅ Done |
| 🎞️ Cart animations | ✅ Done |
| 🖼️ Compressed image uploads to Appwrite | ✅ Done |
| 📍 Location detection + mock location guard | ✅ Done |
| 🔐 Secure image loading via JWT | 🚧 Planned |
| 🔄 Swipe down to refresh | 🚧 Planned |
| 🗑️ Swipe to delete from cart | 🚧 Planned |

---

## 🛠️ Tech Stack

```
├── Language        → TypeScript (99.3%)
├── Framework       → React Native + Expo (File-based routing)
├── Backend         → Appwrite (Auth · Database · Storage)
├── Styling         → NativeWind (TailwindCSS for RN)
├── State           → Zustand
├── Local Storage   → AsyncStorage
├── Location        → expo-location
├── Image           → expo-image-manipulator
└── Mock Detection  → react-native-turbo-mock-location-detector
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `18+`
- Expo CLI
- Appwrite Cloud or self-hosted instance
- Android/iOS device or emulator

### Installation

```bash
# Clone the repo
git clone https://github.com/the-shehryar/fumes-food-app.git
cd fumes-food-app

# Install dependencies
npm install

# Start the development server
npx expo start
```

> ⚠️ Some features (mock location detection) require a **dev build** — not Expo Go.
> ```bash
> npx expo run:android
> ```

### Environment Variables

Create a `.env` file in the root (see `.env` already in repo — **do not commit real keys**):

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
EXPO_PUBLIC_APPWRITE_BUCKET_ID=your_bucket_id
```

---

## 📁 Project Structure

```
fumes-food-app/
│
├── app/                  # Expo Router — file-based screens & navigation
├── assets/
│   └── images/           # Static images, SVGs, icons
├── constants/            # App-wide constants, categories, static data
├── design/               # Design references / mockups
├── libs/                 # Appwrite client, useAppwrite hook, AsyncStorage utils
├── stores/               # Zustand global state (auth, menus, cart)
├── types/                # TypeScript type definitions
│
├── app.json              # Expo config
├── tailwind.config.js    # NativeWind / TailwindCSS config
├── metro.config.js       # Metro bundler config
├── babel.config.js       # Babel config
├── tsconfig.json         # TypeScript config
└── type.d.ts             # Global type declarations
```

---

## 🏗️ Architecture Highlights

### 🔄 Local-First Search Strategy
```
App Load    →  Fetch menus from Appwrite  →  Save to AsyncStorage
Search      →  Read AsyncStorage          →  Filter locally (instant ⚡)
            →  Cache miss?                →  Fallback to Appwrite
```

### 🖼️ Image Pipeline
```
Pick Image  →  Compress (1024px / 0.7 quality)  →  Upload to Appwrite Storage
```

### 🔐 Secure Image Loading
```
Request image  →  Generate JWT  →  Download to device cache  →  Render from local URI
```

### 📍 Location + Mock Guard
```
App opens  →  Request location permission
           →  Check for mock location (turbo-mock-location-detector)
           →  Mock detected? Block + Alert
           →  Real location? Reverse geocode → get city name
```

---

## 🗺️ Roadmap

- [ ] Swipe to delete cart items
- [ ] Pull-to-refresh on home feed
- [ ] Order placement flow
- [ ] Order history screen
- [ ] Push notifications
- [ ] v1 production release

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

```bash
# Create your feature branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m "feat: add amazing feature"

# Push to the branch
git push origin feature/amazing-feature

# Open a Pull Request
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

**Crafted with 🔥 by [@the-shehryar](https://github.com/the-shehryar)**

*Drop a ⭐ if FUMES made you hungry!*

</div>
