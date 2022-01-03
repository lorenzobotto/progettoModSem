import React from 'react'
import NavbarElement from '../../components/Navbar'
import GruppiElement from '../../components/BandMusicali/Gruppi'

const Gruppi = () => {
    return (
        <>
            {/* Richiamo il render dei componenti */}
            <NavbarElement />
            <GruppiElement />
        </>
    )
}

export default Gruppi