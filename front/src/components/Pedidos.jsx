import { useEffect, useState } from 'react'
import { api } from '../api.js'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

const TIPOS_CLIENTE = [
  { valor: 'regular', texto: 'Regular (0%)' },
  { valor: 'student', texto: 'Estudiante (10%)' },
  { valor: 'premium', texto: 'Premium (20%)' },
  { valor: 'blackFriday', texto: 'Black Friday (30%)' },
]

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([])
  const [productos, setProductos] = useState([])
  const [error, setError] = useState('')

  const [productoId, setProductoId] = useState('')
  const [cantidad, setCantidad] = useState('1')
  const [tipoCliente, setTipoCliente] = useState('regular')

  async function cargar() {
    try {
      setPedidos(await api('/orders'))
      setError('')
    } catch (e) {
      setError(e.message)
    }
  }

  async function cargarProductos() {
    try {
      setProductos(await api('/products'))
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    cargar()
    cargarProductos()
  }, [])

  async function comprar() {
    try {
      await api('/orders', 'POST', {
        items: [
          { productId: Number(productoId), quantity: Number(cantidad) },
        ],
        customerType: tipoCliente,
      })
      cargar()
      cargarProductos()
    } catch (e) {
      setError(e.message)
    }
  }

  async function cancelar(id) {
    try {
      await api('/orders/' + id, 'PUT', { status: 'cancelled' })
      cargar()
      cargarProductos()
    } catch (e) {
      setError(e.message)
    }
  }

  async function borrar(id) {
    try {
      await api('/orders/' + id, 'DELETE')
      cargar()
    } catch (e) {
      setError(e.message)
    }
  }

  function colorEstado(estado) {
    if (estado === 'paid') return 'success'
    if (estado === 'cancelled') return 'error'
    return 'default'
  }

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Nuevo pedido
        </Typography>
        <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
          <TextField
            select
            label="Producto"
            sx={{ minWidth: 280 }}
            value={productoId}
            onChange={(e) => setProductoId(e.target.value)}
          >
            {productos.map((producto) => (
              <MenuItem key={producto.id} value={producto.id}>
                {producto.name} - ${producto.price} (stock: {producto.stock})
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Cantidad"
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />
          <TextField
            select
            label="Tipo de cliente"
            sx={{ minWidth: 200 }}
            value={tipoCliente}
            onChange={(e) => setTipoCliente(e.target.value)}
          >
            {TIPOS_CLIENTE.map((tipo) => (
              <MenuItem key={tipo.valor} value={tipo.valor}>
                {tipo.texto}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" onClick={comprar}>
            Comprar
          </Button>
        </Stack>
      </Paper>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell align="right">Subtotal</TableCell>
              <TableCell align="right">Descuento</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Pago</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell>{pedido.id}</TableCell>
                <TableCell>{pedido.customerType}</TableCell>
                <TableCell align="right">${pedido.subtotal}</TableCell>
                <TableCell align="right">${pedido.discount}</TableCell>
                <TableCell align="right">${pedido.total}</TableCell>
                <TableCell>
                  <Chip
                    label={pedido.status}
                    size="small"
                    color={colorEstado(pedido.status)}
                  />
                </TableCell>
                <TableCell>{pedido.paymentTransactionId}</TableCell>
                <TableCell align="right">
                  {pedido.status !== 'cancelled' && (
                    <Button onClick={() => cancelar(pedido.id)}>Cancelar</Button>
                  )}
                  <Button color="error" onClick={() => borrar(pedido.id)}>
                    Borrar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  )
}
