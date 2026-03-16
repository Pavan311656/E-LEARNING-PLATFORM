import Navbar from "../components/layout/Navbar";
import SignupForm from "../components/forms/SignupForm";

export default function Signup() {
  return (
    <>
      <Navbar />
      <div className="container mt-5" style={{ maxWidth: '400px' }}>
        <SignupForm />
      </div>
    </>
  );
}