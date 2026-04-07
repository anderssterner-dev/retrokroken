import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Gallery from '../components/Gallery'
import Footer from '../components/Footer'

export default function Objects() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="bg-bg pt-16">
      <Navbar />
      <main>
        <Gallery customLabel="Retrokroken" customTitle="Objekt" hideSubtitle />
      </main>
      <div className="pb-96 md:pb-64" />
      <Footer />
    </div>
  )
}