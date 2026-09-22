import { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Productos from './components/Productos.jsx'
import Categorias from './components/Categorias.jsx'
import Pedidos from './components/Pedidos.jsx'

export default function App() {
  const [tab, setTab] = useState(0)

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">TP NestJS - Tienda</Typography>
        </Toolbar>
        <Tabs
          value={tab}
          onChange={(evento, valor) => setTab(valor)}
          textColor="inherit"
          indicatorColor="secondary"
        >
          <Tab label="Productos" />
          <Tab label="Categorías" />
          <Tab label="Pedidos" />
        </Tabs>
      </AppBar>

      <Container sx={{ py: 3 }}>
        <Box hidden={tab !== 0}>{tab === 0 && <Productos />}</Box>
        <Box hidden={tab !== 1}>{tab === 1 && <Categorias />}</Box>
        <Box hidden={tab !== 2}>{tab === 2 && <Pedidos />}</Box>
      </Container>
    </>
  )
}
