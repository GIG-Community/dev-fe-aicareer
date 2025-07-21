import { createBrowserRouter } from 'react-router-dom';
import { createElement } from 'react';
import App from './App';
import HomePage from './pages/home/page';
import AimprovePage from './pages/aimprove/page';
import AinterviewPage from './pages/ainterview/page';
import AitestPage from './pages/aitest/page';
import AiworkPage from './pages/aiwork/page';
import InterviewSimulation from './pages/ainterview/interview-simulation/page';

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
        element: createElement(AimprovePage)
      },
      {
        path: '/ainterview',
        element: createElement(AinterviewPage)
      },
      {
        path: '/aitest',
        element: createElement(AitestPage)
      },
      {
        path: '/aiwork',
        element: createElement(AiworkPage)
      },
      {
        path: '/ainterview/interview-simulation',
        element: createElement(InterviewSimulation)
      }
    ]
  }
]);
