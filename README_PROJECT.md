# DevOps Troubleshooting Platform

A professional DevOps learning platform where engineers master Kubernetes troubleshooting through realistic, broken scenarios. Built with Next.js 14, TypeScript, and Tailwind CSS following the Technical Terminal / Developer HUD design aesthetic.

## 🎯 Features Implemented

### Core Pages
- **Landing Page** (`/`) - Hero section with features showcase
- **Dashboard** (`/dashboard`) - Stats overview, progress tracking, scenario recommendations
- **Scenarios** (`/scenarios`) - Browsable scenario grid with filtering and search
- **Workspace** (`/workspace/[id]`) - Interactive troubleshooting environment with terminal
- **Achievements** (`/achievements`) - Badge collection with rarity system
- **Authentication** (`/auth/login`, `/auth/register`) - Login and registration flows

### Key Components
- **Navigation** - Persistent header with active states
- **Terminal Emulator** - Command execution with syntax highlighting
- **Hint System** - Progressive 5-level hint drawer
- **Completion Modal** - Celebration with confetti animation
- **Loading Skeletons** - Shimmer effects for async content
- **Mobile Warning** - Desktop-only experience notification

### Design System
- Dark theme with deep navy background (#0a0e1a)
- Electric cyan (#0ea5e9) and neon green (#10b981) accents
- Space Grotesk (display), Inter (body), JetBrains Mono (code)
- Glassmorphism effects with backdrop blur
- Smooth animations and micro-interactions
- Custom scrollbar styling

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── dashboard/page.tsx          # Main dashboard
│   ├── scenarios/page.tsx          # Scenario browser
│   ├── workspace/[id]/page.tsx     # Interactive workspace
│   ├── achievements/page.tsx       # Achievement tracker
│   └── auth/
│       ├── login/page.tsx          # Login page
│       └── register/page.tsx       # Registration page
├── components/
│   ├── layout/
│   │   └── navigation.tsx          # Main navigation
│   ├── workspace/
│   │   └── completion-modal.tsx    # Completion celebration
│   ├── scenarios/
│   │   └── scenario-detail-modal.tsx
│   ├── common/
│   │   ├── loading-skeletons.tsx   # Loading states
│   │   ├── empty-state.tsx         # Empty state component
│   │   └── mobile-warning.tsx      # Mobile device warning
│   └── ui/                         # shadcn/ui components
└── lib/
    └── utils.ts                    # Utility functions
```

## 🎨 Design Features

### Color Palette
- **Background**: Deep space navy (#0a0e1a)
- **Surface**: Slate (#1e293b)
- **Primary**: Electric cyan (#0ea5e9)
- **Success**: Neon green (#10b981)
- **Error**: Hot magenta (#ec4899)
- **Terminal**: Matrix green (#00ff41)

### Typography
- **Display/Headings**: Space Grotesk (700-900 weight)
- **Body Text**: Inter (400-600 weight)
- **Code/Terminal**: JetBrains Mono (400-500 weight)

### Animation System
- Page transitions with fade + slide
- Card hover effects with lift and glow
- Button press feedback with scale
- Terminal output streaming with stagger
- Hint drawer slide animation
- Confetti particles on completion

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **UI Library**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Space Grotesk, Inter, JetBrains Mono)
- **Animations**: Tailwind CSS Animate + custom keyframes
- **Confetti**: canvas-confetti

## 🎮 Scenario System

The platform includes 8 pre-built K8s troubleshooting scenarios:

1. **Pod CrashLoopBackOff Mystery** (Beginner, 15 min)
2. **Service Cannot Reach Pods** (Intermediate, 25 min) ✓ Completed
3. **ConfigMap Changes Not Applied** (Beginner, 10 min) ✓ Completed
4. **PersistentVolume Claim Stuck Pending** (Advanced, 30 min)
5. **Ingress Returns 503 Errors** (Intermediate, 20 min)
6. **Node Running Out of Resources** (Advanced, 35 min)
7. **Deployment Rollout Stuck** (Beginner, 12 min)
8. **Secret Mount Permission Denied** (Intermediate, 18 min)

## 🏆 Achievement System

12 unlockable achievements across 4 rarity tiers:
- **Common**: First Steps, Beginner Master
- **Rare**: Speed Demon, No Hints Needed, Community Helper
- **Epic**: Week Warrior, Perfect Score, Kubectl Master
- **Legendary**: Advanced Ace, Marathon Runner, Completionist

## 📱 Responsive Design

- **Desktop (1440px+)**: Full split-pane workspace
- **Laptop (1024-1440px)**: Adjusted panels
- **Tablet/Mobile**: Shows desktop recommendation warning

## ✅ Type Safety

All code passes TypeScript strict mode checks with no errors.

## 🔮 Future Enhancements

- Backend integration with Supabase
- Real K8s cluster execution with containers
- User authentication with JWT
- Progress persistence across sessions
- Social features (leaderboards, sharing)
- More scenarios and learning paths
- AI-powered hint generation
