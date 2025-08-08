import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import api from '../utils/api';

dayjs.extend(relativeTime);

const MyRecommendations = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's recommendations
  useEffect(() => {
    const fetchMyRecommendations = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const response = await api.get('/recommendations/my');
        setRecommendations(response.data);
      } catch (error) {
        console.error('Error fetching my recommendations:', error);
        toast.error('Failed to load your recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchMyRecommendations();
  }, [user]);

  // Handle recommendation deletion
  const handleDelete = async (id, queryId) => {
    if (window.confirm('Are you sure you want to delete this recommendation?')) {
      try {
        await api.delete(`/recommendations/${id}`);
        setRecommendations(recommendations.filter(rec => rec._id !== id));
        toast.success('Recommendation deleted successfully');
      } catch (error) {
        console.error('Error deleting recommendation:', error);
        toast.error('Failed to delete recommendation');
      }
    }
  };

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold text-center mb-8 text-slate-800">My Recommendations</h1>

      {loading ? (
        <div className="flex justify-center items-center h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200">
                <th>Recommendation</th>
                <th>Query</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map((recommendation) => (
                <tr key={recommendation._id} className="hover">
                  <td>
                    <div className="flex items-start gap-3">
                      <div className="avatar">
                        <div className="w-16 rounded">
                          <img
                            src={recommendation.recommendedProductImage}
                            alt={recommendation.recommendedProductName}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{recommendation.recommendedTitle}</div>
                        <div className="text-sm opacity-70">{recommendation.recommendedProductName}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Link to={`/queries/${recommendation.queryId}`} className="font-medium text-primary hover:underline">
                      {recommendation.queryTitle}
                    </Link>
                    <div className="text-xs opacity-70">{recommendation.productName}</div>
                  </td>
                  <td>{dayjs(recommendation.createdAt).format('MMM D, YYYY')}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(recommendation._id, recommendation.queryId)}
                      className="btn btn-sm btn-error text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-8 bg-base-200 rounded-lg">
          <p className="text-xl mb-4">You haven't made any recommendations yet</p>
          <Link to="/queries" className="btn btn-primary text-white">
            Browse Queries
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyRecommendations;
