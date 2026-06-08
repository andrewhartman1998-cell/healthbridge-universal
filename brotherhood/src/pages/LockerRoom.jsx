import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const THREADS = [
  { id:1, tag:'Sports', emoji:'🏈', title:"Who's taking the Super Bowl this year?", replies:47, likes:112, time:'2h ago', preview:"Chiefs are dynasty territory now. Mahomes doesn't lose late games. Fight me." },
  { id:2, tag:'Work', emoji:'💼', title:'Got passed over for promotion again. Third time.', replies:89, likes:203, time:'4h ago', preview:"Started updating my resume tonight. Maybe it's time to bounce." },
  { id:3, tag:'Fitness', emoji:'💪', title:'6 months in the gym — first time I actually stuck with it', replies:134, likes:445, time:'5h ago', preview:"Key for me was going at 5am before my brain could talk me out of it." },
  { id:4, tag:'Fatherhood', emoji:'👨‍👦', title:"My son called me his hero today. I'm not okay (in a good way)", replies:201, likes:892, time:'6h ago', preview:"He's 6. I've been working too much. This hit different." },
  { id:5, tag:'Life', emoji:'🔥', title:'30 and still figuring it out — anyone else?', replies:312, likes:671, time:'8h ago', preview:"Society acts like we're supposed to have everything sorted by now. I don't. Not even close." },
  { id:6, tag:'Relationships', emoji:'💔', title:'Divorce finalized this week. Weird feeling.', replies:78, likes:334, time:'12h ago', preview:"Not sad exactly. Just... empty. Starting over at 38." },
  { id:7, tag:'Mental Health', emoji:'🧠', title:'Opened up to my buddy about anxiety. He said "me too."', replies:156, likes:567, time:'1d ago', preview:"10 years of friendship. We'd never talked about it. Why did it take this long?" },
  { id:8, tag:'Humor', emoji:'😂', title:"Things my dad said that turned out to be 100% correct", replies:445, likes:1203, time:'1d ago', preview:'"You\'ll understand when you\'re older." Bro I\'m 33 and I get it now.' },
  { id:9, tag:'Finance', emoji:'💰', title:'Finally paid off my student loans. 11 years.', replies:67, likes:892, time:'2d ago', preview:"Celebrated by doing absolutely nothing. Just sat in my car and felt it." },
  { id:10, tag:'Brotherhood', emoji:'🤝', title:"When's the last time you told your boys you appreciate them?", replies:223, likes:778, time:'2d ago', preview:"Texted my three best friends today. All three seemed caught off guard. That's the problem." },
]

const TAGS = ['All','Sports','Work','Fitness','Fatherhood','Life','Relationships','Mental Health','Humor','Finance','Brotherhood']
const TAG_COLORS = { Sports:'blue', Work:'indigo', Fitness:'green', Fatherhood:'amber', Life:'orange', Relationships:'rose', 'Mental Health':'purple', Humor:'yellow', Finance:'teal', Brotherhood:'cyan' }

export default function LockerRoom() {
  const nav = useNavigate()
  const [tag, setTag] = useState('All')
  const [newPost, setNewPost] = useState('')
  const [posted, setPosted] = useState(false)
  const [threads, setThreads] = useState(THREADS)

  const filtered = tag === 'All' ? threads : threads.filter(t => t.tag === tag)

  const submit = () => {
    if (!newPost.trim()) return
    setThreads(prev => [{
      id: Date.now(), tag: 'Life', emoji: '💬',
      title: newPost.slice(0, 80),
      replies: 0, likes: 0, time: 'just now',
      preview: 'Be the first to reply.'
    }, ...prev])
    setNewPost('')
    setPosted(true)
    setTimeout(() => setPosted(false), 3000)
  }

  return (
    <div className="min-h-screen bg-steel-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => nav('/')} className="text-steel-400 hover:text-white">← Back</button>
          <div>
            <h1 className="text-3xl font-black text-white">🏈 The Locker Room</h1>
            <p className="text-steel-400 text-sm">Talk about anything. Sports, life, work, fatherhood, relationships. This is the room.</p>
          </div>
        </div>

        {/* Post box */}
        <div className="bg-steel-900 border border-steel-700 rounded-2xl p-5 mb-6">
          <textarea
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
            placeholder="What's on your mind, brother? Say it."
            rows={3}
            className="w-full bg-steel-800 border border-steel-700 text-white rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-steel-500"
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-steel-500 text-xs">Anonymous by default. No one knows it's you.</span>
            <button onClick={submit}
              className={`font-black px-6 py-2 rounded-xl text-sm transition-all ${posted ? 'bg-green-700 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>
              {posted ? '✓ Posted' : 'Post it'}
            </button>
          </div>
        </div>

        {/* Tag filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {TAGS.map(t => (
            <button key={t} onClick={() => setTag(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${tag === t ? 'bg-blue-600 text-white' : 'bg-steel-800 text-steel-400 hover:bg-steel-700'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Threads */}
        <div className="space-y-3">
          {filtered.map(t => (
            <div key={t.id} className="bg-steel-900 hover:bg-steel-800 border border-steel-700 hover:border-blue-700 rounded-2xl p-5 cursor-pointer transition-all group">
              <div className="flex items-start gap-4">
                <div className="text-3xl">{t.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs bg-steel-800 border border-steel-600 text-steel-300 px-2 py-0.5 rounded-full font-bold">{t.tag}</span>
                    <span className="text-steel-600 text-xs">{t.time}</span>
                  </div>
                  <h3 className="font-black text-white text-base group-hover:text-blue-300 transition-colors mb-1">{t.title}</h3>
                  <p className="text-steel-400 text-sm">{t.preview}</p>
                  <div className="flex gap-4 mt-3 text-steel-500 text-xs">
                    <span>💬 {t.replies} replies</span>
                    <span>❤️ {t.likes} </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
