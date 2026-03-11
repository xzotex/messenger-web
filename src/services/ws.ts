const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080'

type MessageCallback = (msg: { from: string; to: string; text: string }) => void

class WsService {
  private ws: WebSocket | null = null
  private onMessageCb: MessageCallback | null = null

  connect(token: string) {
    this.ws = new WebSocket(`${WS_URL}/ws?token=${token}`)
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      this.onMessageCb?.(msg)
    }
  }

  disconnect() {
    this.ws?.close()
    this.ws = null
  }

  send(to: string, text: string) {
    this.ws?.send(JSON.stringify({ type: 'send_message', to, text }))
  }

  onMessage(cb: MessageCallback) {
    this.onMessageCb = cb
  }
}

export const wsService = new WsService()
