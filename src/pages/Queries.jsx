import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import QueryCard from '../components/shared/QueryCard';
import { useAuth } from '../context/AuthProvider';
import { publicApi } from '../utils/api';

const Queries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [layoutColumns, setLayoutColumns] = useState(3);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddQueryClick = () => {
    if (user) {
      navigate('/add-query');
    } else {
      navigate('/register');
    }
  };


  const searchQuery = searchParams.get('search') || '';


  useEffect(() => {
    const fetchQueries = async () => {
      setLoading(true);
      try {
        const response = await publicApi.get(`/queries${searchQuery ? `?search=${searchQuery}` : ''}`);
        setQueries(response.data);
      } catch (error) {
        console.error('Error fetching queries:', error);
      } finally {
        setLoading(false);
      }
    };


    const timer = setTimeout(() => {
      fetchQueries();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);


  const handleSearch = (e) => {
    const value = e.target.value;
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  };


  const handleLayoutToggle = (columns) => {
    setLayoutColumns(columns);
  };

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold mb-8 text-center">Product Queries</h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="form-control w-full md:w-96">
          <div className="input-group">
            <input
              type="text"
              placeholder="Search by product name..."
              className="input input-bordered w-full"
              value={searchQuery}
              onChange={handleSearch}
            />
            <button className="btn btn-square btn-primary text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <span className="self-center mr-2">Layout:</span>
          <button
            className={`btn btn-sm ${layoutColumns === 1 ? 'btn-primary text-white' : 'btn-outline'}`}
            onClick={() => handleLayoutToggle(1)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5" />
            </svg>
          </button>
          <button
            className={`btn btn-sm ${layoutColumns === 2 ? 'btn-primary text-white' : 'btn-outline'}`}
            onClick={() => handleLayoutToggle(2)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <button
            className={`btn btn-sm ${layoutColumns === 3 ? 'btn-primary text-white' : 'btn-outline'}`}
            onClick={() => handleLayoutToggle(3)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
            </svg>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : queries.length > 0 ? (
        <div className={`grid grid-cols-1 ${layoutColumns === 2 ? 'md:grid-cols-2' :
          layoutColumns === 3 ? 'md:grid-cols-2 lg:grid-cols-3' : ''
          } gap-6`}>
          {queries.map((query) => (
            <QueryCard key={query._id} query={query} />
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-base-200 rounded-lg">
          <p className="text-xl">
            {searchQuery
              ? `No queries found matching "${searchQuery}"`
              : 'No queries available yet'
            }
          </p>
          <button onClick={handleAddQueryClick} className="btn btn-primary text-white mt-4">
            {user ? 'Add Query' : 'Sign Up to Add Query'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Queries;
