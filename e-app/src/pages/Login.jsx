import Navbar from "../components/layout/Navbar";
import LoginForm from "../components/forms/LoginForm";

export default function Login() {
  return (
    <>
      <Navbar />
      <div className="container mt-5" style={{ maxWidth: '400px' }}>
        <LoginForm />
      </div>
    </>
  );
}