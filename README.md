# Web Scraper Frontend

A modern, responsive React frontend application built with modern web technologies.

## 🚀 Features

- **Modern UI/UX**: Built with React 18, TypeScript, and Tailwind CSS
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Real-time Updates**: Live status monitoring and updates
- **Management Interface**: View, create, edit, and validate data
- **Monitoring Dashboard**: Track jobs with real-time progress updates
- **Storage Management**: Monitor storage usage and manage data
- **Dark Mode Ready**: Built with modern design principles

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **React Hook Form** - Form handling and validation
- **Axios** - HTTP client for API communication
- **Lucide React** - Beautiful, customizable icons
- **React Hot Toast** - Toast notifications

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── services/           # API services and utilities
├── store/              # State management (Zustand)
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx            # Main app component
└── main.tsx           # App entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/general-web-scraper-fe.git
   cd general-web-scraper-fe
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3001`

### Build for Production

```bash
npm run build
npm run preview
```

## 🔧 Configuration

### Environment Variables

The frontend can be configured to communicate with any backend API by updating the API configuration in the services.

### Vite Configuration

- **Port**: 3001
- **Build Output**: `dist/` directory
- **Source Maps**: Enabled for debugging

## 📱 Pages & Features

### 1. Dashboard
- Overview statistics
- Quick actions
- Recent jobs
- System status

### 2. Management
- Data management interface
- Create, edit, and delete operations
- Validation and error handling

### 3. Jobs
- Job monitoring and tracking
- Real-time status updates
- Job history and details

### 4. Storage
- Storage usage monitoring
- Data management interface
- File operations

## 🎨 UI Components

### Design System
- **Colors**: Consistent color palette with dark mode support
- **Typography**: Modern, readable font stack
- **Spacing**: Consistent spacing scale
- **Components**: Reusable UI components

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: Responsive breakpoints for all screen sizes
- **Touch Friendly**: Optimized for touch interactions

## 🚀 Deployment

### Docker Deployment
```bash
docker build -t web-scraper-frontend .
docker run -p 3001:80 web-scraper-frontend
```

### Static Hosting
The built application can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 📝 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting
npm run type-check      # Run TypeScript type checking

# Testing
npm run test            # Run tests
npm run test:ui         # Run tests with UI
npm run test:coverage   # Run tests with coverage
```

### Code Style & Quality
- **ESLint**: Code quality and consistency with React/TypeScript rules
- **Prettier**: Automatic code formatting
- **TypeScript**: Strict type checking and IntelliSense
- **Path Aliases**: Clean imports with `@/` prefix
- **Error Boundaries**: Graceful error handling
- **Custom Hooks**: Reusable logic encapsulation

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── __tests__/      # Component tests
│   ├── ErrorBoundary.tsx
│   └── LoadingSpinner.tsx
├── constants/           # App constants and configuration
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── services/            # API services and utilities
├── store/               # State management (Zustand)
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── App.tsx             # Main app component
└── main.tsx            # App entry point
```

### Testing Strategy
- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: Hook and utility function testing
- **Coverage**: Minimum 80% code coverage requirement
- **Mocking**: Comprehensive mocking for external dependencies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
