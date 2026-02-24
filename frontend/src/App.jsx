import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

 return (
    <div className="p-10 text-3xl font-bold text-green-500">
      Tailwind Working ✅
    </div>
  );
}

export default App
