import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import api from '../utils/api';

const UpdateQuery = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [query, setQuery] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  // Fetch the query data
  useEffect(() => {
    const fetchQuery = async () => {
      try {
        const response = await api.get(`/queries/${id}`);
        const queryData = response.data;

        // Check if the query belongs to the current user
        if (queryData.userEmail !== user.email) {
          toast.error('You are not authorized to edit this query');
          navigate('/my-queries');
          return;
        }

        setQuery(queryData);

        // Set default values for the form
        reset({
          queryTitle: queryData.queryTitle,
          productName: queryData.productName,
          productBrand: queryData.productBrand,
          productImage: queryData.productImage,
          boycottReason: queryData.boycottReason
        });
      } catch (error) {
        console.error('Error fetching query:', error);
        toast.error('Failed to load query');
        navigate('/my-queries');
      } finally {
        setLoading(false);
      }
    };

    fetchQuery();
  }, [id, user, navigate, reset]);

  const onSubmit = async (data) => {
    setSubmitting(true);

    try {
      // Send the updated data to the server
      await api.put(`/queries/${id}`, data);

      toast.success('Query updated successfully!');
      navigate('/my-queries');
    } catch (error) {
      console.error('Error updating query:', error);
      toast.error(error.response?.data?.message || 'Failed to update query');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex justify-center items-center h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold text-center mb-8 text-slate-800">Update Query</h1>

      <div className="card shadow-lg max-w-2xl mx-auto">
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="form-label" htmlFor="queryTitle">
                Query Title
              </label>
              <input
                type="text"
                id="queryTitle"
                className="form-input"
                placeholder="E.g., Looking for alternatives to XYZ product"
                {...register('queryTitle', {
                  required: 'Title is required',
                  minLength: {
                    value: 10,
                    message: 'Title must be at least 10 characters'
                  }
                })}
              />
              {errors.queryTitle && (
                <p className="form-error">{errors.queryTitle.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="form-label" htmlFor="productName">
                  Product Name
                </label>
                <input
                  type="text"
                  id="productName"
                  className="form-input"
                  placeholder="Enter product name"
                  {...register('productName', {
                    required: 'Product name is required',
                    minLength: {
                      value: 2,
                      message: 'Product name must be at least 2 characters'
                    }
                  })}
                />
                {errors.productName && (
                  <p className="form-error">{errors.productName.message}</p>
                )}
              </div>

              <div className="form-control">
                <label className="form-label" htmlFor="productBrand">
                  Product Brand
                </label>
                <input
                  type="text"
                  id="productBrand"
                  className="form-input"
                  placeholder="Enter brand name"
                  {...register('productBrand', {
                    required: 'Brand name is required',
                    minLength: {
                      value: 2,
                      message: 'Brand name must be at least 2 characters'
                    }
                  })}
                />
                {errors.productBrand && (
                  <p className="form-error">{errors.productBrand.message}</p>
                )}
              </div>
            </div>

            <div className="form-control">
              <label className="form-label" htmlFor="productImage">
                Product Image URL
              </label>
              <input
                type="text"
                id="productImage"
                className="form-input"
                placeholder="Enter image URL"
                {...register('productImage', {
                  required: 'Image URL is required',
                  pattern: {
                    value: /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/[\w.-]*)*\/?(\?.*)?$/i,
                    message: 'Enter a valid URL'
                  }
                })}
              />
              {errors.productImage && (
                <p className="form-error">{errors.productImage.message}</p>
              )}
            </div>

            <div className="form-control">
              <label className="form-label" htmlFor="boycottReason">
                Reason for Boycotting
              </label>
              <textarea
                id="boycottReason"
                className="form-input min-h-[150px]"
                placeholder="Explain why you want to boycott this product..."
                {...register('boycottReason', {
                  required: 'Reason is required',
                  minLength: {
                    value: 20,
                    message: 'Reason must be at least 20 characters'
                  }
                })}
              />
              {errors.boycottReason && (
                <p className="form-error">{errors.boycottReason.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate('/my-queries')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary text-white"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  'Update Query'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateQuery;
