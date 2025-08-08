import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = user ? (
    <>
      <li><NavLink to="/" className={({ isActive }) => isActive ? 'text-primary font-medium' : 'text-gray-300 hover:text-white'}>Home</NavLink></li>
      <li><NavLink to="/queries" className={({ isActive }) => isActive ? 'text-primary font-medium' : 'text-gray-300 hover:text-white'}>Queries</NavLink></li>
      <li><NavLink to="/recommendations-for-me" className={({ isActive }) => isActive ? 'text-primary font-medium' : 'text-gray-300 hover:text-white'}>For Me</NavLink></li>
      <li><NavLink to="/my-queries" className={({ isActive }) => isActive ? 'text-primary font-medium' : 'text-gray-300 hover:text-white'}>My Queries</NavLink></li>
      <li><NavLink to="/my-recommendations" className={({ isActive }) => isActive ? 'text-primary font-medium' : 'text-gray-300 hover:text-white'}>My Recommendations</NavLink></li>
    </>
  ) : (
    <>
      <li><NavLink to="/" className={({ isActive }) => isActive ? 'text-primary font-medium' : 'text-gray-300 hover:text-white'}>Home</NavLink></li>
      <li><NavLink to="/queries" className={({ isActive }) => isActive ? 'text-primary font-medium' : 'text-gray-300 hover:text-white'}>Queries</NavLink></li>
      <li><NavLink to="/login" className={({ isActive }) => isActive ? 'text-primary font-medium' : 'text-gray-300 hover:text-white'}>Login</NavLink></li>
    </>
  );

  return (
    <header className="bg-slate-800 shadow-lg border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="navbar min-h-16">
          <div className="navbar-start">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow bg-slate-800 rounded-lg w-52 border border-slate-700">
                {navLinks}
              </ul>
            </div>
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
              <div className="text-xl font-bold text-white">
                Product Recommendations
              </div>
            </Link>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 gap-1">
              {navLinks}
            </ul>
          </div>
          <div className="navbar-end gap-2">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-300">
                  <span>Welcome, {user.displayName?.split(' ')[0] || 'User'}</span>
                  <div className="avatar">
                    <div className="w-8 rounded-full ring-2 ring-primary">
                      <img src={user.photoURL || 'https://i.ibb.co/M6tBqSs/profile.png'} alt="Profile" />
                    </div>
                  </div>
                </div>
                <button onClick={handleLogout} className="btn btn-sm btn-outline btn-error text-white border-red-500 hover:bg-red-500">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm btn-ghost text-white hover:bg-slate-700">Login</Link>
                <Link to="/register" className="btn btn-sm btn-primary text-white">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
