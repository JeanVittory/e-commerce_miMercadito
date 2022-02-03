//Este objeto esta enfocado a ser dinámico en funcion de lo que el cliente vaya agregando desde el DOM
let productosComprados = [];

let respuesta = true;

while(respuesta){
    
    if(respuesta){

        const productoNuevo = prompt("Ingresa un nuevo producto: ");
        alert("Ese producto tiene un precio de $13.000 el kilo")
        const precioNuevo = 13.000;
        const cantidadNueva = parseInt(prompt("¿Cuantos kilos quieres comprar?: "));
    
    
        let objetoProductoNuevo = {
            nombre: productoNuevo,
            precio: precioNuevo,
            cantidad: cantidadNueva
        };
    
        productosComprados.push(objetoProductoNuevo)
    
        console.log(productosComprados)
    
    
        // Función que aumentara .5 cada vez que el cliente de click en el '+' de la tarjeta en cada producto calculado en KG
        let contadorKg = 0;
        const sumaKilogramos = () =>{
            return contadorKg += 0.5
        }
    
        console.log(sumaKilogramos());
    
    
        // Función que aumentara .5 cada vez que el cliente de click en el '+' de la tarjeta en cada producto calculado en KG
        const restaKilogramos = () =>{
            if(contadorKg === 0) return 0;
            if(contadorKg > 0) return contadorKg -= 0.5;
        }
    
        console.log(restaKilogramos());
    
    
        // Función que aumentara de 1 en 1 cada vez que el cliente de click en el '+' de la tarjeta en cada producto calculado en unidades
        let contadorUnidades = 0;
        const SumaUnidades = () =>{
            return contadorUnidades += 1;
        }
        console.log(SumaUnidades());
    
    
        // Función que disminuira de 1 en 1 cada vez que el cliente de click en el '-' de la tarjeta en cada producto calculado en unidades
        const RestaUnidades = () =>{
    
            if(contadorUnidades > 0 ) return contadorUnidades -= 1;
            if(contadorUnidades === 0) return 0;
        }
        console.log(RestaUnidades());
    
    
        // Función que retorna el total de la cantidad comprada por el cliente:
        const cantidadTotal = ()=>{
            const sumaCantidades = productosComprados.reduce((acc, {cantidad}) => acc + cantidad , 0);
            return sumaCantidades;
        };
        console.log(cantidadTotal());
    
    
        //Función que retorna el subtotal de lo comprado por el cliente:
        const subTotal = () =>{
            const sumaTotal = productosComprados.reduce((acc, {precio, cantidad}) => acc + precio*cantidad, 0);
            return sumaTotal.toFixed(3);
        };
    
        console.log(subTotal());
    
    
        // Esta funcion retorna el impuesto expresado en pesos el cual será sumado al gran total
        const ivaCalculado = ()=>{
            const resultadoIva = (subTotal() * 19) / 100;
            return resultadoIva.toFixed(3);
        }
    
        console.log(ivaCalculado());
    
    
        //Funcion que retorna el total despues del impuesto de IVA (19% col)
        const granTotal = ()=>{
            const granTotal = parseFloat(parseFloat(subTotal())) + parseFloat(ivaCalculado());
            return granTotal.toFixed(3);
        }
    
        console.log(granTotal());
    
    
        respuesta= confirm(`Tienes en tu carrito de compras ${productosComprados.length} productos listos para ser despachados! el total de tu compra sera de  $${granTotal()} ¿deseas comprar algo más?`);
    }

}

if(!respuesta){
    alert(`Muy bien! hemos despachado tu producto. Te agradecemos por la compra, vuelve pronto!`)
}