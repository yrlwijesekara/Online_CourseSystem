import React, { useState } from 'react'

const SignInPage = ({ navigateTo }) => {
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store the token and user data in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      console.log('Login successful:', data.user);

      // Check if there's a redirect destination after login
      const redirectPage = localStorage.getItem('redirectAfterLogin');
      const redirectParams = localStorage.getItem('redirectParams');
      
      if (redirectPage) {
        // Clear the redirect info
        localStorage.removeItem('redirectAfterLogin');
        
        // Handle any params needed for the redirect
        let params = {};
        if (redirectParams) {
          try {
            params = JSON.parse(redirectParams);
            localStorage.removeItem('redirectParams');
          } catch (e) {
            console.error('Error parsing redirect params:', e);
          }
        }
        
        // Navigate to the stored redirect page
        console.log(`Redirecting to ${redirectPage} after login`);
        navigateTo(redirectPage, params);
      } else {
        // No redirect found, navigate based on user role
        if (data.user.role === 'ADMIN') {
          navigateTo('admin');
        } else {
          navigateTo('home');
        }
      }

    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 md:p-10 bg-gradient-to-r from-cyan-100 to-pink-100" style={{background: 'linear-gradient(to right, #d6f1f6, #f6d6f3)'}}>
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-6 md:p-10">
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
