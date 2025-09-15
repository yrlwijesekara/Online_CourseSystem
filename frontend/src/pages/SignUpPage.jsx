import React from 'react'

const SignUpPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-10">
          <h1 className="text-3xl font-bold mb-2">Sign Up</h1>
          <p className="text-gray-600 mb-8">
            Please register to continue to your account.
          </p>

          <form className="space-y-5">
            <div>
              <label className="block mb-1 text-gray-700">First name</label>
              <input
                type="text"
                placeholder="Didul"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700">Last name</label>
              <input
                type="text"
                placeholder="Adeesha"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700">Email</label>
              <input
                type="email"
                placeholder="adeeshadidul@gmail.com"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex items-center">
              <input type="checkbox" className="mr-2" />
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
            Have an account? <a href="#" className="text-blue-500">Log In</a>
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
