import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function SignupForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student", id: Date.now(), verified: true });
  const navigate = useNavigate();
  const { signup, error } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (signup(form)) {
      navigate(`/dashboard/${form.role}`);
    }
  };

  return (
    <form className="card p-4 shadow" onSubmit={handleSubmit}>
      <h3>Signup</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <input className="form-control mt-2" placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })} required />

      <input className="form-control mt-2" placeholder="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} required />

      <input className="form-control mt-2" placeholder="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })} required />

      <select className="form-control mt-2"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="student">Student</option>
        <option value="instructor">Instructor</option>
        <option value="admin">Admin</option>
      </select>

      <button className="btn btn-primary mt-3 w-100">Signup</button>
    </form>
  );
}