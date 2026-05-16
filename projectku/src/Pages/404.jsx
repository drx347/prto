export default function NotFound() {
  return (
    <main>
      <div className="container" style={{ padding: "60px 0" }}>
        <h1 style={{ margin: 0 }}>404</h1>
        <p className="muted">Halaman tidak ditemukan.</p>
        <a className="pillLink" href="#home">
          Kembali <span aria-hidden="true">↗</span>
        </a>
      </div>
    </main>
  );
}
