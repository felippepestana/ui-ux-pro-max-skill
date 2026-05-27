import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import DestemidosPioneirosSite from './sites/destemidos-pioneiros/DestemidosPioneirosSite.tsx'

const isDestemidos = window.location.pathname.startsWith('/destemidos-pioneiros')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isDestemidos ? <DestemidosPioneirosSite /> : <App />}
  </React.StrictMode>,
)
