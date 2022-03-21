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

  const eliminarAlumno = async(id) => {
    try{
      const db = firebase.firestore()
      await db.collection('alumnos').doc(id).delete()
      const arrayFiltrado = alumnos.filter(item => item.id !== id)
      setAlumnos(arrayFiltrado)
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
    catch(error){
      console.log(error)
    }

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

  const editarAlumno = async(e) =>{
    e.preventDefault()
    if(!(nombres.trim()&&apellidos.trim()&&edad.trim()&&identificacion.trim()&&celular.trim()&&correo.trim()&&direccion.trim())){
      setError('Digite los datos faltantes')
      return
    }  

    try{
      const db = firebase.firestore()
      await db.collection('alumnos').doc(id).update({
        nombresAlumno:nombres, 
        apellidosAlumno:apellidos, 
        edadAlumno:edad, 
        identificacionAlumno:identificacion, 
        celularAlumno:celular, 
        correoAlumno:correo, 
        direccionAlumno:direccion
      })

      const arrayEditado = alumnos.map(
        item => item.id === id ? {id:id, nombresAlumno:nombres, apellidosAlumno:apellidos, edadAlumno:edad, identificacionAlumno:identificacion, celularAlumno:celular, correoAlumno:correo, direccionAlumno:direccion} : item
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
    catch(error){
      console.log(error)
    }
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
 
  return (
    <div className="container mt-5">
      <h1 className="text-center">ALUMNOS</h1>
      <hr />
      <div className="row">
        <div className="col-8">
          <h4 className="text-center">Listado de alumnos</h4>
          <ul className="list-group">
            {
              alumnos.map(item => (
                <li className="list-group-item" key={item.id}>
                  <span className="lead">{item.nombresAlumno} {""} {item.apellidosAlumno}</span>    
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
              pattern="[A-Za-z ]{5,30}"
              className='form-control mb-2'
              placeholder='Ingrese nombres ej. Juan Luis'
              onChange={e => setNombres(e.target.value)}
              value = {nombres}
            />
            <input
              type="text"
              pattern="[A-Za-z ]{5,30}"
              className='form-control mb-2'
              placeholder='Ingrese apellidos ej. Perez Robles'
              onChange={e => setApellidos(e.target.value)}
              value = {apellidos}
            />
            <input
              type="tel"
              pattern='\d{1,2}'
              maxlength="2"
              min='1'
              max='99'
              className='form-control mb-2'
              placeholder='Ingrese edad ej. 26'
              onChange={e => setEdad(e.target.value)}
              value = {edad}
            />
            <input
              type="tel"
              pattern='\d{7,10}'
              maxlength="10"
              className='form-control mb-2'
              placeholder='Ingrese identificación ej. 1082989235'
              onChange={e => setIdentificacion(e.target.value)}
              value = {identificacion}
            />
            <input
              type="tel"
              pattern='^[3]\d{9}$'
              maxlength="10"
              className='form-control mb-2'
              placeholder='Ingrese celular ej. 3003017525'
              onChange={e => setCelular(e.target.value)}
              value = {celular}
            />
            <input
              type="email"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              className='form-control mb-2'
              placeholder='Ingrese correo ej. alvaro@gmail.com'
              onChange={e => setCorreo(e.target.value)}
              value = {correo}
            />
            <input
              type="text"
              className='form-control mb-2'
              placeholder='Ingrese dirección ej. CR 17 # 25 - 40'
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