import React from 'react'
import {Nav, Navbar, Container, NavDropdown} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {Link} from 'react-router-dom';

const NavbarElement = () => {
    return (
        <div>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                <Navbar.Brand as={Link} to="/">Music Client</Navbar.Brand>
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
                </Nav>
                </Navbar.Collapse>
                </Container>
            </Navbar>
            <br />
        </div>
    )
}

export default NavbarElement
