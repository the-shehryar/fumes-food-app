<div align="center">

<img src="https://github.com/user-attachments/assets/3d610453-c1f1-4319-b08c-275cc3de10e7" width="400" height="auto" alt="App Logo"/>

### _Your Food, Your Way, Delivered Today._



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

| Feature                                     | Status     |
| ------------------------------------------- | ---------- |
| 🍔 Browse menu with category filters        | ✅ Done    |
| 🔍 Local-first smart search                 | 🚧 Planned |
| 💸 Safepay (Stripe alternative in Pakistan) | 🚧 Planned |
| 🛒 Cart with item customizations            | ✅ Done    |
| 🎞️ Cart animations                          | ✅ Done    |
| 🖼️ Compressed image uploads to Appwrite     | ✅ Done    |
| 📍 Location detection + mock location guard | ✅ Done    |
| 🔐 Secure image loading via JWT in v.2      | 🚧 Planned |
| 🔄 Swipe down to refresh in v.2             | 🚧 Planned |
| 🗑️ Swipe to delete from cart in v.2         | 🚧 Planned |

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
└── Image           → expo-image-manipulator
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
>
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

_Drop a ⭐ if FUMES made you hungry!_

</div>
