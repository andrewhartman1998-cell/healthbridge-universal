import React from 'react'
import { Search, Sprout, Apple, Globe, ArrowRight, Heart } from 'lucide-react'

export default function Landing({ setPage }) {
  const stats = [
    { number: '733M+', label: 'People facing hunger worldwide' },
    { number: '3.1B', label: 'Cannot afford a healthy diet' },
    { number: '100%', label: 'Free — always' },
  ]

  const features = [
    { icon: Search, color: 'bg-orange-100 text-orange-700', title: 'Find Food Near You', desc: 'Food banks, soup kitchens, community fridges, meal programs, and SNAP/WIC-accepting retailers — filtered by your needs.', page: 'findfood' },
    { icon: Sprout, color: 'bg-green-100 text-green-700', title: 'Community Gardens', desc: 'Find local growing spaces, seed libraries, and urban farms. Grow your own food or join a community plot.', page: 'gardens' },
    { icon: Apple, color: 'bg-red-100 text-red-700', title: 'Nutrition Guidance', desc: 'Free, plain-language nutrition guides. Learn how to eat healthy on a budget, meal plan, and make the most of what you have.', page: 'nutrition' },
    { icon: Globe, color: 'bg-blue-100 text-blue-700', title: 'Global Food Map', desc: 'An interactive map of food resources across every country. From rural villages to urban centers — find help anywhere on Earth.', page: 'globalmap' },
  ]

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="text-6xl mb-6">🌱</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Healthy food for every<br />
            <span className="text-green-200">person on Earth.</span>
          </h1>
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            FoodAccess Global connects people to free and affordable healthy food, community gardens, nutrition resources, and emergency meal programs — anywhere in the world.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => setPage('findfood')} className="bg-white text-green-700 font-bold px-8 py-3 rounded-full shadow hover:shadow-lg transition-all flex items-center gap-2">
              <Search size={18} /> Find Food Now
            </button>
            <button onClick={() => setPage('globalmap')} className="bg-green-800 text-white font-bold px-8 py-3 rounded-full shadow hover:shadow-lg transition-all flex items-center gap-2">
              <Globe size={18} /> Global Map
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-green-100 py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-3xl font-bold text-green-600">{s.number}</div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">What FoodAccess Global does</h2>
        <p className="text-center text-gray-500 mb-10">Four pillars. One mission: no one goes hungry.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all border border-gray-100">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                <f.icon size={24} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{f.desc}</p>
              <button onClick={() => setPage(f.page)} className="flex items-center gap-1 text-green-700 font-semibold text-sm hover:gap-2 transition-all">
                Explore <ArrowRight size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="bg-green-50 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Heart size={36} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our belief</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Hunger is not a scarcity problem — it's a distribution and access problem. Every person on Earth deserves access to safe, nutritious food. FoodAccess Global exists to close that gap, one community at a time.
          </p>
        </div>
      </div>

      {/* Emergency */}
      <div className="bg-red-50 border-t-4 border-red-400 py-8 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-lg font-bold text-red-700 mb-4">🚨 Emergency Food Hotlines</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white rounded-xl p-4 shadow-sm"><div className="font-bold text-gray-800">US National Hunger Hotline</div><div className="text-red-600 font-bold text-lg mt-1">1-866-3-HUNGRY</div></div>
            <div className="bg-white rounded-xl p-4 shadow-sm"><div className="font-bold text-gray-800">SNAP Benefits (US)</div><div className="text-red-600 font-bold text-lg mt-1">1-800-221-5689</div></div>
            <div className="bg-white rounded-xl p-4 shadow-sm"><div className="font-bold text-gray-800">WFP Global Helpline</div><div className="text-red-600 font-bold text-lg mt-1">wfp.org/contact</div></div>
          </div>
        </div>
      </div>
    </div>
  )
}
