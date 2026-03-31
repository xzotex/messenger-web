const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080'

const RECONNECT_DELAY_MS = 2000
const MAX_RECONNECT_DELAY_MS = 30000

type MessageCallback = (msg: { from: string; chat_id: string; text: string }) => void

class WsService {
  private ws: WebSocket | null = null
  private onMessageCb: MessageCallback | null = null
  private token: string | null = null
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private reconnectDelay = RECONNECT_DELAY_MS
  private manualClose = false

  connect(token: string) {
    this.token = token
    this.manualClose = false
    this.reconnectDelay = RECONNECT_DELAY_MS
    this._open()
  }

  private _open() {
    if (!this.token) return

    this.ws = new WebSocket(`${WS_URL}/ws?token=${this.token}`)

    this.ws.onopen = () => {
      this.reconnectDelay = RECONNECT_DELAY_MS
    }

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      this.onMessageCb?.(msg)
    }

    this.ws.onclose = () => {
      if (this.manualClose) return
      this.reconnectTimer = setTimeout(() => {
        this.reconnectDelay = Math.min(this.reconnectDelay * 2, MAX_RECONNECT_DELAY_MS)
        this._open()
      }, this.reconnectDelay)
    }

    this.ws.onerror = () => {
      this.ws?.close()
    }
  }

  disconnect() {
    this.manualClose = true
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.ws?.close()
    this.ws = null
    this.token = null
  }

  send(chatId: string, text: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'send_message', chat_id: chatId, text }))
    }
  }

  onMessage(cb: MessageCallback) {
    this.onMessageCb = cb
  }
}

export const wsService = new WsService()
