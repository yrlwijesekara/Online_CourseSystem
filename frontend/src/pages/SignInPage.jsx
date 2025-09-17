import React, { useState } from 'react'

const SignInPage = ({ navigateTo }) => {
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    // For demonstration purposes, accept any valid-looking email and password
    if (email.includes('@') && password.length >= 6) {
      // In a real app, you would authenticate with a server here
      console.log('Logging in with:', { email, password, rememberMe });
      
      // Navigate to home page after successful login
      navigateTo('home');
    } else {
      setError('Invalid email or password. Password must be at least 6 characters.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-10 "> {/*bg-gradient-to-r from-blue-50 to-pink-50*/}
      <div className="flex w-full h-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden p-0 md:p-10">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-10">
          <h1 className="text-3xl font-bold mb-2">Sign in</h1>
          <p className="text-gray-600 mb-8">
            Please login to continue to your account.
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
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
              Sign in
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
            Need an account? <a href="#" className="text-blue-500 hover:underline" onClick={(e) => {
              e.preventDefault();
              navigateTo('signup');
            }}>Create one</a>
          </p>
        </div>

        {/* Right Side - Image */}
        <div className="hidden md:block w-1/2">
          <img
            src="/signInUp/signin.jpg"
            alt="Sign in"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
