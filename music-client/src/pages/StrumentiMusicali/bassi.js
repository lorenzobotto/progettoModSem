import React from 'react'
import BassoElement from '../../components/StrumentiMusicali/Bassi'
import NavbarElement from '../../components/Navbar'

const Bassi = () => {
    return (
        <>
            {/* Richiamo il render dei componenti */}
            <NavbarElement />
            <BassoElement />
        </>
    )
}

export default Bassi
