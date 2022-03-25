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
  const [modoMostrar, setModoMostrar] = React.useState(false)

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

  const eliminarAlumno = async(e) => {
    try{
      const db = firebase.firestore()
      await db.collection('alumnos').doc(id).delete()
      const arrayFiltrado = alumnos.filter(item => item.id !== id)
      setAlumnos(arrayFiltrado)
      setModoMostrar(false)
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
    catch(error)
    {
      console.log(error)
    }

  }

  const mostrar = item =>{
    setError(null)
    setModoMostrar(true)
    setNombres(item.nombresAlumno)
    setApellidos(item.apellidosAlumno)
    setEdad(item.edadAlumno)
    setIdentificacion(item.identificacionAlumno)
    setCelular(item.celularAlumno)
    setCorreo(item.correoAlumno)
    setDireccion(item.direccionAlumno)
    setId(item.id)
  }

  const editar = item =>{
    setError(null)
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
      setModoMostrar(false)
    }
    catch(error)
    {
      console.log(error)
    }
  }

  const cancelar = () =>{
    setModoMostrar(false)
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

  // Example starter JavaScript for disabling form submissions if there are invalid fields
  (function () {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) { 
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
        }, false)
        form.classList.add('was-validated')
      })
  })()
 
  return (
    <div className="container mt-1">
      <h1 className="text-center">ALUMNOS</h1>
      <hr />
      <div className="row">
        <div className="col-7">
          <h4 className="text-center">Listado de alumnos</h4>
          <ul className="list-group">
            {
              alumnos.map(item => (
                <li className="list-group-item" key={item.id}>
                  <span className="lead">{item.nombresAlumno} {""} {item.apellidosAlumno}</span>    
                    <button 
                      className='btn btn-warning btn-sm float-end'
                      onClick ={() => mostrar(item)}>Mostrar
                    </button>
                </li>
              ))
            }
          </ul>
        </div>
        <div className="col-5">
          <h4 className="text-center">
            {
              modoMostrar ? 'Mostrar Alumno' : 'Agregar Alumno'
            }
          </h4>
          <form class="needs-validation" novalidate onSubmit={modoMostrar ? editarAlumno : agregarAlumno}>
            {
              error ? <span className='text-danger'>{error}</span> : null
            }

            <div class="form-floating mb-2">
              <input
                type="text"
                pattern="[A-Za-z ]{5,30}"
                className='form-control mb-2'
                onChange={e => setNombres(e.target.value)}
                value = {nombres}
                id="floatingNombres"
                required
              />
              <label for="floatingNombres">Ingrese sus nombres ej. Juan Luis</label>
            </div>
            
            <div class="form-floating mb-2">
              <input
                type="text"
                pattern="[A-Za-z ]{5,30}"
                className='form-control mb-2'
                onChange={e => setApellidos(e.target.value)}
                value = {apellidos}
                id="floatingApellidos"
                required
              />
              <label for="floatingApellidos">Ingrese sus apellidos ej. Perez Ruiz</label>
            </div>

            <div class="form-floating mb-2">
              <input
                type="text"
                pattern='\d{1,2}'
                maxlength="2"
                min='1'
                max='99'
                className='form-control mb-2'
                onChange={e => setEdad(e.target.value)}
                value = {edad}
                id="floatingEdad"
                required
              />
              <label for="floatingEdad">Ingrese su edad ej. 26</label>
            </div>

            <div class="form-floating mb-2">
              <input
                type="tel"
                pattern='\d{7,10}'
                maxlength="10"
                className='form-control mb-2'
                onChange={e => setIdentificacion(e.target.value)}
                value = {identificacion}
                id="floatingIdentificacion"
                required
              />
              <label for="floatingIdentificacion">Ingrese su identificación ej. 1082989235</label>
            </div>

            <div class="form-floating mb-2">
              <input
                type="tel"
                pattern='^[3]\d{9}$'
                maxlength="10"
                className='form-control mb-2'
                onChange={e => setCelular(e.target.value)}
                value = {celular}
                id="floatingCelular"
                required
              />
              <label for="floatingCelular">Ingrese su celular ej. 3003017525</label>
            </div>

            <div class="form-floating mb-2">
              <input
                type="email"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                className='form-control mb-2'
                onChange={e => setCorreo(e.target.value)}
                value = {correo}
                id="floatingCorreo"
                required
              />
              <label for="floatingCorreo">Ingrese su correo ej. alvaro@gmail.com</label>
            </div>

            <div class="form-floating mb-2">
              <input
                type="text"
                className='form-control mb-2'
                onChange={e => setDireccion(e.target.value)}
                value = {direccion}
                id="floatingDireccion"
                required
              />
              <label for="floatingDireccion">Ingrese su dirección ej. CR 17 # 25 - 40</label>
            </div>


            {
              modoMostrar ?
              (<>
                  <button
                    className="btn btn-warning btn-block" 
                    onClick ={() => editar()}>Editar
                  </button>
                  <button 
                    className='btn btn-danger btn-block mx-2'
                    onClick={() => eliminarAlumno()}>Eliminar
                  </button>
                  <button
                    className="btn btn-dark btn-block" 
                    onClick ={() => cancelar()}>Cancelar
                  </button>
                </>
              )
              : 
              (
                <button
                  className="btn btn-dark btn-block" 
                  type='submit'>Agregar
                </button>
              )
            }
                        
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;