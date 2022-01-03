import React from 'react'
import HomeElement from '../components/Homepage'
import NavbarElement from '../components/Navbar'

const Home = () => {
    return (
        <>
            {/* Richiamo il render dei componenti */}
            <NavbarElement />
            <HomeElement />
        </>
    )
}

export default Home
