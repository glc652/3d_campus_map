from server import Handler, ROOT
from http.server import ThreadingHTTPServer
import json

class VideoHandler(Handler):
    def do_POST(self):
        if self.path != '/api/export-video':
            return super().do_POST()
        if self.headers.get('Origin') != 'http://127.0.0.1:5174':
            return self.send_error(403)
        length = int(self.headers.get('Content-Length', '0'))
        if not 12 <= length <= 150_000_000:
            return self.send_error(413)
        data = self.rfile.read(length)
        if data[4:8] != b'ftyp':
            return self.send_error(400, 'Expected MP4')
        folder = ROOT / 'videos'
        folder.mkdir(exist_ok=True)
        (folder / 'campus-introduction.mp4').write_bytes(data)
        result = json.dumps({'saved': True}).encode()
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(result)))
        self.end_headers()
        self.wfile.write(result)

ThreadingHTTPServer(('127.0.0.1', 5174), VideoHandler).serve_forever()
