import Courses from './Courses'
import Hero from './Hero'
import Services from './Services'
import Stats from './Stats'

const Home = () => {
    return (
        <main style={{ backgroundColor: "#0A1628" }}>
            <Hero />
            <Stats />
            <Services/>
            <Courses/>
        </main>
    )
}

export default Home