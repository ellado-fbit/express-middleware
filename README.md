Some useful Express middlewares.

## Middlewares

| middleware    | description                                           |
|---------------|-------------------------------------------------------|
| ipv4          | Extracts IP address and converts IPv6 format to IPv4. |

## Install

```bash
npm install @fundaciobit/express-middleware
```

## IPv4
Middleware to extract the IPv4 address from the request object (it converts IPv6 format to IPv4 format). The extracted address will be available on the request via the `ipv4` property.

```js
const express = require('express')
const { ipv4 } = require('@fundaciobit/express-middleware')

const app = express()

app.use(ipv4())

app.get('/ip', (req, res) => {
  const { ipv4 } = req
  res.json({ ipv4 })
})

app.use((err, req, res, next) => {
  res.status(500).send(`Error: ${err.message}`)
})

const port = 3000
app.listen(port, () => { console.log(`Server running on port ${port}...`) })

```
