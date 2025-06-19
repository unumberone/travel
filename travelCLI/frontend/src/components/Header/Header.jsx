import React, { useEffect, useRef, useContext, useState } from 'react'
import { Container, Row, Button } from 'reactstrap'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import Logo from '../../assets/images/logo.png'
import "./header.css"
import { AuthContext } from '../../context/AuthContext'

const nav__links = [
   { path: '/home', display: 'Home' },
   { path: '/about', display: 'About' },
   { path: '/tours', display: 'Tours' },
]

const Header = () => {
   const headerRef = useRef(null)
   const menuRef = useRef(null)
   const navigate = useNavigate()
   const { user, dispatch } = useContext(AuthContext)
   const [dropdownOpen, setDropdownOpen] = useState(false)
   const dropdownRef = useRef(null)

   const logout = () => {
      dispatch({ type: 'LOGOUT' })
      navigate('/')
   }

   const stickyHeaderFunc = () => {
      window.addEventListener('scroll', () => {
         if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
            headerRef.current.classList.add('sticky__header')
         } else {
            headerRef.current.classList.remove('sticky__header')
         }
      })
   }

   useEffect(() => {
      stickyHeaderFunc()
      return window.removeEventListener('scroll', stickyHeaderFunc)
   }, [])

   const toggleMenu = () => menuRef.current.classList.toggle('show__menu')

   // Đóng dropdown khi click ra ngoài
   useEffect(() => {
      const handleClickOutside = (event) => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false)
         }
      }
      if (dropdownOpen) {
         document.addEventListener('mousedown', handleClickOutside)
      } else {
         document.removeEventListener('mousedown', handleClickOutside)
      }
      return () => document.removeEventListener('mousedown', handleClickOutside)
   }, [dropdownOpen])

   return (
      <header className='header' ref={headerRef}>
         <Container>
            <Row>
               <div className="nav__wrapper d-flex align-items-center justify-content-between">
                  {/* ========== LOGO ========== */}
                  <div className="logo">
                     <img src={Logo} alt="" />
                  </div>
                  {/* ========================== */}

                  {/* ========== MENU START ========== */}
                  <div className="navigation" ref={menuRef} onClick={toggleMenu}>
                     <ul className="menu d-flex align-items-center gap-5">
                        {
                           nav__links.map((item, index) => (
                              <li className="nav__item" key={index}>
                                 <NavLink to={item.path} className={navClass => navClass.isActive ? 'active__link' : ''}>{item.display}</NavLink>
                              </li>
                           ))
                        }
                     </ul>
                  </div>
                  {/* ================================ */}

                  <div className="nav__right d-flex align-items-center gap-4">
                     <div className="nav__btns d-flex align-items-center gap-2">
                        {user ? (
                           <div className="user-dropdown" ref={dropdownRef} style={{ position: "relative" }}>
                              <span
                                 className="d-flex align-items-center user-icon"
                                 style={{ cursor: "pointer" }}
                                 onClick={() => setDropdownOpen(!dropdownOpen)}
                              >
                                 <i className="ri-user-3-fill" style={{ fontSize: 24, marginRight: 6 }}></i>
                                 <span className="fw-bold">{user.username}</span>
                                 <i className="ri-arrow-down-s-line ms-1"></i>
                              </span>
                              {dropdownOpen && (
                                 <div
                                    className="dropdown-menu show"
                                    style={{
                                       position: "absolute",
                                       top: "110%",
                                       right: 0,
                                       minWidth: 180,
                                       background: "#fff",
                                       border: "1px solid #eee",
                                       borderRadius: 8,
                                       boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                       zIndex: 1000,
                                       padding: "0.5rem 0"
                                    }}
                                 >
                                    <div className="px-3 py-2 border-bottom">
                                       <div className="fw-bold">{user.username}</div>
                                       <div style={{ fontSize: 13, color: "#888" }}>{user.email}</div>
                                    </div>
                                    <Link
                                       to="/#"
                                       className="dropdown-item px-3 py-2"
                                       style={{ display: "block", color: "#222", textDecoration: "none" }}
                                       onClick={() => setDropdownOpen(false)}
                                    >
                                       <i className="ri-user-settings-line me-2"></i> Thông tin cá nhân
                                    </Link>
                                    <Link
                                       to="/history"
                                       className="dropdown-item px-3 py-2"
                                       style={{ display: "block", color: "#222", textDecoration: "none" }}
                                       onClick={() => setDropdownOpen(false)}
                                    >
                                       <i className="ri-file-list-3-line me-2"></i> Lịch sử đặt phòng
                                    </Link>
                                    <div
                                       className="dropdown-item px-3 py-2"
                                       style={{ cursor: "pointer", color: "#dc3545" }}
                                       onClick={() => { setDropdownOpen(false); logout(); }}
                                    >
                                       <i className="ri-logout-box-r-line me-2"></i> Đăng xuất
                                    </div>
                                 </div>
                              )}
                           </div>
                        ) : (
                           <>
                              <Button className='btn secondary__btn'><Link to='/login'>Login</Link></Button>
                              <Button className='btn primary__btn'><Link to='/register'>Register</Link></Button>
                           </>
                        )}
                     </div>

                     <span className="mobile__menu" onClick={toggleMenu}>
                        <i className="ri-menu-line"></i>
                     </span>
                  </div>
               </div>
            </Row>
         </Container>
      </header>
   )
}

export default Header;