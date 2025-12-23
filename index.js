export function federationReload({
  role = "host", // "host" | "remote"
  wsPort = 3333,
  appName = "remote",
  debounceMs = 50,
} = {}) {
  if (!role) {
    throw new Error("[mfe-host-reload] You MUST pass role: 'host' or 'remote'");
  }

  let timer;
  let socket;
  let wss;

  return {
    name: "vite-plugin-mfe-host-reload",
    apply: "serve",

    async configureServer(server) {
      // ================= HOST =================
      if (role === "host") {
        const { WebSocketServer } = await import("ws");

        wss = new WebSocketServer({ port: wsPort });

        console.log(`🔄 MFE reload server running at ws://localhost:${wsPort}`);

        wss.on("connection", (ws) => {
          ws.on("message", (raw) => {
            try {
              const msg = JSON.parse(raw.toString());

              if (msg.type === "remote-change") {
                console.log(`🔁 Remote "${msg.app}" changed → reloading host`);

                server.ws.send({ type: "full-reload" });
              }
            } catch {
              // ignore junk
            }
          });
        });

        server.httpServer?.once("close", () => {
          wss.close();
        });
      }

      // ================= REMOTE =================
      if (role === "remote") {
        const { WebSocket } = await import("ws");

        socket = new WebSocket(`ws://localhost:${wsPort}`);

        socket.on("error", () => {
          // host might not be up yet — acceptable
        });

        server.watcher.on("change", (file) => {
          if (file.includes("node_modules")) return;

          clearTimeout(timer);
          timer = setTimeout(() => {
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(
                JSON.stringify({
                  type: "remote-change",
                  app: appName,
                  file,
                })
              );
            }
          }, debounceMs);
        });
      }
    },
  };
}
