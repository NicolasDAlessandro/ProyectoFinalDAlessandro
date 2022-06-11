// Declaracion de variables

const divRemeras = document.querySelector('#remeras')
const batman = document.querySelector('#batman')
const anime = document.querySelector('#anime')
const simpsons = document.querySelector('#simpsons')
const series = document.querySelector('#series')
const buzos = document.querySelector('#buzos')
const botonTodos = document.querySelector('.botonTodos')
const botonBatman = document.querySelector('.botonBatman')
const botonSimpsons = document.querySelector('.botonSimpsons')
const botonAnime = document.querySelector('.botonAnime')
const botonSerie = document.querySelector('.botonSerie')
const botonBuzos = document.querySelector('.botonBuzos')
const mostrarRemeras = document.querySelector('#mostrar')
const botonMostrar = document.querySelector('#botonMostrar')
const divTotal = document.querySelector(".totalCompra")
let carrito = JSON.parse(localStorage.getItem('carrito')) ?? []
const cartasProductos = []
const finalizarCompra = document.querySelector('.botonComprar')
const cantidadAgregada = document.querySelector('#cantidadAgregada')

/* 
Utilizo fetch para acceder al archivo JSON y a partir de la informacion guardada
en el archivo creo los productos que se van a ir guardando en un array cartasProductos
y genero tarjetas de productos para visualizar en el html
*/
fetch(`json/productos.json`, {
    headers : { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
     }
  })
.then(response => response.json())
.then(productos => {
    productos.forEach((producto) => {
        let {id, src, tematica, modelo, precio,tipo} = producto
        let prod = {id : id, src : src, tematica : tematica, modelo : modelo, precio : precio, tipo : tipo }
        cartasProductos.push(prod)
        let remera = crearCartas(id,src,tematica,modelo,precio,tipo)
        let cardRemera = document.createElement('div') 
        cardRemera.innerHTML = remera 
        divRemeras.append(cardRemera)
        cardRemera.querySelector(`#agregar${id}`).addEventListener('click',agregarAlCarrito)
    
    });  
})

/*
Llamo a las funciones comprobarCarrito y actualizarCantindad, para acceder al localStorage
y revisar si hay productos que hayan quedado guardados y mostralos
*/
comprobarCarrito()
actualizarCantidad()

/*
La funcion agregarAlCarrito toma las propiedades del producto, revisa si este ya fue agregado y en el caso
de no encontrarse agregado genera una tarjeta en el carrito, donde se puede visualizar que productos
fueron agregados, modificar la cantidad y talle.
*/ 
function agregarAlCarrito(e){
    const boton = e.target
    const producto = boton.closest(".content") 
    const src = producto.querySelector('#img').src
    const modelo = producto.querySelector('#modelo').textContent
    const precio = producto.querySelector('.precioRemera').textContent
    const productosAgregado = cartasProductos.find((remera) => remera.modelo === modelo)
    if(carrito.find((remera) => remera.modelo === modelo)){
        toastme.error("Ese producto ya fue agregado!")
    }else {
        carrito.push(productosAgregado)
        localStorage.setItem('carrito',JSON.stringify(carrito))
        const cardDiv = document.createElement('div')
        const card =`
        <div id="tarjetaCarrito">
            <div class="content2">
                <img src=${src} style="width:130px;height:130px">
                <p id="modelo">${modelo}</p>
                <div class="divPrecio">
                    <h6> $ </h6>
                    <h6 class="precioRemera"> ${precio}</h6>
                </div>
                <button class="buy-1" id="eliminar">Eliminar</button>
            </div>
            <div class="cantidad">
                <label for="">Cantidad</label>
                <input type="number" id="cantidadProductos" value="1" min="1" style="width:50px">
                <label for="Talles">Talle:</label>
                <select name="Talles" id="">
                    <option value="">S</option>
                    <option value="">M</option>
                    <option value="">L</option>
                    <option value="">XL</option>
                </select>
            </div>
        </div>`
        cardDiv.innerHTML = card
        mostrarRemeras.append(cardDiv)
        cardDiv.querySelector('#eliminar').addEventListener('click',eliminarProd)
        cardDiv.querySelector('#cantidadProductos').addEventListener('click',aumentarCantidad)
        toastme.success("Producto agregado al carrito!")
    }
    consultarPrecio()
    comprobarCarrito()
    actualizarCantidad()
}


/*
Para comprobar si hay productos guardados de forma local y mostrarlos
*/ 
carrito.forEach(remera => {
    let cardDiv = document.createElement('div')
    let card =`
    <div id="tarjetaCarrito">
        <div class="content2">
            <img src="Imagenes/${remera.src}" style="width:130px;height:130px">
            <p id="modelo">${remera.modelo}</p>
            <div class="divPrecio">
                <h6> $ </h6>
                <h6 class="precioRemera"> ${remera.precio}</h6>
            </div>
            <button class="buy-1" id="eliminar">Eliminar</button>
        </div>
    <div class="cantidad">
        <label for="">Cantidad</label>
        <input type="number" id="cantidadProductos" value="1" min="1" style="width:50px">
        <label for="Talles">Talle:</label>
            <select name="Talles" id="">
                <option value="">S</option>
                <option value="">M</option>
                <option value="">L</option>
                <option value="">XL</option>
            </select>
        </div>
    </div>
    `
    cardDiv.innerHTML = card
    mostrarRemeras.append(cardDiv)
    cardDiv.querySelector('#eliminar').addEventListener('click',eliminarProd)
    cardDiv.querySelector('#cantidadProductos').addEventListener('click',aumentarCantidad)
    consultarPrecio()
});

/*
En finalizarCompra se pide confirmar la compra mostrando el costo acumulado, en caso de confirmarse
la compra el localStorage se vacia y comenzamos de cero
*/ 
finalizarCompra.addEventListener('click',() =>{
    Swal.fire({
        title: `¿Desea confirmar la compra?\n ${divTotal.textContent} `,
        showDenyButton: true,
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire('Compra exitosa!')
          localStorage.clear()
          location.reload()
        }
      })
    
})


function aumentarCantidad(e){
    const boton = e.target
    boton.closest('#cantidadProductos')
    const cantidadAumentada = boton.value
    consultarPrecio(cantidadAumentada)
}

function eliminarProd(e){
    const boton = e.target
    boton.closest('#tarjetaCarrito').remove()
    const producto = boton.closest(".content2")
    const modelo = producto.querySelector('#modelo').textContent
    const carritoModificado = carrito.filter((remera) => remera.modelo !== modelo)
    carrito = carritoModificado
    localStorage.setItem('carrito',JSON.stringify(carrito))
    consultarPrecio()
    comprobarCarrito()
    actualizarCantidad()
}

function consultarPrecio(){
    let total = 0
    const tarjetasCarrito = document.querySelectorAll('#tarjetaCarrito')
    tarjetasCarrito.forEach((tarjeta) => {
        const precioRemera = parseInt(tarjeta.querySelector('.precioRemera').textContent)
        const cantidadRemeras = (parseInt(tarjeta.querySelector('#cantidadProductos').value))
        total = total + precioRemera * cantidadRemeras
    })
    if(total === 0){ 
        divTotal.innerHTML = `<p> No hay productos agregados! </p>`
    }else{
    divTotal.innerHTML = `<p>El total de su compra es $ ${total} </p> `
    }
}

function actualizarCantidad(){
    const agregados = carrito.length
    if(carrito.length === 0){
        cantidadAgregada.innerHTML = ''
    }else{
        cantidadAgregada.innerHTML = `${agregados}`   
    }
}

function comprobarCarrito(){
    if(carrito.length === 0){
        finalizarCompra.style.display = "none"
    }else {
        finalizarCompra.style.display = "block"
    }
}

function crearCartas(id,src,tematica,modelo,precio,tipo){
    let remera = `
        <div class="content ${tipo}" id="id${id}">
            <img src="Imagenes/${src}" class="img" id="img">
            <h3 id="tematica">${tematica}</h3>
            <p class="modelo" id="modelo">${modelo}</p>
            <div class="divPrecio">
                <h6> $ </h6>
                <h6 class="precioRemera"> ${precio}</h6>
            </div>
            <button class="buy-1" id="agregar${id}">Añadir al carrito</button>
        </div>
        ` 
    return remera
}

// Agregue eventos para filtar productos

botonTodos.addEventListener('click',(e) =>{
    e.preventDefault()
    divRemeras.style.display = "block"
    batman.style.display = "none"
    anime.style.display = "none"
    simpsons.style.display = "none"
    series.style.display = "none"
    buzos.style.display = "none"
})

botonAnime.addEventListener('click',(e) =>{
    e.preventDefault()
    anime.style.display = "block"
    divRemeras.style.display = "none"
    batman.style.display = "none"
    simpsons.style.display = "none"
    series.style.display = "none"
    buzos.style.display = "none"
    if(anime.innerHTML.length > 1){
        //pass
    }else {
        let arrayMod = cartasProductos.filter(carta => carta.tematica === "Anime")
        arrayMod.forEach((prod) =>{
        let remera = crearCartas(prod.id,prod.src,prod.tematica,prod.modelo,prod.precio,prod.tipo)
        let cardRemera = document.createElement('div') 
        cardRemera.innerHTML = remera 
        anime.append(cardRemera)
        cardRemera.querySelector(`#agregar${prod.id}`).addEventListener('click',agregarAlCarrito)
        })
    }
})

botonBatman.addEventListener('click',(e) =>{
    e.preventDefault()
    batman.style.display = "block"
    divRemeras.style.display = "none"
    anime.style.display = "none"
    simpsons.style.display = "none"
    series.style.display = "none"
    buzos.style.display = "none"
    if(batman.innerHTML.length > 1){
        //pass
    }else {
        let arrayMod = cartasProductos.filter(carta => carta.tematica === "The Batman")
        arrayMod.forEach((prod) =>{
        let remera = crearCartas(prod.id,prod.src,prod.tematica,prod.modelo,prod.precio,prod.tipo)
        let cardRemera = document.createElement('div') 
        cardRemera.innerHTML = remera 
        batman.append(cardRemera)
        cardRemera.querySelector(`#agregar${prod.id}`).addEventListener('click',agregarAlCarrito)
        })
    }
})

botonSimpsons.addEventListener('click',(e) =>{
    e.preventDefault()
    simpsons.style.display = "block"
    divRemeras.style.display = "none"
    anime.style.display = "none"
    batman.style.display = "none"
    buzos.style.display = "none"
    series.style.display = "none"
    if(simpsons.innerHTML.length > 1){
        //pass
    }else {
        let arrayMod = cartasProductos.filter(carta => carta.tematica === "The Simpsons")
        arrayMod.forEach((prod) =>{
        let remera = crearCartas(prod.id,prod.src,prod.tematica,prod.modelo,prod.precio,prod.tipo)
        let cardRemera = document.createElement('div') 
        cardRemera.innerHTML = remera 
        simpsons.append(cardRemera)
        cardRemera.querySelector(`#agregar${prod.id}`).addEventListener('click',agregarAlCarrito)
        })
    }  
})

botonSerie.addEventListener('click',(e) =>{
    e.preventDefault()
    simpsons.style.display = "none"
    divRemeras.style.display = "none"
    anime.style.display = "none"
    batman.style.display = "none"
    buzos.style.display = "none"
    series.style.display = "block"
    if(series.innerHTML.length > 1){
        //pass
    }else {
        let arrayMod = cartasProductos.filter(carta => carta.tematica === "Series y Peliculas")
        arrayMod.forEach((prod) =>{
        let remera = crearCartas(prod.id,prod.src,prod.tematica,prod.modelo,prod.precio,prod.tipo)
        let cardRemera = document.createElement('div') 
        cardRemera.innerHTML = remera 
        series.append(cardRemera)
        cardRemera.querySelector(`#agregar${prod.id}`).addEventListener('click',agregarAlCarrito)
        })
    }  
})

botonBuzos.addEventListener('click',(e) =>{
    e.preventDefault()
    simpsons.style.display = "none"
    divRemeras.style.display = "none"
    anime.style.display = "none"
    batman.style.display = "none"
    buzos.style.display = "block"
    series.style.display = "none"
    if(buzos.innerHTML.length > 1){
        //pass
    }else {
        let arrayMod = cartasProductos.filter(carta => carta.tipo === "buzo")
        arrayMod.forEach((prod) =>{
        let remera = crearCartas(prod.id,prod.src,prod.tematica,prod.modelo,prod.precio,prod.tipo)
        let cardRemera = document.createElement('div') 
        cardRemera.innerHTML = remera 
        buzos.append(cardRemera)
        cardRemera.querySelector(`#agregar${prod.id}`).addEventListener('click',agregarAlCarrito)
        })
    }  
})