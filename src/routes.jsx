import { createBrowserRouter } from 'react-router-dom';
import { createElement } from 'react';
import App from './App';
import HomePage from './pages/home/page';
import AimprovePage from './pages/aimprove/page';
import AinterviewPage from './pages/ainterview/page';
import AitestPage from './pages/aitest/page';
import AiworkPage from './pages/aiwork/page';
import AiprojectPage from './pages/aiproject/page';
import InterviewSimulation from './pages/ainterview/interview-simulation/page';
import LoginPage from './pages/login/page';
import RegisterPage from './pages/register/page';
import PaymentPage from './pages/payment/page';
import Dashboard from './pages/dashboard/page';
import ProtectedRoute from './components/ProtectedRoute';
import GachaPage from './pages/aigacha/page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: createElement(App),
    children: [
      {
        path: '/',
        element: createElement(HomePage)
      },
      {
        path: '/aimprove',
        element: createElement(ProtectedRoute, { 
          children: createElement(AimprovePage),
          requiresPremium: true 
        })
      },
      {
        path: '/aigacha',
        element: createElement(ProtectedRoute, { 
          children: createElement(GachaPage),
          requiresPremium: false 
        })
      },
      {
        path: '/ainterview',
        element: createElement(ProtectedRoute, { 
          children: createElement(AinterviewPage),
          requiresPremium: true 
        })
      },
      {
        path: '/aitest',
        element: createElement(ProtectedRoute, { 
          children: createElement(AitestPage),
          requiresPremium: true 
        })
      },
      {
        path: '/aiwork',
        element: createElement(ProtectedRoute, { 
          children: createElement(AiworkPage),
          requiresPremium: true 
        })
      },
      {
        path: '/ainterview/interview-simulation',
        element: createElement(ProtectedRoute, { 
          children: createElement(InterviewSimulation),
          requiresPremium: true 
        })
      },
      {
        path: '/aiproject',
        element: createElement(ProtectedRoute, { 
          children: createElement(AiprojectPage),
          requiresPremium: true 
        })
      },
      {
        path: '/login',
        element: createElement(LoginPage)
      },
      {
        path: '/register',
        element: createElement(RegisterPage)
      },
      {
        path: '/payment',
        element: createElement(ProtectedRoute, { 
          children: createElement(PaymentPage),
          requiresPremium: false 
        })
      },
      {
        path: '/dashboard',
        element: createElement(ProtectedRoute, { 
          children: createElement(Dashboard),
          requiresPremium: false 
        })
      }
    ]
  }
]);
