import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import api from '../utils/api';

const AddQuery = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // Prepare the query data
      const queryData = {
        ...data,
        userName: user.displayName,
        userPhoto: user.photoURL,
      };

      // Send the query data to the server
      await api.post('/queries', queryData);

      toast.success('Query added successfully!');
      navigate('/my-queries');
    } catch (error) {
      console.error('Error adding query:', error);
      toast.error(error.response?.data?.message || 'Failed to add query');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="text-3xl font-bold text-center mb-8 text-slate-800">Add New Query</h1>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="form-control">
            <label className="form-label" htmlFor="queryTitle">
              Query Title
            </label>
            <input
              type="text"
              id="queryTitle"
              className="form-input"
              placeholder="Describe what you're looking for"
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
              Requirements/Reason
            </label>
            <textarea
              id="boycottReason"
              className="form-input min-h-[150px]"
              placeholder="Explain your requirements or reasons for seeking alternatives..."
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
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'Add Query'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuery;
