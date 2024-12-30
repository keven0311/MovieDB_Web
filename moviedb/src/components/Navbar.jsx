import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css'; 
import logo from '../assets/moviedb_logo.svg'
import { useEffect } from 'react';

const Navbar = ({ user, setUser}) => {
  
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')))
  },[])
  
  const handleLogout = () => {
    localStorage.setItem('user',null);
    setUser(null);
  }

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={logo} alt="MovieDB Logo" className="logo" />
      </div>
      <ul className="nav-bar">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'tab-item active' : 'tab-item')}
          >
            HOME
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/liked"
            className={({ isActive }) => (isActive ? 'tab-item active' : 'tab-item')}
          >
            LIKED
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/rated"
            className={({ isActive }) => (isActive ? 'tab-item active' : 'tab-item')}
          >
            RATED
          </NavLink>
        </li>
      </ul>
      {
        user?.username 
        ? (
        <div className='login-username'>
          {user.username}
          <button className='logout-btn' onClick={handleLogout}>Logout</button>
        </div>
        )
        : (
        <div>
          <NavLink
                to="/login"
                className={({ isActive }) => (isActive ? 'tab-item tab-item-login active' : 'tab-item tab-item-login')}
                >
                Login
          </NavLink>
        </div>
        )
      }
    </nav>
  );
};

export default Navbar;
