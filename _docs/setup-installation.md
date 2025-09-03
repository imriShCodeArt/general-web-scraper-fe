# Setup & Installation

This guide will help you set up your development environment for the General Web Scraper Frontend project.

## 🎯 Prerequisites

### Required Software
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher (comes with Node.js)
- **Git**: Version 2.30.0 or higher

### Recommended Software
- **VS Code**: With recommended extensions
- **Chrome/Edge**: For development and debugging
- **Postman/Insomnia**: For API testing

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Ubuntu 18.04+
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 2GB free space minimum
- **Network**: Stable internet connection for package installation

## 🚀 Quick Start

### 1. Clone the Repository
```bash
# Clone the repository
git clone https://github.com/your-org/general-web-scraper-fe.git

# Navigate to the project directory
cd general-web-scraper-fe

# Check out the development branch
git checkout develop
```

### 2. Install Dependencies
```bash
# Install all dependencies
npm install

# Verify installation
npm run build
```

### 3. Start Development Server
```bash
# Start the development server
npm run dev

# Open your browser to http://localhost:5173
```

## 🔧 Detailed Setup

### Node.js Installation

#### Windows
1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the setup wizard
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

#### macOS
```bash
# Using Homebrew (recommended)
brew install node

# Or download from nodejs.org
# Verify installation
node --version
npm --version
```

#### Linux (Ubuntu/Debian)
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### Git Setup
```bash
# Configure Git (if not already done)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set up SSH key (optional but recommended)
ssh-keygen -t ed25519 -C "your.email@example.com"
# Add the key to your GitHub account
```

### IDE Setup

#### VS Code (Recommended)
1. Download and install [VS Code](https://code.visualstudio.com/)
2. Install recommended extensions:
   ```bash
   code --install-extension esbenp.prettier-vscode
   code --install-extension bradlc.vscode-tailwindcss
   code --install-extension ms-vscode.vscode-typescript-next
   code --install-extension ms-vscode.vscode-json
   code --install-extension dbaeumer.vscode-eslint
   ```

3. Open the project in VS Code:
   ```bash
   code .
   ```

#### Alternative IDEs
- **WebStorm**: Full-featured JavaScript IDE
- **Atom**: Lightweight, customizable editor
- **Sublime Text**: Fast, extensible text editor

## 📦 Project Dependencies

### Core Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "typescript": "^5.0.0",
  "vite": "^4.0.0",
  "tailwindcss": "^3.3.0"
}
```

### Development Dependencies
```json
{
  "vitest": "^0.34.0",
  "@testing-library/react": "^13.4.0",
  "@testing-library/jest-dom": "^5.16.5",
  "eslint": "^8.0.0",
  "prettier": "^2.8.0"
}
```

### Installing Specific Versions
```bash
# Install a specific version of a package
npm install package-name@version

# Install peer dependencies
npm install package-name --legacy-peer-deps

# Install development dependencies
npm install package-name --save-dev
```

## 🌍 Environment Configuration

### Environment Variables
Create a `.env.local` file in the project root:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=true

# External Services
VITE_SENTRY_DSN=your-sentry-dsn
VITE_GOOGLE_ANALYTICS_ID=your-ga-id
```

### Environment File Priority
1. `.env.local` (highest priority, not committed)
2. `.env.development` (development environment)
3. `.env.production` (production environment)
4. `.env` (default, committed to repo)

### Accessing Environment Variables
```typescript
// In your React components
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const isDebugMode = import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true';

// Note: Only variables prefixed with VITE_ are accessible in the browser
```

## 🔌 Development Tools

### Browser Extensions
- **React Developer Tools**: For React debugging
- **Redux DevTools**: For state management debugging
- **Tailwind CSS IntelliSense**: For Tailwind class suggestions
- **ESLint**: For code quality checking

### VS Code Extensions
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-import-cost"
  ]
}
```

### Package Scripts
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript type checking

# Utilities
npm run clean        # Clean build artifacts
npm run analyze      # Analyze bundle size
```

## 🐳 Docker Setup (Optional)

### Using Docker for Development
```bash
# Build the development image
docker build -t scraper-fe:dev .

# Run the development container
docker run -p 5173:5173 -v $(pwd):/app scraper-fe:dev

# Or use Docker Compose
docker-compose up -d
```

### Docker Compose Configuration
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev
```

## 🔍 Troubleshooting

### Common Issues

#### Node Version Issues
```bash
# Check Node.js version
node --version

# If version is too old, update Node.js
# Windows: Download from nodejs.org
# macOS: brew upgrade node
# Linux: Use nvm or download from nodejs.org
```

#### Dependency Issues
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for peer dependency conflicts
npm ls
```

#### Port Already in Use
```bash
# Check what's using port 5173
# Windows
netstat -ano | findstr :5173

# macOS/Linux
lsof -i :5173

# Kill the process or use a different port
npm run dev -- --port 3000
```

#### TypeScript Errors
```bash
# Check TypeScript configuration
npm run type-check

# Clear TypeScript cache
rm -rf tsconfig.tsbuildinfo

# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

#### Build Issues
```bash
# Clear build cache
npm run clean

# Check for syntax errors
npm run lint

# Verify environment variables
npm run env:check
```

### Performance Issues

#### Slow Installation
```bash
# Use npm cache
npm config set cache ~/.npm-cache

# Use a faster registry
npm config set registry https://registry.npmjs.org/

# Use npm ci for faster installs
npm ci
```

#### Slow Development Server
```bash
# Increase memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Use faster file watching
npm run dev -- --force

# Check for large dependencies
npm run analyze
```

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Community
- [React Community](https://reactjs.org/community/support.html)
- [TypeScript Community](https://www.typescriptlang.org/community/)
- [Vite Community](https://vitejs.dev/community/)

### Tools
- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [VS Code](https://code.visualstudio.com/)

## ✅ Verification Checklist

After setup, verify everything is working:

- [ ] Node.js and npm are installed and working
- [ ] Git is configured and working
- [ ] Dependencies are installed (`npm install` succeeds)
- [ ] Development server starts (`npm run dev` works)
- [ ] Application opens in browser at `http://localhost:5173`
- [ ] Tests run successfully (`npm run test`)
- [ ] Build process works (`npm run build`)
- [ ] Linting passes (`npm run lint`)
- [ ] TypeScript compilation works (`npm run type-check`)

## 🆘 Getting Help

If you encounter issues during setup:

1. **Check the troubleshooting section** above
2. **Search existing issues** in the project repository
3. **Create a new issue** with:
   - Your operating system and version
   - Node.js and npm versions
   - Error messages and stack traces
   - Steps to reproduce the issue
4. **Ask in team discussions** or chat channels
5. **Check the project's README** for additional setup information

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Maintainers**: Development Team
