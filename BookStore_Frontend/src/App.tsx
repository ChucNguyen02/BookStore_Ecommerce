import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Router } from './routers/router';
import ErrorBoundary from './components/user/common/ErrorBoundary';
import './styles/animations.css';

const DynamicToaster = () => {

  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={12}
      containerClassName="mt-16"
      toastOptions={{
        duration: 4000,
        className: 'shadow-2xl',

        // Default style áp dụng cho tất cả toast (bao gồm custom/plain toast)
        style: {
          borderRadius: '12px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          padding: '16px',
          fontSize: '15px',
          fontWeight: '500',
          background: 'rgba(31, 41, 55, 0.9)',
          color: '#e2e8f0',
          border: '1px solid rgba(75, 85, 99, 0.4)',
        },

        success: {
          duration: 4000,
          icon: '🎉',
          style: {
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          },
        },

        error: {
          duration: 5000,
          icon: '❌',
          style: {
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: '#fff',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          },
        },

        loading: {
          duration: Infinity,
          icon: '⏳',
          style: {
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: '#fff',
            border: '1px solid rgba(99, 102, 241, 0.3)',
          },
        },
      }}
    />
  );
};

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <DynamicToaster />
        <Router />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;