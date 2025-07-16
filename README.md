# Singer

Singer is an open-source telegram bot that converts v2ray url into sing-box configuration files.

Just send your v2ray url and get that sing box configuration file to use it in sing box official clients 😃

## Supported Protocols

It can convert these common v2ray protocols and transports to Singbox configuration.

Protocols:

- VLESS
- VMESS
- Trojan

Transports:

- TCP / TCP with http header
- Http-Upgrade
- gRPC
- WebSocket

Security layers:

- None
- TLS
- Reality

## Deploy

1. Install [Bun](https://bun.sh) first.

2. Clone this repository.

3. Touch `.env` file in the bot directory.

4. Paste `BOT_TOKEN=your_bot_token` in that.

5. Run these commands:

```bash
  bun i

  bun start
```
