const About = () => {
  return (
    <div className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
            About CarRental
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Revolutionizing car rentals with seamless booking, premium vehicles, 
            and unmatched customer service across 50+ cities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              To make premium car rentals accessible to everyone, everywhere. 
              We connect trusted partners with travelers through our intuitive platform, 
              ensuring the best cars at the best prices with zero hassle.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mx-auto"></div>
                <p className="font-medium text-gray-900">10K+</p>
                <p className="text-sm text-gray-600">Happy customers</p>
              </div>
              <div className="space-y-2">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mx-auto"></div>
                <p className="font-medium text-gray-900">500+</p>
                <p className="text-sm text-gray-600">Partner hosts</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl p-12 backdrop-blur-xl border border-white/20">
              <svg className="w-64 h-64 mx-auto opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-16 mb-20">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join our platform today and experience the future of car rentals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/cars" className="bg-white text-blue-600 font-bold py-4 px-8 rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                Browse Cars
              </a>
              <a href="/register" className="border-2 border-white font-bold py-4 px-8 rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300">
                Become Partner
              </a>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-8">Technology</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-4"></div>
                Real-time availability tracking
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-4"></div>
                AI-powered recommendations
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-4"></div>
                Secure payment processing
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-8">Security</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-4"></div>
                End-to-end encryption
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-4"></div>
                Verified partners only
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-4"></div>
                Full insurance coverage
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About

