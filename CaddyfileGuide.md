# Guide: Caddyfile

## What is this file?
`Caddyfile` is the **configuration file for Caddy** — a web server/reverse proxy that sits in front of your Next.js app in this sandbox environment. It handles incoming HTTP requests and forwards them to the right place.

## What's in it?
```
:81 {
    @transform_port_query {
        query XTransformPort=*
    }

    handle @transform_port_query {
        reverse_proxy localhost:{query.XTransformPort} {
            header_up Host {host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
            header_up X-Real-IP {remote_host}
        }
    }

    handle {
        reverse_proxy localhost:3000 {
            header_up Host {host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
            header_up X-Real-IP {remote_host}
        }
    }
}
```

## What does each part do?

### `:81`
Caddy listens on port 81. This is the "gateway" port that the outside world connects to.

### `@transform_port_query { query XTransformPort=* }`
Defines a "matcher" named `transform_port_query` that matches any request with a `XTransformPort` query parameter in the URL. For example: `/api/test?XTransformPort=3030`

### `handle @transform_port_query { ... }`
For requests that match the matcher (have `XTransformPort` in the URL), forward them to `localhost:{query.XTransformPort}` — meaning the port number from the query parameter.

This is how **mini-services** work. If you have a WebSocket service running on port 3003, you'd request `/api/socket?XTransformPort=3003` and Caddy forwards it to port 3003.

### `handle { ... }`
For all OTHER requests (no `XTransformPort` parameter), forward them to `localhost:3000` — which is the Next.js dev server.

### `header_up` lines
These pass along the original request information to the backend:
- `Host {host}` — the original domain name
- `X-Forwarded-For {remote_host}` — the visitor's real IP address
- `X-Forwarded-Proto {scheme}` — whether the request was HTTP or HTTPS
- `X-Real-IP {remote_host}` — the visitor's real IP (duplicate of above, different header name)

## Why does this file exist?
In this sandbox, only ONE port can be exposed externally (port 81). But the project might have multiple services running on different ports:
- Next.js on port 3000 (the main app)
- WebSocket services on ports 3001, 3002, etc. (mini-services)

Caddy acts as a traffic cop: it receives all requests on port 81 and forwards them to the right internal port based on the `XTransformPort` query parameter.

## When would you edit this file?
**Never, probably.** This file is part of the sandbox infrastructure. If you add a mini-service, you use the `XTransformPort` query parameter in your fetch calls — you don't edit the Caddyfile.

## Common beginner questions

**Q: What is a reverse proxy?**
A: A server that sits between the user and your app. The user talks to Caddy (port 81), and Caddy talks to Next.js (port 3000) on the user's behalf. This is useful for load balancing, SSL termination, and routing multiple services through one port.

**Q: Why port 81 and not port 80 or 443?**
A: Ports 80 and 443 require root privileges. Port 81 is a non-privileged alternative that still works for HTTP.

**Q: What is `XTransformPort`?**
A: It's a custom query parameter name. When you make an API call to a mini-service, you add `?XTransformPort=3030` to the URL. Caddy sees this and forwards the request to port 3030 instead of 3000. This is documented in the fullstack-dev skill instructions.
