import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Footer from '../components/Footer'

export default function Landing() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="landing-scene min-h-screen bg-bg flex flex-col">
      <Navbar showVCR={true} />
      <main className="flex-1 flex flex-col">
        <Hero />
      </main>
      <div className="mt-12" style={{ marginTop: 'calc(3rem - 8px)' }}>
        <Footer />
      </div>
    </div>
  )
}
