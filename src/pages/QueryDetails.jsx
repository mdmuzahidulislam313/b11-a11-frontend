import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useLoaderData, useNavigate } from 'react-router-dom';
import OptimizedImage from '../components/shared/OptimizedImage';
import { useAuth } from '../context/AuthProvider';
import api from '../utils/api';

dayjs.extend(relativeTime);

const QueryDetails = () => {
  const { query, recommendations } = useLoaderData();
  const [localQuery, setLocalQuery] = useState(query);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [recommendationsList, setRecommendationsList] = useState(recommendations);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  // Handle form submission for adding a recommendation
  const onSubmit = async (data) => {
    if (!user) {
      toast.error('Please sign up to add recommendations');
      navigate('/register');
      return;
    }

    setLoading(true);
    try {
      const recommendationData = {
        queryId: localQuery._id,
        queryTitle: localQuery.queryTitle,
        productName: localQuery.productName,
        userEmail: localQuery.userEmail,
        userName: localQuery.userName,
        recommenderName: user.displayName,
        recommendedTitle: data.recommendedTitle,
        recommendedProductName: data.recommendedProductName,
        recommendedProductImage: data.recommendedProductImage,
        recommendationReason: data.recommendationReason,
      };

      const response = await api.post('/recommendations', recommendationData);

      // Add the new recommendation to the list
      setRecommendationsList([response.data, ...recommendationsList]);
      setLocalQuery({ ...localQuery, recommendationCount: (localQuery.recommendationCount || 0) + 1 });

      // Reset the form
      reset();

      toast.success('Recommendation added successfully!');
    } catch (error) {
      console.error('Error adding recommendation:', error);
      toast.error(error.response?.data?.message || 'Failed to add recommendation');
    } finally {
      setLoading(false);
    }
  };

  // If query is not found, show error message
  if (!localQuery) {
    return (
      <div className="page-container">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Query not found!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="card shadow-lg mb-8">
        <div className="md:flex">
          <figure className="md:w-1/3">
            <OptimizedImage
              src={localQuery.productImage}
              alt={localQuery.productName}
              className="w-full h-full"
            />
          </figure>
          <div className="card-body md:w-2/3">
            <h1 className="card-title text-2xl">{localQuery.queryTitle}</h1>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
              <p className="text-lg">
                <span className="font-semibold text-slate-800">Product:</span> <span className="text-slate-700">{localQuery.productName} by {localQuery.productBrand}</span>
              </p>
              <div className="badge badge-primary text-white">{localQuery.recommendationCount} recommendations</div>
            </div>

            <div className="divider my-1"></div>

            <h3 className="font-semibold text-slate-800">Reason for Boycotting:</h3>
            <p className="text-slate-600">{localQuery.boycottReason}</p>

            <div className="flex items-center gap-3 mt-4">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <OptimizedImage
                    src={localQuery.userPhoto || 'https://i.ibb.co/M6tBqSs/profile.png'}
                    alt={localQuery.userName}
                    className="w-full h-full"
                  />
                </div>
              </div>
              <div>
                <p className="font-medium text-slate-800">{localQuery.userName}</p>
                <p className="text-xs text-slate-500">Posted {dayjs(localQuery.createdAt).fromNow()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-lg mb-8">
        <div className="card-body">
          {user ? (
            <>
              <h2 className="card-title">Recommend an Alternative</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="form-label" htmlFor="recommendedTitle">
                      Recommendation Title
                    </label>
                    <input
                      type="text"
                      id="recommendedTitle"
                      className="form-input"
                      placeholder="E.g., Great eco-friendly alternative"
                      {...register('recommendedTitle', {
                        required: 'Title is required',
                        minLength: {
                          value: 5,
                          message: 'Title must be at least 5 characters'
                        }
                      })}
                    />
                    {errors.recommendedTitle && (
                      <p className="form-error">{errors.recommendedTitle.message}</p>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="form-label" htmlFor="recommendedProductName">
                      Recommended Product Name
                    </label>
                    <input
                      type="text"
                      id="recommendedProductName"
                      className="form-input"
                      placeholder="Enter product name"
                      {...register('recommendedProductName', {
                        required: 'Product name is required',
                        minLength: {
                          value: 2,
                          message: 'Product name must be at least 2 characters'
                        }
                      })}
                    />
                    {errors.recommendedProductName && (
                      <p className="form-error">{errors.recommendedProductName.message}</p>
                    )}
                  </div>
                </div>

                <div className="form-control">
                  <label className="form-label" htmlFor="recommendedProductImage">
                    Recommended Product Image URL
                  </label>
                  <input
                    type="text"
                    id="recommendedProductImage"
                    className="form-input"
                    placeholder="Enter image URL"
                    {...register('recommendedProductImage', {
                      required: 'Image URL is required',
                      pattern: {
                        value: /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/[\w.-]*)*\/?(\?.*)?$/i,
                        message: 'Enter a valid URL'
                      }
                    })}
                  />
                  {errors.recommendedProductImage && (
                    <p className="form-error">{errors.recommendedProductImage.message}</p>
                  )}
                </div>

                <div className="form-control">
                  <label className="form-label" htmlFor="recommendationReason">
                    Why do you recommend this product?
                  </label>
                  <textarea
                    id="recommendationReason"
                    className="form-input min-h-[100px]"
                    placeholder="Explain why this is a good alternative..."
                    {...register('recommendationReason', {
                      required: 'Reason is required',
                      minLength: {
                        value: 20,
                        message: 'Reason must be at least 20 characters'
                      }
                    })}
                  />
                  {errors.recommendationReason && (
                    <p className="form-error">{errors.recommendationReason.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    'Add Recommendation'
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <h2 className="card-title mb-4">Want to Recommend an Alternative?</h2>
              <p className="text-slate-600 mb-6">
                Join our community to help others find better product alternatives! Share your recommendations and connect with like-minded consumers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/register')}
                  className="btn btn-primary text-white"
                >
                  Sign Up to Recommend
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="btn btn-outline btn-primary"
                >
                  Already have an account?
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations List */}
      <div className="mb-8">
        <h2 className="section-title">Recommendations</h2>

        {recommendationsList.length > 0 ? (
          <div className="space-y-6">
            {recommendationsList.map((recommendation) => (
              <div key={recommendation._id} className="card shadow-md">
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <h3 className="card-title">{recommendation.recommendedTitle}</h3>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <OptimizedImage
                            src={user?.photoURL || 'https://i.ibb.co/M6tBqSs/profile.png'}
                            alt={recommendation.recommenderName}
                            className="w-full h-full"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-slate-800">{recommendation.recommenderName}</p>
                        <p className="text-xs text-slate-500">{dayjs(recommendation.createdAt).fromNow()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 mt-4">
                    <div className="md:w-1/4">
                      <OptimizedImage
                        src={recommendation.recommendedProductImage}
                        alt={recommendation.recommendedProductName}
                        className="w-full h-auto rounded-lg"
                      />
                    </div>
                    <div className="md:w-3/4">
                      <h4 className="font-semibold text-lg text-slate-800">{recommendation.recommendedProductName}</h4>
                      <p className="mt-2 text-slate-600">{recommendation.recommendationReason}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-base-200 rounded-lg">
            <p className="text-xl">No recommendations yet. Be the first to recommend an alternative!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryDetails;
