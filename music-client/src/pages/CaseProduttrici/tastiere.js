import React from 'react'
import NavbarElement from '../../components/Navbar'
import CaseProdTastiereElement from '../../components/CaseProduttrici/Tastiere'

const CaseProdTastiere = () => {
    return (
        <>
            {/* Richiamo il render dei componenti */}
            <NavbarElement />
            <CaseProdTastiereElement />
        </>
    )
}

export default CaseProdTastiere