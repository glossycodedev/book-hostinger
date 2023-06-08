import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Store } from '../Store';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { NavDropdown } from 'react-bootstrap';
import SearchBox from './SearchBox';
import Badge from '@mui/material/Badge';
import { ShoppingBagOutlined } from '@mui/icons-material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ListIcon from '@mui/icons-material/List';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
// import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
// import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

export default function NavbarHeader() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { fullBox, favorite, cart, userInfo } = state;
  const [navbar, setNavbar] = useState(false);
  const [Language, setLanguage] = useState('En');

  const [categories, setCategories] = useState([]);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };

  const changeBackground = () => {
    if (window.scrollY >= 80) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };
  window.addEventListener('scroll', changeBackground);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  const changeLanguage = () => {
    if (Language === 'En') {
      setLanguage('کوردی');
    } else {
      setLanguage('En');
    }
  };

  const headerImg = './amazon.png';
  return (
    // <div className="header">
    <Navbar
      className={
        navbar
          ? 'navbar scroll navbar-expand-lg fixed-top'
          : 'navbar navbar-expand-lg fixed-top '
      }
      collapseOnSelect
      expand="lg"
      variant="dark"
    >
      <Container className={navbar ? 'nav-button scroll' : 'nav-button'}>
        <LinkContainer to="/" onClick={scrollToTop}>
          <Navbar.Brand
            className={navbar ? 'navbar-brand scroll ' : 'navbar-brand'}
          >
            <span>
              Amazon
              <img className="img-logo" src={headerImg} alt={headerImg} />Store
            </span>
          </Navbar.Brand>
        </LinkContainer>
        
        <NavDropdown
          title={
            <div style={{ flex: 1, display: 'inline-block' }}>
              {' '}
              <ListIcon
                style={{
                  flexDirection: 'row',
                  marginRight: '5px',
                  marginBottom: '4px',
              
                }}
              />
              Categories{' '}
            </div>
          }
          id="basic-nav-dropdown"
          className={navbar ? 'category-drop scroll ' : 'category-drop'}
        >
          {categories.map((category) => (
            <NavDropdown.Item key={category}>
              <Link
                className="button-category-list"
                to={`/search?category=${category}`}
              >
                {category}
              </Link>
            </NavDropdown.Item>
          ))}
        </NavDropdown>

        <SearchBox />
        <Navbar.Toggle
          className={navbar ? 'nav-button scroll' : 'nav-button'}
          aria-controls="responsive-navbar-nav"
        />

        <Navbar.Collapse
          id="responsive-navbar-nav"
          // className="collapse navbar-collapse"
          className={navbar ? 'nav-down scroll' : 'nav-down'}
        >
          <Navbar.Collapse id="basic-navbar-nav" >
            {/* <Nav className="me-auto"> */}

            <NavDropdown title={Language} id="basic-nav-dropdown" >
              <NavDropdown.Item onClick={changeLanguage} href="#">
                English
              </NavDropdown.Item>
              <NavDropdown.Item onClick={changeLanguage} href="#">
                کوردی
              </NavDropdown.Item>
            </NavDropdown>
            {/* </Nav> */}
          </Navbar.Collapse>
          <Nav className="me-auto header-link">
            <Link
              to="/cart"
              className={navbar ? 'nav-link  scroll' : 'nav-link'}
            >
              <Badge
                badgeContent={cart.cartItems.reduce(
                  (a, c) => a + c.quantity,
                  0
                )}
                color="error"
              >
                <ShoppingBagOutlined />
                {/* <ShoppingCartOutlinedIcon /> */}
              </Badge>
            </Link>
            <Link
              to="/favorite"
              className={navbar ? 'nav-link scroll' : 'nav-link'}
            >
              <Badge
                badgeContent={favorite.favoriteItems.reduce(
                  (a, c) => a + c.quantity,
                  0
                )}
                color="error"
              >
                <FavoriteBorderIcon />
              </Badge>
            </Link>
            {userInfo ? (
              <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                <LinkContainer to="/profile">
                  <NavDropdown.Item>User Profile</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/orderhistory">
                  <NavDropdown.Item>Order History</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <Link
                  className="dropdown-item"
                  to="#signout"
                  onClick={signoutHandler}
                >
                  Sign Out
                </Link>
              </NavDropdown>
            ) : (
              <Link
                className={navbar ? 'nav-link scroll' : 'nav-link'}
                to="/signin"
              >
                Sign In
              </Link>
            )}
            {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="admin-nav-dropdown">
                  <LinkContainer to="/admin/dashboard">
                    <NavDropdown.Item>Dashboard</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/products">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/pos">
                    <NavDropdown.Item>POS</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orders">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/users">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    // </div>
  );
}
