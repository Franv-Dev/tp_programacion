import { useEffect, useState } from 'react'
import { api } from '../api.js'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

export default function Categorias() {
  const [categorias, setCategorias] = useState([])
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [error, setError] = useState('')

  async function cargar() {
    try {
      setCategorias(await api('/categories'))
      setError('')
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  async function crear() {
    try {
      await api('/categories', 'POST', { name: nombre, description: descripcion })
      setNombre('')
      setDescripcion('')
      cargar()
    } catch (e) {
      setError(e.message)
    }
  }

  async function borrar(id) {
    try {
      await api('/categories/' + id, 'DELETE')
      cargar()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Nueva categoría
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
          <Button variant="contained" onClick={crear}>
            Crear
          </Button>
        </Stack>
      </Paper>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {categorias.map((categoria) => (
              <TableRow key={categoria.id}>
                <TableCell>{categoria.id}</TableCell>
                <TableCell>{categoria.name}</TableCell>
                <TableCell>{categoria.description}</TableCell>
                <TableCell align="right">
                  <Button color="error" onClick={() => borrar(categoria.id)}>
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
