const templateProducts = document.getElementById("template-products").content;
const templateBill = document.getElementById("template-bill").content;
//const templateListHeader = document.getElementById("template-list-Header").content
const sectionProducts = document.getElementById("section-products");
const productsCart = JSON.parse(localStorage.getItem("listaProductos"));
const fragment = document.createDocumentFragment(); 


Object.values(productsCart).forEach(e => {
    console.log(e)
    templateProducts.querySelector("#product").textContent = e.nombre;
    templateProducts.querySelector("#quantity").textContent = e.cantidad;
    templateProducts.querySelector("#type").textContent = e.unidad;
    templateProducts.querySelector("#price").textContent = e.precio;
    const clone = templateProducts.cloneNode(true);
    fragment.appendChild(clone)
});
sectionProducts.appendChild(fragment)


