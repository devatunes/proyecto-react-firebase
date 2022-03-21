//import { specialCharMap } from '@testing-library/user-event/dist/keyboard';
import React from 'react';
import { firebase } from './Firebase';

function App() {
  const [nombres, setNombres] = React.useState('')
  const [apellidos, setApellidos] = React.useState('')
  const [edad, setEdad] = React.useState('')
  const [identificacion, setIdentificacion] = React.useState('')
  const [celular, setCelular] = React.useState('')
  const [correo, setCorreo] = React.useState('')
  const [direccion, setDireccion] = React.useState('')
  const [alumnos, setAlumnos] = React.useState([])
  const [id, setId] = React.useState('')
  const [error, setError] = React.useState(null)
  const [modoEdicion, setModoEdicion] = React.useState(false)

  const obtenerDatos = async () => {
    try{
      const db = firebase.firestore()
      const data = await db.collection('alumnos').get()
      const arrayData = data.docs.map(doc => ({id: doc.id, ...doc.data()}))
      setAlumnos(arrayData)
      console.log(arrayData)

    }
    catch(error){
      console.log(error)
    }
  }

  React.useEffect(()=>{
    
    obtenerDatos()

  }, [])

  const agregarAlumno = async (e) => {
    e.preventDefault()

    if(!(nombres.trim()&&apellidos.trim()&&edad.trim()&&identificacion.trim()&&celular.trim()&&correo.trim()&&direccion.trim())){
      setError('Digite los datos faltantes')
      return
    }

    try{
        const db = firebase.firestore()
        const nuevoAlumno = {
            nombresAlumno:nombres, 
            apellidosAlumno:apellidos, 
            edadAlumno:edad, 
            identificacionAlumno:identificacion, 
            celularAlumno:celular, 
            correoAlumno:correo, 
            direccionAlumno:direccion
        }
 
        const data = await db.collection('alumnos').add(nuevoAlumno)

        setAlumnos([
        ...alumnos,
        {id: data.id, ...nuevoAlumno}
        ])

        setNombres('')
        setApellidos('')
        setEdad('')
        setIdentificacion('')
        setCelular('')
        setCorreo('')
        setDireccion('')
        setId('')
        setError(null)
    }
    catch(error){
        console.log(error)
    }
}

  const eliminarAlumno = id => {
    const arrayAux = alumnos.filter(item => item.id !== id)
    setAlumnos(arrayAux)
    setModoEdicion(false)
    setNombres('')
    setApellidos('')
    setEdad('')
    setIdentificacion('')
    setCelular('')
    setCorreo('')
    setDireccion('')
    setId('')
    setError(null)
  }

  const editar = item =>{
    setError(null)
    setModoEdicion(true)
    setNombres(item.nombresAlumno)
    setApellidos(item.apellidosAlumno)
    setEdad(item.edadAlumno)
    setIdentificacion(item.identificacionAlumno)
    setCelular(item.celularAlumno)
    setCorreo(item.correoAlumno)
    setDireccion(item.direccionAlumno)
    setId(item.id)
  }

  const cancelar = () =>{
    setModoEdicion(false)
    setNombres('')
    setApellidos('')
    setEdad('')
    setIdentificacion('')
    setCelular('')
    setCorreo('')
    setDireccion('')
    setId('')
    setError(null)
  }

  const editarAlumno = e =>{
    e.preventDefault()
    if(!(nombres.trim()&&apellidos.trim()&&edad.trim()&&identificacion.trim()&&celular.trim()&&correo.trim()&&direccion.trim())){
      setError('Digite los datos faltantes')
      return
    }  

    const arrayEditado = alumnos.map(
      item => item.id=== id ? {id:id, nombresAlumno:nombres, apellidosAlumno:apellidos, edadAlumno:edad, identificacionAlumno:identificacion, celularAlumno:celular, correoAlumno:correo, direccionAlumno:direccion} : item
      )

      setAlumnos(arrayEditado)
      setNombres('')
      setApellidos('')
      setEdad('')
      setIdentificacion('')
      setCelular('')
      setCorreo('')
      setDireccion('')
      setId('')
      setError(null)
      setModoEdicion(false)
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center">ALUMNOS</h1>
      <hr />
      <div className="row">
        <div className="col-8">
          <h4 className="text-center">Listados de alumnos</h4>
          <ul className="list-group">
            {
              alumnos.map(item => (
                <li className="list-group-item" key={item.id}>
                  <span className="lead">{item.nombresAlumno}</span>    
                      <button 
                        className='btn btn-danger btn-sm float-end mx-2'
                        onClick={() => eliminarAlumno(item.id)}>Eliminar</button>
                      <button 
                      className='btn btn-warning btn-sm float-end'
                      onClick ={() => editar(item)}>Editar</button>
                </li>
              ))
            }
          </ul>
        </div>
        <div className="col-4">
          <h4 className="text-center">
            {
              modoEdicion ? 'Editar Alumno' : 'Agregar Alumnno'
            }
          </h4>
          <form onSubmit={modoEdicion ? editarAlumno : agregarAlumno}>
            {
              error ? <span className='text-danger'>{error}</span> : null
            }

            <input
              type="text"
              className='form-control mb-2'
              placeholder='Ingrese nombres'
              onChange={e => setNombres(e.target.value)}
              value = {nombres}
            />
            <input
              type="text"
              className='form-control mb-2'
              placeholder='Ingrese apellidos'
              onChange={e => setApellidos(e.target.value)}
              value = {apellidos}
            />
            <input
              type="number"
              className='form-control mb-2'
              placeholder='Ingrese edad'
              onChange={e => setEdad(e.target.value)}
              value = {edad}
            />
            <input
              type="number"
              className='form-control mb-2'
              placeholder='Ingrese identificación'
              onChange={e => setIdentificacion(e.target.value)}
              value = {identificacion}
            />
            <input
              type="number"
              className='form-control mb-2'
              placeholder='Ingrese celular'
              onChange={e => setCelular(e.target.value)}
              value = {celular}
            />
            <input
              type="mail"
              className='form-control mb-2'
              placeholder='Ingrese correo'
              onChange={e => setCorreo(e.target.value)}
              value = {correo}
            />
            <input
              type="text"
              className='form-control mb-2'
              placeholder='Ingrese dirección'
              onChange={e => setDireccion(e.target.value)}
              value = {direccion}
            />
            

            {
              modoEdicion ?
              (<>
                <button
                className="btn btn-warning btn-block" 
                type='submit'>Editar</button>
                <button
                className="btn btn-dark btn-block mx-2" 
                onClick ={() => cancelar()}>Cancelar</button>
                </>)
                : 
                (<button
                  className="btn btn-dark btn-block" 
                  type='submit'>Agregar</button>
                  )
            }
            
          </form>
        </div>
      </div>
      
    </div>
  );
}

export default App;