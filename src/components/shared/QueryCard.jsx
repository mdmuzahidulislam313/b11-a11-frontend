import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import OptimizedImage from './OptimizedImage';

dayjs.extend(relativeTime);

const QueryCard = memo(({ query, onRecommendClick }) => {
    const { user } = useAuth();

    return (
        <div className="card bg-white shadow-lg hover:shadow-xl transition-shadow">
            <figure className="h-48 sm:h-52 md:h-56">
                <OptimizedImage
                    src={query.productImage}
                    alt={query.productName}
                    className="w-full h-full"
                />
            </figure>
            <div className="card-body p-4 sm:p-6">
                <h3 className="card-title text-base sm:text-lg leading-snug">{query.queryTitle}</h3>
                <p className="text-xs sm:text-sm text-slate-600">
                    Product: <span className="font-medium text-slate-800">{query.productName}</span> by {query.productBrand}
                </p>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 gap-2">
                    <div className="flex items-center gap-2">
                        <div className="avatar">
                            <div className="w-6 sm:w-8 rounded-full">
                                <OptimizedImage
                                    src={query.userPhoto || 'https://i.ibb.co/M6tBqSs/profile.png'}
                                    alt={query.userName}
                                    className="w-full h-full"
                                />
                            </div>
                        </div>
                        <span className="text-xs sm:text-sm text-slate-700">{query.userName}</span>
                    </div>
                    <span className="text-xs text-slate-500">{dayjs(query.createdAt).fromNow()}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 gap-2">
                    <div className="badge badge-primary text-white text-xs sm:text-sm">{query.recommendationCount} recommendations</div>
                    {onRecommendClick ? (
                        <button
                            onClick={() => onRecommendClick(query._id)}
                            className="btn btn-sm sm:btn-md btn-primary text-white w-full sm:w-auto"
                        >
                            {user ? 'Recommend' : 'Sign Up to Recommend'}
                        </button>
                    ) : (
                        <Link to={`/queries/${query._id}`} className="btn btn-sm sm:btn-md btn-primary text-white w-full sm:w-auto">
                            View Details
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
});

QueryCard.displayName = 'QueryCard';

export default QueryCard;
