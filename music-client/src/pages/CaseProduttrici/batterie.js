import React from 'react'
import NavbarElement from '../../components/Navbar'
import CaseProdBatterieElement from '../../components/CaseProduttrici/Batterie'

const CaseProdBatterie = () => {
    return (
        <>
            {/* Richiamo il render dei componenti */}
            <NavbarElement />
            <CaseProdBatterieElement />
        </>
    )
}

export default CaseProdBatterie