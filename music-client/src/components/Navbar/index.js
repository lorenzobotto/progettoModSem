import React from 'react'
import {Nav, Navbar, Container, NavDropdown} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {Link} from 'react-router-dom';

/* 
    Codice per la navbar, importandola da boostrap.
    Sono inserite le varie voci, con menù a dropdown dove necessario, sempre importati da boostrap.
    I link sono dei link router di React, in modo che cambino la pagina.
*/

const NavbarElement = () => {
    return (
        <div>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                <Navbar.Brand as={Link} to="/">Music Ontology</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse>
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <NavDropdown title="Strumenti musicali" id="navbarScrollingDropdown">
                        <NavDropdown.Item as={Link} to="/microfoni">Microfoni</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/bassi">Bassi elettrici</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/batterie">Batterie</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/chitarre">Chitarre</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/tastiere">Tastiere</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="Artisti" id="navbarScrollingDropdown">
                        <NavDropdown.Item as={Link} to="/cantanti">Cantanti</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/bassisti">Bassisti</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/batteristi">Batteristi</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/chitarristi">Chitarristi</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/tastieristi">Tastieristi</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="Case Produttrici" id="navbarScrollingDropdown">
                        <NavDropdown.Item as={Link} to="/caseMicrofoni">Case Produttrici Microfoni</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/caseBassi">Case Produttrici Bassi</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/caseBatterie">Case Produttrici Batterie</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/caseChitarre">Case Produttrici Chitarre</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/caseTastiere">Case Produttrici Tastiere</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="Band Musicali" id="navbarScrollingDropdown">
                        <NavDropdown.Item as={Link} to="/band">Gruppi musicali</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/solisti">Solisti</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    )
}

export default NavbarElement
