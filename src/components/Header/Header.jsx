import "./Header.scss";
// import Logo from "src/assets/images/pm-shri.png";
import ministry from '../../assets/images/education_ministry.svg';
import dropdownimg from '../../assets/images/dropdown-icon.svg'
import SlidingTabBar from "./SlidingTabBar";
import { Link } from "react-router-dom";


const Header = () => {
  return (
    <>
      <div className="header-top">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="header-top-content">
                <div className="header-top-skipwrap top-date-time">
                  <ul>
                    <li><a href="#">10<sup>th</sup> July 2021</a></li>
                    <li><a href="#">14:00 IST (GMT + 5:30)</a></li>
                  </ul>
                </div>

                <div className="header-top-skipwrap">
                  <ul>
                    <li><a href="#" target="_blank">Helpline Numbers</a></li>
                    <li><a href="#" target="_blank">Skip To Navigation</a></li>
                    <li><a href="#">Skip to Main Content</a></li>
                  </ul>
                </div>

                <div className="header-top-skipwrap right-access-points">
                  <ul>
                    <li>
                      <div id="form-wrapper" title="Text Increment">
                        <form action="" method="" className="font-item">
                          <span className="font-t">A</span>
                          <div id="debt-amount-slider">
                            <input type="radio" name="debt-amount" id="1" value="1" required="" title="Decrease Font Size"/>
                            <label htmlFor="1"></label>
                            <input type="radio" name="debt-amount" id="2" value="2" defaultChecked="checked" required="" title="Normal Font Size"/>
                            <label htmlFor="2"></label>
                            <input type="radio" name="debt-amount" id="3" value="3" required="" title="Increase Font Size"/>
                            <label htmlFor="3"></label>
                            <div id="debt-amount-pos"></div>
                          </div>
                          <span className="font-t size-16">A</span>
                        </form>
                      </div>
                    </li>

                    <li>
                      <div className="d-flex align-items-center">
                      <span className="text me-2">Dark Mode </span>
                      <label className="switch mb-0" title="Dark Mode">
                        <input type="checkbox" id="mode"/>
                          <span className="slider round"></span>
                      </label>
                      </div>
                    </li>

                    <li>
                      <div className="d-flex align-items-center">
                      <span className="text me-2">Language </span>
                      <a>
                        <div className="select-wrap">
                          <select className="form-select Langchange" defaultValue={"en"}>
                            <option value="en">English</option>
                            <option value="hi">हिन्दी</option>
                          </select>
                          <span className="material-icons">arrow_drop_down</span>
                        </div>
                      </a>
                      </div>
                    </li>
                  </ul>
                </div>              
              </div>
            </div>
          </div>
        </div>
      </div>

      <header className="site-header">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <nav className="navbar navbar-expand-lg">
                <div className="logo-wrap">
                  <a href="#" className="top-logo"> <img src={ministry} alt="logo" className="img-fluid" /></a>

                  <div className="menu-switch-tab">
                    <SlidingTabBar/>
                  </div>

                  <div className="">
                    
                  <Link className="header-dropdown-btn" title="UDISE+ Reports" to="/reports">UDISE+ Reports <img src={dropdownimg} alt="UDISE+ Reports" /> </Link>
                  </div>                 
                </div>

              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
