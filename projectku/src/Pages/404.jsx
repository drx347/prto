export default function NotFound() {
  return (
    <main className="notFoundNeo">
      <div className="notFoundNeoShell container">
        <div className="notFoundNeoPanel">
          <div className="notFoundNeoBadge">Error Page</div>
          <div className="notFoundNeoCode" aria-label="404">
            <span>4</span>
            <span>0</span>
            <span>4</span>
          </div>
          <div className="notFoundNeoCopy">
            <p className="notFoundNeoKicker">Oops, rute ini kosong.</p>
            <h1>Halaman tidak ditemukan.</h1>
            <p>
              Link yang kamu buka mungkin sudah pindah, salah ketik, atau memang belum dibuat.
            </p>
          </div>
          <a className="notFoundNeoButton" href="#home">
            Kembali ke Home
            <span aria-hidden="true">-&gt;</span>
          </a>
        </div>
      </div>
    </main>
  );
}
