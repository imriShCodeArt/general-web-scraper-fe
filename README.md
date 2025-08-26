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

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
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

### Code Style
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **TypeScript**: Type safety and IntelliSense

### Testing
```bash
npm run test
npm run test:watch
```

### Building
```bash
npm run build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
