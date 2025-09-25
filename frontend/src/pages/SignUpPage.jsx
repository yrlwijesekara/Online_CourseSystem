import React, { useState } from 'react'

const SignUpPage = ({ navigateTo }) => {
  // State for form inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store the token and user data in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      console.log('Registration successful:', data.user);
      
      // Navigate to home page after successful registration
      navigateTo('home');

    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'An error occurred during registration. Please try again.');
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 md:p-10 bg-gradient-to-r from-cyan-100 to-pink-100" style={{background: 'linear-gradient(to right, #d6f1f6, #f6d6f3)'}}>
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-6 md:p-10">
          <h1 className="text-3xl font-bold mb-2">Sign Up</h1>
          <p className="text-gray-600 mb-8">
            Please register to continue to your account.
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-gray-700">First name</label>
              <input
                type="text"
                placeholder="Didul"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700">Last name</label>
              <input
                type="text"
                placeholder="Adeesha"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700">Email</label>
              <input
                type="email"
                placeholder="adeeshadidul@gmail.com"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center">
              <input 
                type="checkbox" 
                className="mr-2" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="text-gray-600">Keep me logged in</span>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Sign Up
            </button>

            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-2 text-gray-500">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border py-2 rounded-lg hover:bg-gray-50 transition"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Sign in with Google
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-5">
            Have an account? <a href="#" className="text-blue-500 hover:underline" onClick={(e) => {
              e.preventDefault();
              navigateTo('signin');
            }}>Log In</a>
          </p>
        </div>

        {/* Right Side - Image */}
        <div className="hidden md:block w-1/2">
          <img
            src="/signInUp/signup.jpg"
            alt="Sign up"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default SignUpPage
