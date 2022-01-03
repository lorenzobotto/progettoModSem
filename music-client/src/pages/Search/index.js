import React from 'react'
import NavbarElement from '../../components/Navbar'
import SearchElement from '../../components/SearchPage'

const Search = () => {
    return (
        <>
            {/* Richiamo il render dei componenti */}
            <NavbarElement />
            <SearchElement />
        </>
    )
}

export default Search