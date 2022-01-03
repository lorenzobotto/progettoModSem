import React from 'react'
import NavbarElement from '../../components/Navbar'
import ChitarristiElement from '../../components/Artisti/Chitarristi'

const Chitarristi = () => {
    return (
        <>
            {/* Richiamo il render dei componenti */}
            <NavbarElement />
            <ChitarristiElement />
        </>
    )
}

export default Chitarristi
