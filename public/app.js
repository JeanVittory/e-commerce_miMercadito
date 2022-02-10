const cards = document.getElementById("cards");
const templateCards = document.getElementById("template-cards").content;
const fragment = document.createDocumentFragment();

document.addEventListener("DOMContentLoaded", ()=>{
    fetchData();
}) 

//Función que solicita informacion del db.json
const fetchData = async()=>{
    try {
        const res = await fetch('db.json');
        const data = await res.json();
        pintarCards(data);
        sumarCantidadesKg();
        restarCantidadesKg();
        sumarCantidadesUnd();
        restarCantidadesUnd();
    } catch (error) {
        console.log(error)
    }
}

//Funcion que usa la info de db.json para renderizar en pantalla la data
const pintarCards = data =>{
    data.forEach(element => {
        const clone = templateCards.cloneNode(true)
        templateCards.querySelector('.id-gen').dataset.id = element.id;
        templateCards.querySelector('.id-gen').dataset.unidades = element.UnidadDePeso
        templateCards.querySelector('img').setAttribute('src', element.imagen);
        templateCards.querySelector('img').setAttribute('alt', "producto")
        templateCards.querySelector('#dscto').textContent = element.Descuento;   
        templateCards.querySelector('#titulo-card').textContent = element.Nombre;
        templateCards.querySelector('#precio-antes').textContent = element.PrecioAntes.toFixed(3);
        templateCards.querySelector('#precio-ahora').textContent = element.PrecioDespues.toFixed(3)
        templateCards.querySelector('#unidades').textContent = element.UnidadDePeso;
        templateCards.querySelector('#btn-less').dataset.id = element.id;
        templateCards.querySelector('#btn-less').dataset.unidades = element.UnidadDePeso;
        templateCards.querySelector("#cantidadProducto").dataset.quantity = `cantidad${element.id}`
        templateCards.querySelector('#btn-increased').dataset.id = element.id;
        templateCards.querySelector('#btn-increased').dataset.unidades = element.UnidadDePeso
        fragment.appendChild(clone)
        
    });

    cards.appendChild(fragment)
}

//Función que suma 1 libra a los productos catalogados en KG desde el .JSON
const sumarCantidadesKg = ()=>{   
    const btnsIncreased = document.querySelectorAll("#btn-increased");
    btnsIncreased.forEach(btn=>{
        btn.addEventListener("click", e =>{                     
            const idBtnIncreased = e.target.parentNode.dataset.id;
            const idUnidades = e.target.parentNode.dataset.unidades;
            const quantityBtnIncreased = document.querySelector(`#cantidadProducto[data-quantity=cantidad${idBtnIncreased}]`);
            const valueIncreased = parseFloat(quantityBtnIncreased.innerHTML);
            //Aqui se valida el tipo de unidad de peso, si el producto esta en KG se ejecuta la suma de 1 libra.
            if(idUnidades === "Kg"){
                quantityBtnIncreased.textContent = valueIncreased + 0.5; 
            }
        })
    })  
}

//Función que resta 1 libra a los productos catalogados en KG desde el .JSON
const restarCantidadesKg = ()=>{
    const btnsDecreased = document.querySelectorAll("#btn-less")
    btnsDecreased.forEach(btn =>{
        btn.addEventListener("click", e =>{
            const idBtnDecreased = e.target.parentNode.dataset.id;
            const idUnidades = e.target.parentNode.dataset.unidades;
            const quantityBtnDecreased = document.querySelector(`#cantidadProducto[data-quantity=cantidad${idBtnDecreased}]`);
            const valueDecreased = parseFloat(quantityBtnDecreased.innerHTML);
            if(idUnidades === "Kg"){
                if(quantityBtnDecreased.textContent > 0){
                    quantityBtnDecreased.textContent = valueDecreased - 0.5;
                }
            }
        })
    })
}

//Función que suma 1 unidad a los productos catalogados en UND desde el .JSON
const sumarCantidadesUnd = ()=>{
    const btnsIncreased = document.querySelectorAll('#btn-increased')
    btnsIncreased.forEach(btn =>{
        btn.addEventListener("click", e =>{
            const idBtnIncreased = e.target.parentNode.dataset.id;
            const idUnidades = e.target.parentNode.dataset.unidades;
            const quantityBtnIncreased = document.querySelector(`#cantidadProducto[data-quantity=cantidad${idBtnIncreased}]`);
            const valueIncreased = parseInt(quantityBtnIncreased.innerHTML);
            if(idUnidades === "Und"){
                quantityBtnIncreased.textContent = valueIncreased + 1;
            }
        })
    })
}

//Función que resta 1 unidad a los productos catalogados en UND desde el .JSON
const restarCantidadesUnd = ()=>{
    const btnsDecreased = document.querySelectorAll("#btn-less")
    btnsDecreased.forEach(btn =>{
        btn.addEventListener("click", e =>{
            const idBtnDecreased = e.target.parentNode.dataset.id;
            const idUnidades = e.target.parentNode.dataset.unidades;
            const quantityBtnDecreased = document.querySelector(`#cantidadProducto[data-quantity=cantidad${idBtnDecreased}]`);
            const valueDecreased = parseInt(quantityBtnDecreased.innerHTML);
            if(idUnidades === "Und"){
                if(quantityBtnDecreased.textContent > 0){
                    quantityBtnDecreased.textContent = valueDecreased - 1;
                }
            }
        })
    })
}

//Este objeto esta enfocado a ser dinámico en funcion de lo que el cliente vaya agregando desde el DOM
let productosComprados = [];    
      
    
// Función que aumentara .5 cada vez que el cliente de click en el '+' de la tarjeta en cada producto calculado en KG
    
// Función que aumentara .5 cada vez que el cliente de click en el '+' de la tarjeta en cada producto calculado en KG
const restaKilogramos = () =>{
    if(contadorKg === 0) return 0;
    if(contadorKg > 0) return contadorKg -= 0.5;
}    
    
// Función que aumentara de 1 en 1 cada vez que el cliente de click en el '+' de la tarjeta en cada producto calculado en unidades
let contadorUnidades = 0;
const SumaUnidades = () =>{
    return contadorUnidades += 1;
}    
    
// Función que disminuira de 1 en 1 cada vez que el cliente de click en el '-' de la tarjeta en cada producto calculado en unidades
const RestaUnidades = () =>{
    if(contadorUnidades > 0 ) return contadorUnidades -= 1;
    if(contadorUnidades === 0) return 0;
}
    
// Función que retorna el total de la cantidad comprada por el cliente:
const cantidadTotal = ()=>{
    const sumaCantidades = productosComprados.reduce((acc, {cantidad}) => acc + cantidad , 0);
    return sumaCantidades;
};
//Función que retorna el subtotal de lo comprado por el cliente:
const subTotal = () =>{
    const sumaTotal = productosComprados.reduce((acc, {precio, cantidad}) => acc + precio*cantidad, 0);
    return sumaTotal.toFixed(3);
};    
    
// Esta funcion retorna el impuesto expresado en pesos el cual será sumado al gran total
const ivaCalculado = ()=>{
    const resultadoIva = (subTotal() * 19) / 100;
    return resultadoIva.toFixed(3);
}    
    
//Funcion que retorna el total despues del impuesto de IVA (19% col)
const granTotal = ()=>{
    const granTotal = parseFloat(parseFloat(subTotal())) + parseFloat(ivaCalculado());
    return granTotal.toFixed(3);
}
    
    
    


