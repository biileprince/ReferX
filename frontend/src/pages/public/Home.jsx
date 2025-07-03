import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiArrowRight, 
  FiUser, 
  FiBarChart2, 
  FiAward, 
  FiShield, 
  FiMessageSquare,
  FiChevronRight,
  FiCheck,
  FiStar,
  FiMenu,
  FiX
} from 'react-icons/fi';

const Home = () => {
  const [activeTab, setActiveTab] = useState('referrals');
  const [email, setEmail] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <FiUser className="h-6 w-6 text-indigo-600" />,
      title: "Simple Referrals",
      description: "Share your unique code via email, social media, or direct link with one click"
    },
    {
      icon: <FiBarChart2 className="h-6 w-6 text-indigo-600" />,
      title: "Real-time Tracking",
      description: "Monitor your referrals and earnings through an intuitive dashboard"
    },
    {
      icon: <FiAward className="h-6 w-6 text-indigo-600" />,
      title: "Reward Catalog",
      description: "Choose from gift cards, merchandise, and exclusive experiences"
    },
    {
      icon: <FiShield className="h-6 w-6 text-indigo-600" />,
      title: "Secure Platform",
      description: "Bank-level security protects your data and rewards"
    }
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Marketing Director",
      content: "Our customer acquisition increased by 40% after implementing this referral program.",
      company: "TechStart Inc"
    },
    {
      name: "Maria Garcia",
      role: "Small Business Owner",
      content: "The rewards system motivates my customers to refer others. It's transformed my business.",
      company: "Cafe Mocha"
    },
    {
      name: "David Kim",
      role: "Community Manager",
      content: "Our users love how easy it is to track their rewards. The dashboard is incredibly intuitive.",
      company: "SocialGood App"
    }
  ];

  const steps = [
    { number: "1", title: "Sign Up", description: "Create your free account in seconds" },
    { number: "2", title: "Share", description: "Send your unique referral code to friends" },
    { number: "3", title: "Earn", description: "Get points when friends sign up" },
    { number: "4", title: "Redeem", description: "Exchange points for rewards" }
  ];

  const stats = [
    { value: "45K+", label: "Active Users" },
    { value: "$2.1M", label: "Rewards Distributed" },
    { value: "92%", label: "Satisfaction Rate" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you! We'll send updates to ${email}`);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center relative">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">
            <FiStar className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">ReferX</span>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-600 hover:text-indigo-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
        </button>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors">Features</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-indigo-600 transition-colors">How It Works</a>
          <a href="#testimonials" className="text-gray-600 hover:text-indigo-600 transition-colors">Testimonials</a>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-indigo-600 outline outline-indigo-400 outline-1 py-2 px-4 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors duration-300">
            Sign In
          </Link>
          <Link 
            to="/register" 
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Get Started
          </Link>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 px-6 z-10">
            <div className="flex flex-col space-y-4">
              <a 
                href="#features" 
                className="text-gray-600 hover:text-indigo-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                className="text-gray-600 hover:text-indigo-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <a 
                href="#testimonials" 
                className="text-gray-600 hover:text-indigo-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </a>
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                <Link 
                  to="/login" 
                  className="text-center text-gray-600 hover:text-indigo-600 outline outline-indigo-400 outline-1 py-2 px-4 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="text-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-20 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Turn Your Network into <br />
              <span className="text-indigo-600">Rewards</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-xl">
              Refer friends, earn points, and redeem exciting rewards. Our intuitive platform makes it simple to grow your community and get rewarded for it.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link 
                to="/register" 
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center"
              >
                Start Earning <FiArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="#how-it-works" 
                className="bg-white text-gray-900 px-8 py-3 rounded-lg text-lg font-medium border border-gray-300 hover:border-indigo-300 transition-colors flex items-center justify-center"
              >
                How It Works
              </Link>
            </div>
            
            <div className="mt-10 flex flex-wrap gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-bold text-indigo-600">{stat.value}</span>
                  <span className="text-gray-600 mt-1 text-sm md:text-base">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative">
            <div className="absolute -top-6 -right-6 w-full h-full bg-indigo-100 rounded-2xl -z-10 hidden md:block"></div>
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="bg-indigo-100 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center">
                    <FiUser className="h-5 w-5 md:h-6 md:w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-gray-900">Your Referral Dashboard</h3>
                    <p className="text-gray-500 text-sm md:text-base">Referral Code: REF-5A9B2C</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 md:gap-6 mb-6">
                <div className="bg-indigo-50 p-3 md:p-4 rounded-lg">
                  <div className="text-xl md:text-2xl font-bold text-gray-900">24</div>
                  <div className="text-gray-500 text-sm md:text-base">Total Referrals</div>
                </div>
                <div className="bg-indigo-50 p-3 md:p-4 rounded-lg">
                  <div className="text-xl md:text-2xl font-bold text-gray-900">1,250</div>
                  <div className="text-gray-500 text-sm md:text-base">Points Earned</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <button className="px-3 py-2 text-sm md:px-4 md:py-2 md:text-base bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                  Share Link <FiChevronRight className="ml-1 h-4 w-4 md:h-5 md:w-5" />
                </button>
                <button className="px-3 py-2 text-sm md:px-4 md:py-2 md:text-base bg-white border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                  View Rewards
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Everything You Need to Succeed</h2>
            <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-xl mx-auto">
              Our platform is designed to make referrals simple, rewarding, and secure
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gradient-to-b from-white to-gray-50 rounded-xl p-6 md:p-8 border border-gray-200 hover:border-indigo-300 transition-colors hover:shadow-md"
              >
                <div className="bg-indigo-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4 md:mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm md:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="bg-gradient-to-br from-indigo-50 to-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-xl mx-auto">
              Start earning rewards in just four simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-indigo-600 text-white text-lg md:text-xl font-bold flex items-center justify-center mb-4 md:mb-6">
                  {step.number}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm md:text-base">{step.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 bg-white rounded-2xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Why choose ReferX?</h3>
                <ul className="space-y-3 md:space-y-4">
                  <li className="flex items-start">
                    <FiCheck className="h-5 w-5 md:h-6 md:w-6 text-green-500 mt-1 flex-shrink-0" />
                    <span className="ml-3 text-gray-600 text-sm md:text-base">No hidden fees or complicated requirements</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="h-5 w-5 md:h-6 md:w-6 text-green-500 mt-1 flex-shrink-0" />
                    <span className="ml-3 text-gray-600 text-sm md:text-base">Instant reward redemption</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="h-5 w-5 md:h-6 md:w-6 text-green-500 mt-1 flex-shrink-0" />
                    <span className="ml-3 text-gray-600 text-sm md:text-base">24/7 customer support</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="h-5 w-5 md:h-6 md:w-6 text-green-500 mt-1 flex-shrink-0" />
                    <span className="ml-3 text-gray-600 text-sm md:text-base">Mobile-friendly platform</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-indigo-50 rounded-xl p-6 md:p-8 flex flex-col justify-center">
                <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Join our community</h4>
                <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
                  Subscribe to get tips on maximizing your rewards and early access to new features.
                </p>
                <form onSubmit={handleSubmit} className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="flex-grow px-4 py-2 md:py-3 rounded-l-lg border border-r-0 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
                    required
                  />
                  <button 
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-r-lg hover:bg-indigo-700 transition-colors text-sm md:text-base"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div id="testimonials" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Trusted by Thousands</h2>
            <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-xl mx-auto">
              See what our users are saying about their experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-gradient-to-b from-white to-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="text-indigo-600 mb-3 md:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="inline h-4 w-4 md:h-5 md:w-5" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4 md:mb-6 text-sm md:text-base">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="bg-indigo-100 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-indigo-600 font-bold text-base md:text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-3 md:ml-4">
                    <div className="font-bold text-gray-900 text-sm md:text-base">{testimonial.name}</div>
                    <div className="text-gray-600 text-xs md:text-sm">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">
            Ready to Start Earning Rewards?
          </h2>
          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto mb-8 md:mb-10">
            Join thousands of users already earning rewards through our referral program
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <Link 
              to="/register" 
              className="bg-white text-indigo-600 px-6 py-3 md:px-8 md:py-4 rounded-lg text-base md:text-lg font-medium hover:bg-indigo-50 transition-colors shadow-lg flex items-center justify-center"
            >
              Get Started Free
            </Link>
            <Link 
              to="/login" 
              className="bg-transparent text-white border border-white px-6 py-3 md:px-8 md:py-4 rounded-lg text-base md:text-lg font-medium hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              Sign In to Account
            </Link>
          </div>
          <p className="mt-6 md:mt-8 text-indigo-200 text-sm md:text-base">
            No credit card required. Free forever.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            <div>
              <div className="flex items-center mb-3 md:mb-4">
                <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">
                  <FiStar className="h-5 w-5 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-white">ReferX</span>
              </div>
              <p className="mt-2 text-sm md:text-base">
                The ultimate platform for growing your network through referrals.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3 md:mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white text-sm md:text-base">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white text-sm md:text-base">How It Works</a></li>
                <li><a href="#testimonials" className="hover:text-white text-sm md:text-base">Testimonials</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3 md:mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white text-sm md:text-base">About</a></li>
                <li><a href="#" className="hover:text-white text-sm md:text-base">Careers</a></li>
                <li><a href="#" className="hover:text-white text-sm md:text-base">Contact</a></li>
                <li><a href="#" className="hover:text-white text-sm md:text-base">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3 md:mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white text-sm md:text-base">Terms</a></li>
                <li><a href="#" className="hover:text-white text-sm md:text-base">Privacy</a></li>
                <li><a href="#" className="hover:text-white text-sm md:text-base">Cookies</a></li>
                <li><a href="#" className="hover:text-white text-sm md:text-base">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-10 md:mt-12 pt-6 md:pt-8 border-t border-gray-800 text-center text-sm md:text-base">
            <p>© {new Date().getFullYear()} ReferX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;