import React from 'react'
import NavbarElement from '../../components/Navbar'
import CantantiElement from '../../components/Artisti/Cantanti'

const Cantanti = () => {
    return (
        <>
            {/* Richiamo il render dei componenti */}
            <NavbarElement />
            <CantantiElement />
        </>
    )
}

export default Cantanti
