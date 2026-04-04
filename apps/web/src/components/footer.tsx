export default function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="footerInfo">
        <div>
          <h4 className="font-bold">ItaReport</h4>
          <p>Platform for community issue reports.</p>
        </div>
        <div>
          <h4 className="font-bold">More Information</h4>
          <ul>
            <li>
              <a href="/about">About</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold">Contact</h4>
          <a target="_blank" rel="noreferrer" href="https://www.instagram.com/inovilar/">
            <i className="pi pi-instagram"></i>
          </a>
          <a target="_blank" rel="noreferrer" href="mailto:contato@inovilar.com.br">
            <i className="pi pi-envelope"></i>
          </a>
        </div>
      </div>
      <div className="copyright">
        <span>&copy;2025 ItaReport</span>
      </div>
    </footer>
  );
}
