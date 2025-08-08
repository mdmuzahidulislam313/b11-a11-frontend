import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import api from '../utils/api';

dayjs.extend(relativeTime);

const RecommendationsForMe = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch recommendations for the user's queries
  useEffect(() => {
    const fetchRecommendationsForMe = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const response = await api.get('/recommendations/for-me');
        setRecommendations(response.data);
      } catch (error) {
        console.error('Error fetching recommendations for me:', error);
        toast.error('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendationsForMe();
  }, [user]);

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold text-center mb-8 text-slate-800">Recommendations For My Queries</h1>

      {loading ? (
        <div className="flex justify-center items-center h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid gap-6">
          {recommendations.map((recommendation) => (
            <div key={recommendation._id} className="card shadow-lg">
              <div className="card-body">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <h2 className="card-title">
                      <Link to={`/queries/${recommendation.queryId}`} className="hover:text-primary">
                        {recommendation.recommendedTitle}
                      </Link>
                    </h2>
                    <p className="text-sm text-slate-600">
                      Recommended for your query: <span className="font-medium text-slate-800">{recommendation.queryTitle}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-10 rounded-full">
                        <img src="https://i.ibb.co/M6tBqSs/profile.png" alt={recommendation.recommenderName} />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{recommendation.recommenderName}</p>
                      <p className="text-xs text-slate-500">{dayjs(recommendation.createdAt).fromNow()}</p>
                    </div>
                  </div>
                </div>

                <div className="divider my-2"></div>

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4">
                    <img
                      src={recommendation.recommendedProductImage}
                      alt={recommendation.recommendedProductName}
                      className="w-full h-auto object-cover rounded-lg"
                    />
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="font-semibold text-lg text-slate-800">{recommendation.recommendedProductName}</h3>
                    <p className="mt-2 text-slate-600">{recommendation.recommendationReason}</p>
                  </div>
                </div>

                <div className="card-actions justify-end mt-4">
                  <Link to={`/queries/${recommendation.queryId}`} className="btn btn-primary text-white">
                    View Full Query
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-slate-50 rounded-lg">
          <p className="text-xl mb-4 text-slate-800">You haven't received any recommendations yet</p>
          <p className="text-slate-600 mb-6">
            Others will recommend alternatives when they see your queries. Make sure you have some queries posted!
          </p>
          <Link to="/add-query" className="btn btn-primary text-white">
            Add a Query
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecommendationsForMe;
