import uvicorn
import webbrowser
import threading
import time
import socket
import sys
import os

def forward_stream(src, dst):
    try:
        while True:
            data = src.recv(4096)
            if not data:
                break
            dst.sendall(data)
    except Exception:
        pass
    finally:
        try:
            src.close()
        except Exception:
            pass
        try:
            dst.close()
        except Exception:
            pass

def handle_port80_client(client_sock, target_host="127.0.0.1", target_port=8000):
    try:
        target_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        target_sock.connect((target_host, target_port))
        threading.Thread(target=forward_stream, args=(client_sock, target_sock), daemon=True).start()
        threading.Thread(target=forward_stream, args=(target_sock, client_sock), daemon=True).start()
    except Exception:
        try:
            client_sock.close()
        except Exception:
            pass

def start_port80_gateway(target_port=8000):
    """Binds to standard HTTP port 80 to enable domain-like URLs (http://localhost/ and http://k-sentinel.local/)."""
    try:
        server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server.bind(("0.0.0.0", 80))
        server.listen(128)
        print("[Gateway] Standard HTTP Port 80 is active! Accessible via:")
        print("          - http://localhost/")
        print("          - http://flowsense.local/ (with domain setup)")
        print("          - http://trustgraph.local/ (with domain setup)")
        print("          - http://k-sentinel.local/ (legacy alias)")
        while True:
            client_sock, _ = server.accept()
            threading.Thread(target=handle_port80_client, args=(client_sock, "127.0.0.1", target_port), daemon=True).start()
    except Exception as e:
        print(f"[Gateway] Notice: Port 80 forwarder skipped ({e}). Using Port {target_port}.")

def open_browser(url):
    time.sleep(1.8)
    print(f"\n[Browser] Opening {url} in your default browser...")
    try:
        webbrowser.open(url)
    except Exception:
        pass

if __name__ == "__main__":
    print("==================================================================")
    print("  K-NEXUS | FlowSense & TrustGraph")
    print("  KBTG Kampus Hackathon 2026 — Track 2: Data Science & Intelligence")
    print("==================================================================")
    
    # Read PORT from environment (default 8000 for local, dynamic on Render)
    target_port = int(os.environ.get("PORT", 8000))
    
    # Start Port 80 gateway in background thread (local only)
    if target_port == 8000:
        p80_thread = threading.Thread(target=start_port80_gateway, args=(8000,), daemon=True)
        p80_thread.start()
        time.sleep(0.3)

    # Determine launch URL
    launch_url = f"http://localhost:{target_port}/" if target_port != 8000 else "http://localhost/"
    
    if "--no-browser" not in sys.argv and "RENDER" not in os.environ:
        threading.Thread(target=open_browser, args=(launch_url,), daemon=True).start()
    
    # Run FastAPI server on 0.0.0.0:target_port
    uvicorn.run("src.app_v2:app", host="0.0.0.0", port=target_port, reload=False)
