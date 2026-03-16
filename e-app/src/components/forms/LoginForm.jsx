import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login, error, user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(form)) {
      navigate(`/dashboard/${user.role}`);
    }
  };

  return (
    <form className="card p-4 shadow" onSubmit={handleSubmit}>
      <h3>Login</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <input className="form-control mt-2" placeholder="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} required />

      <input className="form-control mt-2" placeholder="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })} required />

      <button className="btn btn-success mt-3 w-100">Login</button>
    </form>
  );
}