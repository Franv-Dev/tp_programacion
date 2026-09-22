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

const TIPOS = ['physical', 'digital', 'service']

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [error, setError] = useState('')

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [tipo, setTipo] = useState('physical')

  const [busqueda, setBusqueda] = useState('')
  const [precioMin, setPrecioMin] = useState('')
  const [precioMax, setPrecioMax] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')

  async function cargar() {
    try {
      setProductos(await api('/products'))
      setError('')
    } catch (e) {
      setError(e.message)
    }
  }

  async function cargarCategorias() {
    try {
      setCategorias(await api('/categories'))
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    cargar()
    cargarCategorias()
  }, [])

  async function crear() {
    try {
      await api('/products', 'POST', {
        name: nombre,
        description: descripcion,
        price: Number(precio),
        stock: Number(stock),
        categoryId: Number(categoriaId),
        type: tipo,
      })
      setNombre('')
      setDescripcion('')
      setPrecio('')
      setStock('')
      cargar()
    } catch (e) {
      setError(e.message)
    }
  }

  async function borrar(id) {
    try {
      await api('/products/' + id, 'DELETE')
      cargar()
    } catch (e) {
      setError(e.message)
    }
  }

  async function buscar() {
    try {
      setProductos(await api('/products/search?name=' + busqueda))
      setError('')
    } catch (e) {
      setError(e.message)
    }
  }

  async function filtrarPorPrecio() {
    try {
      setProductos(
        await api('/products?minPrice=' + precioMin + '&maxPrice=' + precioMax),
      )
      setError('')
    } catch (e) {
      setError(e.message)
    }
  }

  async function filtrarPorCategoria(id) {
    setFiltroCategoria(id)
    try {
      setProductos(await api('/products/category/' + id))
      setError('')
    } catch (e) {
      setError(e.message)
    }
  }

  function nombreCategoria(id) {
    const categoria = categorias.find((c) => c.id === id)
    return categoria ? categoria.name : id
  }

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Nuevo producto
        </Typography>
        <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <TextField
            label="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
          <TextField
            label="Precio"
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
          <TextField
            label="Stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <TextField
            select
            label="Categoría"
            sx={{ minWidth: 160 }}
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
          >
            {categorias.map((categoria) => (
              <MenuItem key={categoria.id} value={categoria.id}>
                {categoria.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Tipo"
            sx={{ minWidth: 140 }}
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            {TIPOS.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" onClick={crear}>
            Crear
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Buscar y filtrar
        </Typography>
        <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
          <TextField
            label="Buscar por nombre"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <Button onClick={buscar}>Buscar</Button>
          <TextField
            label="Precio mín."
            type="number"
            value={precioMin}
            onChange={(e) => setPrecioMin(e.target.value)}
          />
          <TextField
            label="Precio máx."
            type="number"
            value={precioMax}
            onChange={(e) => setPrecioMax(e.target.value)}
          />
          <Button onClick={filtrarPorPrecio}>Filtrar</Button>
          <TextField
            select
            label="Por categoría"
            sx={{ minWidth: 160 }}
            value={filtroCategoria}
            onChange={(e) => filtrarPorCategoria(e.target.value)}
          >
            {categorias.map((categoria) => (
              <MenuItem key={categoria.id} value={categoria.id}>
                {categoria.name}
              </MenuItem>
            ))}
          </TextField>
          <Button onClick={cargar}>Ver todos</Button>
        </Stack>
      </Paper>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.id}>
                <TableCell>{producto.id}</TableCell>
                <TableCell>{producto.name}</TableCell>
                <TableCell>
                  <Chip label={producto.type} size="small" />
                </TableCell>
                <TableCell>{nombreCategoria(producto.categoryId)}</TableCell>
                <TableCell align="right">${producto.price}</TableCell>
                <TableCell align="right">{producto.stock}</TableCell>
                <TableCell align="right">
                  <Button color="error" onClick={() => borrar(producto.id)}>
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
