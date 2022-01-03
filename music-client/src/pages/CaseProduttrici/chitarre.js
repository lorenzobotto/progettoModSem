import React from 'react'
import NavbarElement from '../../components/Navbar'
import CaseProdChitarreElement from '../../components/CaseProduttrici/Chitarre'

const CaseProdChitarre = () => {
    return (
        <>
            {/* Richiamo il render dei componenti */}
            <NavbarElement />
            <CaseProdChitarreElement />
        </>
    )
}

export default CaseProdChitarre