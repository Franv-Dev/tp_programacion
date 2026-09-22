const URL_BASE = 'http://localhost:3000'

export async function api(ruta, metodo = 'GET', body) {
  const respuesta = await fetch(URL_BASE + ruta, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await respuesta.json()

  if (!respuesta.ok) {
    const mensaje = Array.isArray(data.message)
      ? data.message.join(', ')
      : data.message
    throw new Error(mensaje || 'Error en la API')
  }

  return data
}
