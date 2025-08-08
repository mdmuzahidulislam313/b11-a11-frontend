import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import PrivateRoute from '../components/shared/PrivateRoute';
import { publicApi } from '../utils/api';


const Home = lazy(() => import('../pages/Home'));
const Queries = lazy(() => import('../pages/Queries'));
const QueryDetails = lazy(() => import('../pages/QueryDetails'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const AddQuery = lazy(() => import('../pages/AddQuery'));
const MyQueries = lazy(() => import('../pages/MyQueries'));
const MyRecommendations = lazy(() => import('../pages/MyRecommendations'));
const RecommendationsForMe = lazy(() => import('../pages/RecommendationsForMe'));
const UpdateQuery = lazy(() => import('../pages/UpdateQuery'));
const NotFound = lazy(() => import('../pages/NotFound'));


const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);


const LazyWrapper = ({ children }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);


const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [

      {
        path: '/',
        element: <LazyWrapper><Home /></LazyWrapper>,
        loader: async () => {
          try {
            const response = await publicApi.get('/queries');
            return response.data.slice(0, 6);
          } catch (error) {
            console.error('Error fetching recent queries:', error);
            return [];
          }
        }
      },
      {
        path: '/queries',
        element: <LazyWrapper><Queries /></LazyWrapper>,
        loader: async ({ request }) => {
          const url = new URL(request.url);
          const search = url.searchParams.get('search') || '';
          try {
            const response = await publicApi.get(`/queries${search ? `?search=${search}` : ''}`);
            return response.data;
          } catch (error) {
            console.error('Error fetching queries:', error);
            return [];
          }
        }
      },
      {
        path: '/queries/:id',
        element: <LazyWrapper><QueryDetails /></LazyWrapper>,
        loader: async ({ params }) => {
          try {
            const [queryResponse, recommendationsResponse] = await Promise.all([
              publicApi.get(`/queries/${params.id}`),
              publicApi.get(`/recommendations/by-query/${params.id}`)
            ]);

            return {
              query: queryResponse.data,
              recommendations: recommendationsResponse.data
            };
          } catch (error) {
            console.error('Error fetching query details:', error);
            return { query: null, recommendations: [] };
          }
        }
      },
      {
        path: '/login',
        element: <LazyWrapper><Login /></LazyWrapper>
      },
      {
        path: '/register',
        element: <LazyWrapper><Register /></LazyWrapper>
      },


      {
        path: '/my-queries',
        element: <PrivateRoute><LazyWrapper><MyQueries /></LazyWrapper></PrivateRoute>
      },
      {
        path: '/add-query',
        element: <PrivateRoute><LazyWrapper><AddQuery /></LazyWrapper></PrivateRoute>
      },
      {
        path: '/update-query/:id',
        element: <PrivateRoute><LazyWrapper><UpdateQuery /></LazyWrapper></PrivateRoute>
      },
      {
        path: '/my-recommendations',
        element: <PrivateRoute><LazyWrapper><MyRecommendations /></LazyWrapper></PrivateRoute>
      },
      {
        path: '/recommendations-for-me',
        element: <PrivateRoute><LazyWrapper><RecommendationsForMe /></LazyWrapper></PrivateRoute>
      },


      {
        path: '*',
        element: <LazyWrapper><NotFound /></LazyWrapper>
      }
    ]
  }
]);

export default router;
