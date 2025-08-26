# Frontend Project Structure

This is a standalone React frontend project built with modern web technologies.

## 📁 Directory Structure

```
├── src/                    # Source code
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── services/          # API services and utilities
│   ├── store/             # State management (Zustand)
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main app component
│   └── main.tsx           # App entry point
├── .git/                  # Git repository
├── node_modules/          # Dependencies
├── .dockerignore          # Docker ignore file
├── .gitignore            # Git ignore file
├── Dockerfile             # Docker configuration
├── index.html             # HTML entry point
├── nginx.conf             # Nginx configuration
├── package.json           # Project dependencies and scripts
├── package-lock.json      # Locked dependency versions
├── postcss.config.js      # PostCSS configuration
├── README.md              # Project documentation
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite build configuration
```

## 🚀 Key Features

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for fast development and building
- **React Router** for navigation
- **Zustand** for state management
- **Axios** for API communication
- **Docker** support for containerization

## 🔧 Configuration Files

- **vite.config.ts**: Vite build tool configuration
- **tailwind.config.js**: Tailwind CSS framework configuration
- **tsconfig.json**: TypeScript compiler configuration
- **postcss.config.js**: PostCSS processing configuration
- **Dockerfile**: Container configuration
- **nginx.conf**: Web server configuration

## 📦 Dependencies

### Production Dependencies
- React 18.3.1
- React Router DOM 7.8.2
- Zustand 4.3.8
- Axios 1.3.4
- Tailwind CSS utilities
- Lucide React icons

### Development Dependencies
- TypeScript 4.9.3
- Vite 7.1.3
- ESLint for code quality
- PostCSS and Autoprefixer

## 🎯 Development Workflow

1. **Install dependencies**: `npm install`
2. **Start development server**: `npm run dev`
3. **Build for production**: `npm run build`
4. **Preview production build**: `npm run preview`
5. **Lint code**: `npm run lint`

## 🐳 Docker Support

The project includes Docker configuration for easy containerization:
- **Dockerfile**: Multi-stage build for production
- **nginx.conf**: Nginx configuration for serving static files
- **.dockerignore**: Excludes unnecessary files from build context

## 🌐 Deployment

The built application can be deployed to:
- Static hosting services (Vercel, Netlify, GitHub Pages)
- CDN services (CloudFlare, AWS CloudFront)
- Container platforms (Docker, Kubernetes)
- Traditional web servers (Nginx, Apache)
