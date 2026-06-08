import React, { useState } from 'react'
import { Apple, DollarSign, ChefHat, Baby, Heart } from 'lucide-react'

const GUIDES = [
  { id:1, icon:'🥗', title:'Eating Healthy on $5 a Day', category:'Budget Eating', desc:'Practical strategies for getting full nutrition on a very tight budget. Includes a weekly meal plan and shopping list under $35/week.', content: `**The $5/Day Strategy:**\n\n• **Prioritize protein staples:** Eggs (~$0.15 each), dried beans (~$0.08/serving), canned tuna (~$0.50/serving), peanut butter (~$0.20/serving)\n• **Buy frozen vegetables:** Just as nutritious as fresh, far cheaper. Frozen spinach, broccoli, peas, and corn are all under $1/cup.\n• **Whole grains in bulk:** Brown rice, oats, and lentils cost pennies per serving and keep for months.\n• **Shop seasonally:** In-season produce is 40–60% cheaper. Winter: sweet potatoes, cabbage, citrus. Summer: tomatoes, zucchini, corn.\n• **Use your library:** Many public libraries offer free Cooking Matters classes and recipe kits.\n\n**Sample $35/Week Meal Plan:**\nBreakfast: Oatmeal with banana ($0.40/day)\nLunch: Bean and rice bowl with frozen veg ($1.20/day)\nDinner: Lentil soup + bread ($1.80/day)\nSnacks: Peanut butter on whole wheat ($0.60/day)\nTotal: ~$4/day` },
  { id:2, icon:'🍼', title:'Nutrition for Babies & Children', category:'Family Health', desc:'What children need at every age, how to introduce foods safely, and free programs like WIC that help families eat well.', content:`**Key nutrients for children:**\n\n• **Iron:** Critical for brain development. Best sources: fortified cereals, meat, beans, leafy greens with vitamin C.\n• **Calcium:** For bones. Milk, yogurt, cheese, fortified plant milks, broccoli.\n• **Vitamin D:** Most kids are deficient. 15 min of sun daily + fortified foods.\n• **Omega-3s:** Brain health. Fatty fish 2x/week, walnuts, flaxseed.\n\n**Free help available:**\n• WIC: Free healthy food vouchers for children under 5 and pregnant moms (call 1-800-942-3678)\n• School breakfast and lunch programs: Free for qualifying families\n• CACFP: Free meals for children in daycare (cacfp.org)` },
  { id:3, icon:'👴', title:'Nutrition for Older Adults', category:'Senior Health', desc:'How nutritional needs change with age, foods that protect against chronic disease, and free meal programs for seniors.', content:`**What changes as we age:**\n\n• Need fewer calories but MORE of certain nutrients\n• Calcium and Vitamin D become critical (bone loss accelerates)\n• Protein needs INCREASE to prevent muscle loss — aim for 1.0–1.2g per kg of body weight\n• Hydration: thirst decreases with age — drink water proactively\n• B12: Absorption decreases — consider fortified foods or supplements\n\n**Free food programs for seniors:**\n• Meals on Wheels: Free home delivery (1-888-998-6325)\n• Senior Farmers Market Nutrition Program: Free vouchers for fresh produce\n• Commodity Supplemental Food Program: Monthly food boxes for seniors 60+\n• SNAP: Many seniors qualify and don't know it — apply at benefits.gov` },
  { id:4, icon:'🌍', title:'Global Nutrition Facts', category:'Global Health', desc:'The truth about hunger, malnutrition, and what works — data-backed, plain-language guide to food security worldwide.', content:`**The global picture:**\n\n• 733 million people face hunger. But the world produces 1.5x the food needed to feed everyone — it's a distribution problem.\n• 3 billion people cannot afford a healthy diet\n• 45% of child deaths under 5 are linked to malnutrition\n• Micronutrient deficiency ("hidden hunger") affects 2 billion more\n\n**What actually works:**\n• Fortification programs (iodine in salt, iron in flour) — cheap, massive impact\n• School meal programs — increase enrollment AND nutrition\n• Supporting smallholder farmers — 70% of the world's food is grown by small farms\n• Reducing food waste — 1/3 of all food produced is wasted\n\n**What you can do:**\n• Donate to WFP, UNICEF, or Heifer International\n• Support local food banks\n• Reduce food waste at home\n• Advocate for SNAP and WIC funding` },
  { id:5, icon:'💊', title:'Vitamins & Supplements Guide', category:'Supplements', desc:'Which supplements are actually worth it, which are waste of money, and how to get nutrients from food first.', content:`**Food first — always. But these matter:**\n\n• **Vitamin D:** 40%+ of Americans are deficient. Get tested. 1,000–2,000 IU/day is safe for most adults.\n• **B12:** Essential if you eat little or no meat. Important for vegans and seniors.\n• **Iron:** Only supplement if deficient (blood test). Too much iron is harmful.\n• **Omega-3 (fish oil):** If you don't eat fish 2x/week, a 1g/day supplement is reasonable.\n• **Folate:** Critical for pregnancy — 400mcg/day before and during pregnancy.\n\n**Probably not worth it:**\n• Multivitamins for healthy adults with a varied diet\n• High-dose antioxidant supplements\n• "Detox" or "cleanse" products — your liver does this for free\n\n**Free nutrition counseling:**\n• SNAP-Ed: Free nutrition education if you receive SNAP (snaped.fns.usda.gov)\n• WIC nutrition counselors: Free for qualifying families\n• Community health centers: Sliding scale dietitian appointments (findahealthcenter.hrsa.gov)` },
]

export default function Nutrition() {
  const [selected, setSelected] = useState(null)
  const [catFilter, setCatFilter] = useState('All')

  const categories = ['All', ...new Set(GUIDES.map(g => g.category))]
  const filtered = catFilter === 'All' ? GUIDES : GUIDES.filter(g => g.category === catFilter)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🍎 Nutrition Guidance</h1>
        <p className="text-gray-500">Free, plain-language nutrition guides. Eat well on any budget, at any age, anywhere in the world.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={`text-sm px-4 py-1.5 rounded-full font-medium transition-all ${catFilter === c ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-green-400'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map(g => (
          <div key={g.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer" onClick={() => setSelected(g)}>
            <div className="text-3xl mb-3">{g.icon}</div>
            <span className="text-xs bg-green-50 text-green-700 font-bold px-2 py-1 rounded-full">{g.category}</span>
            <h2 className="font-bold text-gray-800 text-base mt-2 mb-1">{g.title}</h2>
            <p className="text-gray-500 text-sm leading-relaxed">{g.desc}</p>
            <button className="mt-3 text-green-700 text-sm font-semibold hover:underline">Read Guide →</button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div><div className="text-3xl mb-1">{selected.icon}</div><h2 className="text-xl font-bold text-gray-800">{selected.title}</h2></div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 text-xl font-bold">×</button>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <pre className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-sans">{selected.content}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
