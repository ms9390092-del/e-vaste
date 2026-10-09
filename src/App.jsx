import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Scan from './pages/Scan'
import Result from './pages/Result'
import ManualIdentify from './pages/ManualIdentify'
import Guide from './pages/Guide'
import MyEwaste from './pages/MyEwaste'
import DisposalFinder from './pages/DisposalFinder'
import Assistant from './pages/Assistant'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="scan" element={<Scan />} />
        <Route path="result/:itemId" element={<Result />} />
        <Route path="manual" element={<ManualIdentify />} />
        <Route path="guide/:category" element={<Guide />} />
        <Route path="my-ewaste" element={<MyEwaste />} />
        <Route path="disposal-finder" element={<DisposalFinder />} />
        <Route path="assistant" element={<Assistant />} />
      </Route>
    </Routes>
  )
}

export default App