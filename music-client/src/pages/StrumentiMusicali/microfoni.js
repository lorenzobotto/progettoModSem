import React from 'react'
import MicrofonoElement from '../../components/StrumentiMusicali/Microfoni'
import NavbarElement from '../../components/Navbar'

const Microfoni = () => {
    return (
        <>
            {/* Richiamo il render dei componenti */}
            <NavbarElement />
            <MicrofonoElement />
        </>
    )
}

export default Microfoni