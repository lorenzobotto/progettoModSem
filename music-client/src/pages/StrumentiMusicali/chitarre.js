import React from 'react'
import ChitarraElement from '../../components/StrumentiMusicali/Chitarre'
import NavbarElement from '../../components/Navbar'

const Chitarre = () => {
    return (
        <>
            {/* Richiamo il render dei componenti */}
            <NavbarElement />
            <ChitarraElement />
        </>
    )
}

export default Chitarre
