import Link from 'next/link';

const Footer = () => {
  return (
    <footer>
      <div className="footer-logo">Anthony <span>Leuterio</span></div>
      <div className="footer-copy">© 2024 ANTHONY LEUTERIO. ALL RIGHTS RESERVED.</div>
      <div className="footer-socials">
        <a href="#" className="soc">FB</a>
        <a href="#" className="soc">IG</a>
        <a href="#" className="soc">LI</a>
      </div>
    </footer>
  );
};

export default Footer;
