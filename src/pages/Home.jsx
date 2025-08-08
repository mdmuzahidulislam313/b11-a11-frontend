import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import QueryCard from '../components/shared/QueryCard';
import { useAuth } from '../context/AuthProvider';

const Home = () => {
  const recentQueries = useLoaderData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleRecommendClick = (queryId) => {
    if (user) {
      navigate(`/queries/${queryId}`);
    } else {
      navigate('/register');
    }
  };

  const handleAddQueryClick = () => {
    if (user) {
      navigate('/add-query');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="page-container">
      <div className="bg-primary text-white py-16 mb-12 rounded-lg">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Product Recommendation Platform</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Find product alternatives through community recommendations. Ask for suggestions or help others discover better options.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/queries" className="btn btn-accent">Browse Queries</Link>
            <button onClick={handleAddQueryClick} className="btn btn-outline btn-accent">
              {user ? 'Add Query' : 'Sign Up to Add Query'}
            </button>
          </div>
        </div>
      </div>

      <section className="mb-16">
        <h2 className="section-title">Recent Queries</h2>

        {recentQueries && recentQueries.length > 0 ? (
          <div className="responsive-grid">
            {recentQueries.map((query) => (
              <QueryCard
                key={query._id}
                query={query}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-base-200 rounded-lg">
            <p className="text-xl">No queries available yet. Be the first to add one!</p>
            <button onClick={handleAddQueryClick} className="btn btn-primary text-white mt-4">
              {user ? 'Add Query' : 'Sign Up to Add Query'}
            </button>
          </div>
        )}

        <div className="text-center mt-8">
          <Link to="/queries" className="btn text-white btn-primary">
            View All Queries
          </Link>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="section-title">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="card-body">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="card-title text-center">Post Query</h3>
              <p className="text-slate-600">Ask the community for product alternatives and explain your requirements.</p>
            </div>
          </div>

          <div className="card text-center">
            <div className="card-body">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="card-title text-center">Get Recommendations</h3>
              <p className="text-slate-600">Receive suggestions from other users who know alternative products.</p>
            </div>
          </div>

          <div className="card text-center">
            <div className="card-body">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="card-title text-center">Make Decision</h3>
              <p className="text-slate-600">Choose from recommended alternatives that meet your criteria.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="card">
          <div className="card-body text-center">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Join Our Community</h2>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Connect with others who share similar values and help build a database of product alternatives.
            </p>
            {user ? (
              <Link to="/add-query" className="btn btn-primary text-white">
                Start Contributing
              </Link>
            ) : (
              <Link to="/register" className="btn btn-primary text-white">
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
