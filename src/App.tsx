import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Hero from "@/components/hero-section"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-1">
          <Hero />
        </main>
        
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App