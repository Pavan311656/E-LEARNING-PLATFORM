import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" to="/">E-Learn</Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">

            {!isAuthenticated && (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/signup">Signup</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/login">Login</NavLink></li>
              </>
            )}

            {isAuthenticated && (
              <li className="nav-item">
                <NavLink className="nav-link" to={`/dashboard/${user.role}`}>
                  {user.role} Dashboard
                </NavLink>
              </li>
            )}

          </ul>

          {isAuthenticated && (
            <button className="btn btn-outline-light btn-sm" onClick={logout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}