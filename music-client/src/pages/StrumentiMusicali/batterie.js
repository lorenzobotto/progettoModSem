import React from 'react'
import BatteriaElement from '../../components/StrumentiMusicali/Batterie'
import NavbarElement from '../../components/Navbar'

const Batterie = () => {
    return (
        <>
            {/* Richiamo il render dei componenti */}
            <NavbarElement />
            <BatteriaElement />
        </>
    )
}

export default Batterie
