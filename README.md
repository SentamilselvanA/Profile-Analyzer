# CodeNova - Coding Profile Analyzer

A modern, professional web application for analyzing coding profiles across multiple platforms including LeetCode, Codeforces, and GitHub.

## ✨ Features

### 🎨 Modern UI Design
- **Dark Mode First**: Optimized for developers with a polished dark theme
- **Responsive Design**: Fully responsive across desktop, tablet, and mobile
- **Glassmorphism Effects**: Modern glass-like UI elements with backdrop blur
- **Smooth Animations**: Subtle hover effects and transitions throughout

### 📊 Dashboard Analytics
- **Summary Statistics**: Total problems solved, platforms connected, highest rating
- **Platform Cards**: Individual cards for each connected platform with key metrics
- **Interactive Charts**: Bar charts and pie charts for problem distribution
- **Performance Analysis**: AI-powered insights on strengths, weaknesses, and recommendations

### 🔗 Multi-Platform Integration
- **LeetCode**: Algorithm problems and contest ratings
- **Codeforces**: Competitive programming contests and ratings
- **GitHub**: Repository analysis and contribution tracking

### 🎯 User Experience
- **Intuitive Navigation**: Clean navbar with mobile-responsive sidebar
- **Theme Toggle**: Seamless switching between light and dark modes
- **Loading States**: Professional loading indicators and skeleton screens
- **Error Handling**: User-friendly error messages and feedback

## 🚀 Tech Stack

### Frontend
- **React 19**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **React Router**: Client-side routing
- **Recharts**: Beautiful, responsive charts
- **Heroicons**: Consistent icon library
- **Axios**: HTTP client for API calls

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **JWT**: Authentication tokens

## 🎨 Design System

### Color Palette
- **Primary**: Blue tones for main actions and branding
- **Secondary**: Neutral grays for backgrounds and text
- **Accent Colors**:
  - Cyan: Success states and highlights
  - Emerald: Positive metrics and achievements
  - Violet: Special features and premium elements
  - Orange: Warnings and medium-priority items
  - Red: Errors and high-priority alerts

### Typography
- **Font Family**: Inter (system font stack fallback)
- **Hierarchy**: Clear heading levels with proper spacing
- **Readability**: Optimized contrast ratios for both themes

### Components
- **Stat Cards**: Analytics cards with icons and metrics
- **Platform Cards**: Individual platform overview cards
- **Analysis Cards**: Color-coded insight sections
- **Form Elements**: Styled inputs with focus states
- **Buttons**: Primary and secondary variants with hover effects

## 📱 Pages

### Authentication
- **Login Page**: Centered card with gradient background
- **Signup Page**: Matching design with form validation

### Main Application
- **Connect Profiles**: Platform connection interface with status indicators
- **Dashboard**: Comprehensive analytics dashboard with charts and insights

## 🛠️ Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd coding-profile-analyzer
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

5. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5174`

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
LEETCODE_API_KEY=your_leetcode_api_key
CODEFORCES_API_KEY=your_codeforces_api_key
GITHUB_API_KEY=your_github_api_key
```

## 🎯 Key Design Decisions

### Dark Mode Priority
- Default dark theme for developer comfort
- Light mode available for accessibility
- Theme persistence in localStorage
- Theme-aware chart styling

### Mobile-First Approach
- Responsive grid layouts
- Collapsible sidebar for mobile
- Touch-friendly button sizes
- Optimized chart rendering

### Performance Considerations
- Lazy loading of components
- Optimized bundle size with Vite
- Efficient re-renders with React best practices
- Minimal CSS with Tailwind utilities

## 📈 Future Enhancements

- **Advanced Analytics**: Heatmaps, streak tracking, progress trends
- **Social Features**: Profile sharing, leaderboards, comparisons
- **Goal Setting**: Personalized coding goals and milestones
- **Notifications**: Achievement alerts and progress reminders
- **Export Features**: PDF reports and data export

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Design inspiration from GitHub, LeetCode, and modern SaaS applications
- Icons provided by Heroicons
- Charts powered by Recharts
- Built with React and Tailwind CSS