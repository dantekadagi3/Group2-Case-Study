import Link from "next/link";

export default function LoginPage() {
  return (
    <section className="min-h-screen flex">
      {/* Left Section */}
      <div
        className="hidden md:flex w-1/2 items-end justify-end bg-center bg-cover bg-no-repeat relative"
        style={{
          background: `linear-gradient(rgba(26, 31, 54, 0.8), rgba(26, 31, 54, 0.8)),
            url("/loginImage.jpeg")`,
        }}
      >
        {/* Glassmorphic Card */}
           <div className="m-6 w-3/4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg text-white p-8">
          <h2 className="text-2xl font-bold mb-3">
            Welcome back to bookstore!
          </h2>
          <p className="text-gray-200 text-sm">
            Log in to continue your reading journey or sign up if you’re new
            here.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 bg-[#0F172A] flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-[#1E293B] p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Login to Your Account
          </h2>

          <form className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full p-3 mt-1 rounded-md bg-[#0F172A] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="w-full p-3 mt-1 rounded-md bg-[#0F172A] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>


           <Link href="/">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600 transition duration-300"
            >
              Log In
            </button>
            </Link>

            <p className="text-center text-sm text-gray-400 mt-4">
              Don’t have an account?{" "}
              <a
                href="/signup"
                className="text-blue-400 hover:underline font-medium"
              >
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
