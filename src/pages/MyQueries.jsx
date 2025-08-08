import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import api from '../utils/api';

dayjs.extend(relativeTime);

const MyQueries = () => {
  const { user } = useAuth();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's queries
  useEffect(() => {
    const fetchMyQueries = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const response = await api.get('/queries');
        // Filter queries for the current user
        const userQueries = response.data.filter(query => query.userEmail === user.email);
        setQueries(userQueries);
      } catch (error) {
        console.error('Error fetching my queries:', error);
        toast.error('Failed to load your queries');
      } finally {
        setLoading(false);
      }
    };

    fetchMyQueries();
  }, [user]);

  // Handle query deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this query?')) {
      try {
        await api.delete(`/queries/${id}`);
        setQueries(queries.filter(query => query._id !== id));
        toast.success('Query deleted successfully');
      } catch (error) {
        console.error('Error deleting query:', error);
        toast.error('Failed to delete query');
      }
    }
  };

  return (
    <div className="page-container">
      {/* Banner */}
      <div className="bg-primary text-white p-8 rounded-lg mb-8 flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Queries</h1>
          <p className="text-white/90">
            Manage your product queries and see recommendations
          </p>
        </div>
        <Link to="/add-query" className="btn bg-white text-primary hover:bg-white/90 mt-4 md:mt-0">
          Add New Query
        </Link>
      </div>

      {/* Queries List */}
      {loading ? (
        <div className="flex justify-center items-center h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : queries.length > 0 ? (
        <div className="grid gap-6">
          {queries.map((query) => (
            <div key={query._id} className="card">
              <div className="card-body p-0">
                <div className="grid grid-cols-1 md:grid-cols-4">
                  <div className="md:col-span-1">
                    <img
                      src={query.productImage}
                      alt={query.productName}
                      className="w-full h-full object-cover rounded-l-lg"
                    />
                  </div>
                  <div className="p-4 md:col-span-3">
                    <h2 className="card-title">{query.queryTitle}</h2>
                    <p className="text-sm text-slate-600 mb-2">
                      <span className="font-medium text-slate-800">Product:</span> {query.productName} by {query.productBrand}
                    </p>
                    <p className="text-sm text-slate-600 mb-4">
                      <span className="font-medium text-slate-800">Posted:</span> {dayjs(query.createdAt).fromNow()}
                    </p>

                    <p className="mb-4 text-slate-600">
                      <span className="font-medium text-slate-800">Boycott Reason:</span> {query.boycottReason.length > 100
                        ? `${query.boycottReason.substring(0, 100)}...`
                        : query.boycottReason
                      }
                    </p>

                    <div className="card-actions justify-between items-center">
                      <div className="badge badge-primary text-white">{query.recommendationCount} recommendations</div>
                      <div className="flex gap-2">
                        <Link to={`/queries/${query._id}`} className="btn btn-sm btn-outline text-slate-700 border-slate-300 hover:bg-slate-100">
                          View Details
                        </Link>
                        <Link to={`/update-query/${query._id}`} className="btn btn-sm btn-info text-white">
                          Update
                        </Link>
                        <button
                          onClick={() => handleDelete(query._id)}
                          className="btn btn-sm btn-error text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-base-200 rounded-lg">
          <p className="text-xl mb-4">You haven't added any queries yet</p>
          <Link to="/add-query" className="btn btn-primary text-white">
            Add Your First Query
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyQueries;
