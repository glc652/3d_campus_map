"""Local preview, with a fixed-path GLB export for the desktop browser."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json
import struct

ROOT = Path(__file__).resolve().parent

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT / 'dist'), **kwargs)

    def do_POST(self):
        if self.path != '/api/export-model':
            self.send_error(404)
            return
        if self.headers.get('Origin') != 'http://127.0.0.1:5173':
            self.send_error(403)
            return
        length = int(self.headers.get('Content-Length', '0'))
        if not 12 <= length <= 50_000_000:
            self.send_error(413)
            return
        data = self.rfile.read(length)
        if data[:4] != b'glTF' or struct.unpack_from('<I', data, 8)[0] != length:
            self.send_error(400, 'Invalid GLB')
            return
        folder = ROOT / 'models'
        folder.mkdir(exist_ok=True)
        path = folder / 'ZUCC-campus-schematic.glb'
        path.write_bytes(data)
        result = json.dumps({'saved': True, 'file': 'models/ZUCC-campus-schematic.glb'}).encode()
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(result)))
        self.end_headers()
        self.wfile.write(result)

if __name__ == '__main__':
    print('Campus map: http://127.0.0.1:5173/', flush=True)
    ThreadingHTTPServer(('127.0.0.1', 5173), Handler).serve_forever()
