const cards = document.getElementById('cards');
const cantidadProducto = document.getElementById('cantidadProducto');
const navContainer = document.getElementById('navContainer');
let basketNumber = document.getElementById('basketNumber');
const templateCards = document.getElementById('template-cards').content;
const fragment = document.createDocumentFragment();
// This array is focused on being dynamic depending on what the client adds from the DOM
let productosComprados = JSON.parse(localStorage.getItem('listaProductos')) || {};

document.addEventListener('DOMContentLoaded', (e) => {
	fetchData();
	cards.addEventListener('click', (e) => {
		addCarrito(e);
	});
	navContainer.addEventListener('click', (e) => {
		btnAlertDisabled(e);
	});
	getLocalStorage();
});

//Function that requests information from the db.json
const fetchData = async () => {
	try {
		const res = await fetch(
			'https://raw.githubusercontent.com/JeanVittory/e-commerce_miMercadito/main/public/db.json'
		); //this line works to fetch the db.json from github and so the github page reads the db.json
		//const res = await fetch("public/db.json"); //activate this line if you want to run the db.json locally
		const data = await res.json();
		pintarCards(data);
		sumarCantidadesKg();
		restarCantidadesKg();
		sumarCantidadesUnd();
		restarCantidadesUnd();
		filterProducts();
	} catch (error) {
		return error;
	}
};

//Function that uses the info from db.json to render the data on the screen
const pintarCards = (data) => {
	data.forEach((element) => {
		templateCards.querySelector('article').dataset.grupoFiltro = element.Grupo;
		templateCards.querySelector('img').setAttribute('src', element.imagen);
		templateCards.querySelector('img').setAttribute('alt', 'producto');
		templateCards.querySelector('#dscto').textContent = element.Descuento;
		templateCards.querySelector('#titulo-card').textContent = element.Nombre;
		templateCards.querySelector('#precio-antes').textContent = element.PrecioAntes.toFixed(3);
		templateCards.querySelector('#precio-ahora').textContent = element.PrecioDespues.toFixed(3);
		templateCards.querySelector('#unidades').textContent = element.UnidadDePeso;
		templateCards.querySelector('#btn-less').dataset.id = element.id;
		templateCards.querySelector('#btn-less').dataset.unidades = element.UnidadDePeso;
		templateCards.querySelector('#cantidadProducto').dataset.quantity = `cantidad${element.id}`;
		templateCards.querySelector('#btn-increased').dataset.id = element.id;
		templateCards.querySelector('#btn-increased').dataset.unidades = element.UnidadDePeso;
		templateCards.querySelector('.btn-comprar').dataset.id = element.id;
		const clone = templateCards.cloneNode(true);
		fragment.appendChild(clone);
	});
	cards.appendChild(fragment);
};

//This function fires the alert if the user tries to complete a purchase without adding any product to the cart
const btnAlertDisabled = (e) => {
	if (e.target.classList.contains('anchorEndBuy')) {
		Toastify({
			text: 'Debes ingresar un producto a la canasta',
			duration: 3000,
			close: false,
			gravity: 'top', // `top` or `bottom`
			position: 'right', // `left`, `center` or `right`
			stopOnFocus: true, // Prevents dismissing of toast on hover
			style: {
				background: 'linear-gradient(to right, #FF4848, #f5ac6d)',
			},
			onClick: function () {}, // Callback after click
		}).showToast();
	}
};

//This function filters the products according to the data attributes set in the html and line 31
const filterProducts = () => {
	const btnsFilter = document.querySelectorAll('.btn');
	const productos = document.querySelectorAll('.producto');

	for (let i of btnsFilter) {
		i.addEventListener('click', (e) => {
			e.preventDefault();
			const filter = e.target.dataset.filter;
			productos.forEach((producto) => {
				filter === 'todos'
					? producto.classList.add('mostrar')
					: producto.dataset.grupoFiltro !== filter
					? (producto.classList.remove('mostrar'), producto.classList.add('hidden'))
					: (producto.classList.remove('mostrar'), producto.classList.remove('hidden'));
			});
			selectedCategories(e);
		});
	}
};

//This function toggles classes to reference the filter selected by the user. The default launch is the "ALL" tab
const selectedCategories = (e) => {
	const btns = document.querySelectorAll('.btn');
	for (let a of btns) {
		e.target.classList.replace('unselected-category', 'selected-category');
		a.classList.replace('selected-category', 'unselected-category');
	}
};

//Function that adds 1 pound to the products cataloged in KG from the .JSON
const sumarCantidadesKg = () => {
	const btnsIncreased = document.querySelectorAll('#btn-increased');
	btnsIncreased.forEach((btn) => {
		btn.addEventListener('click', (e) => {
			const idBtnIncreased = e.target.parentNode.dataset.id;
			const idUnidades = e.target.parentNode.dataset.unidades;
			const quantityBtnIncreased = document.querySelector(
				`#cantidadProducto[data-quantity=cantidad${idBtnIncreased}]`
			);
			const valueIncreased = parseFloat(quantityBtnIncreased.innerHTML);
			//Here the type of weight unit is validated, if the product is in KG, the sum of 1 pound is executed.
			if (idUnidades === 'Kg') quantityBtnIncreased.textContent = valueIncreased + 0.5;
		});
	});
};

//Function that subtracts 1 pound from the products cataloged in KG from the .JSON
const restarCantidadesKg = () => {
	const btnsDecreased = document.querySelectorAll('#btn-less');
	btnsDecreased.forEach((btn) => {
		btn.addEventListener('click', (e) => {
			const idBtnDecreased = e.target.parentNode.dataset.id;
			const idUnidades = e.target.parentNode.dataset.unidades;
			const quantityBtnDecreased = document.querySelector(
				`#cantidadProducto[data-quantity=cantidad${idBtnDecreased}]`
			);
			const valueDecreased = parseFloat(quantityBtnDecreased.innerHTML);
			//this validation was done because i want that the subtracts only work if the cart has more than 0 products
			if (idUnidades === 'Kg') {
				if (quantityBtnDecreased.textContent > 0)
					quantityBtnDecreased.textContent = valueDecreased - 0.5;
			}
		});
	});
};

//Function that adds 1 unit to the products cataloged in UND from the .JSON
const sumarCantidadesUnd = () => {
	const btnsIncreased = document.querySelectorAll('#btn-increased');
	btnsIncreased.forEach((btn) => {
		btn.addEventListener('click', (e) => {
			const idBtnIncreased = e.target.parentNode.dataset.id;
			const idUnidades = e.target.parentNode.dataset.unidades;
			const quantityBtnIncreased = document.querySelector(
				`#cantidadProducto[data-quantity=cantidad${idBtnIncreased}]`
			);
			const valueIncreased = parseInt(quantityBtnIncreased.innerHTML);
			if (idUnidades === 'Und') quantityBtnIncreased.textContent = valueIncreased + 1;
		});
	});
};

//Function that subtracts 1 unit from the products cataloged in UND from the .JSON
const restarCantidadesUnd = () => {
	const btnsDecreased = document.querySelectorAll('#btn-less');
	btnsDecreased.forEach((btn) => {
		btn.addEventListener('click', (e) => {
			const idBtnDecreased = e.target.parentNode.dataset.id;
			const idUnidades = e.target.parentNode.dataset.unidades;
			const quantityBtnDecreased = document.querySelector(
				`#cantidadProducto[data-quantity=cantidad${idBtnDecreased}]`
			);
			const valueDecreased = parseInt(quantityBtnDecreased.innerHTML);
			if (idUnidades === 'Und') {
				if (quantityBtnDecreased.textContent > 0) quantityBtnDecreased.textContent = valueDecreased - 1;
			}
		});
	});
};

//this function captures the html element that will be used as the constructor of the object in setCart
const addCarrito = (e) => {
	if (e.target.classList.contains('btn-comprar')) {
		setCarrito(e.target.parentElement);
	}
	e.stopPropagation();
};

//This function creates an object for each purchased product and adds it to the productosComprados array
const setCarrito = (productos) => {
	//Aqui se valida de que el usuario no intente agregar un producto con cantidad 0
	if (productos.querySelector('#cantidadProducto').textContent !== '0') {
		const producto = {
			id: productos.querySelector('.btn-comprar').dataset.id,
			nombre: productos.querySelector('h2').textContent,
			precio: productos.querySelector('#precio-ahora').textContent,
			cantidad: parseFloat(productos.querySelector('#cantidadProducto').textContent),
			unidad: productos.querySelector('#unidades').textContent,
		};
		//here it is validated if the product already exists in the productosComprados array
		productosComprados.hasOwnProperty(producto.id)
			? (producto.cantidad =
					parseFloat(productosComprados[producto.id].cantidad) + parseFloat(producto.cantidad))
			: //This function sets the localStorage when the product does not exist in the array productosComprados
			  numberCarrito();
		//This line resets the amount of the card in the DOM
		productos.querySelector('#cantidadProducto').textContent = 0;
		//this line adds the object to the productosComprados array
		productosComprados[producto.id] = { ...producto };
		//This line saves the cart in the localStorage
		localStorage.setItem('listaProductos', JSON.stringify(productosComprados));
		//This line executes the sweeAlert library to notify that the product has been added
		Toastify({
			text: 'Se ha agregado el producto',
			duration: 3000,
			close: false,
			gravity: 'top', // `top` or `bottom`
			position: 'right', // `left`, `center` or `right`
			stopOnFocus: true, // Prevents dismissing of toast on hover
			style: {
				background: 'linear-gradient(to right, #8711c1, #2472fc)',
			},
			onClick: function () {}, // Callback after click
		}).showToast();
	} else {
		//this line executes the sweetAlert library in case the user tries to add a product with quantity 0
		Toastify({
			text: 'No has indicado una cantidad a comprar',
			duration: 3000,
			close: false,
			gravity: 'top', // `top` or `bottom`
			position: 'right', // `left`, `center` or `right`
			stopOnFocus: true, // Prevents dismissing of toast on hover
			style: {
				background: 'linear-gradient(to right, #FF4848, #f5ac6d)',
			},
			onClick: function () {}, // Callback after click
		}).showToast();
	}
};

//This function sets the localStorage when the product does not exist in the productosComprados array and increases the number in the cart
const numberCarrito = () => {
	const btnComprar = document.getElementById('btnComprar');
	const anchorEndBuy = document.getElementById('anchorEndBuy');
	//This line visually enables the "buy" button
	if (btnComprar.classList.contains('btn-buy-disable')) {
		btnComprar.classList.remove('btn-buy-disable');
		btnComprar.classList.remove('btn-buy-disable');
		btnComprar.classList.add('btn-buy-able');
		localStorage.setItem('btnClassActive', 'btn-buy-able');
	}

	if (anchorEndBuy.classList.contains('anchorEndBuy')) {
		anchorEndBuy.classList.remove('anchorEndBuy');
		anchorEndBuy.setAttribute('href', 'public/pages/deliverySection.html');
		localStorage.setItem('hrefDelivery', 'public/pages/deliverySection.html');
	}
	let pseudoNumberStorage = basketNumber.textContent;
	let resultado = parseInt(pseudoNumberStorage) + 1;
	basketNumber.textContent = resultado;
	localStorage.setItem('#productosComprados', resultado);
};

//This function is called on DOM load to retrieve data from localStorage
const getLocalStorage = () => {
	let productsStorageQuantity = JSON.parse(localStorage.getItem('#productosComprados'));
	let btnClassActive = localStorage.getItem('btnClassActive');

	switch (productsStorageQuantity) {
		case NaN:
			basketNumber.textContent = 0;
			break;
		case null:
			basketNumber.textContent = 0;
			break;
		default:
			basketNumber.textContent = productsStorageQuantity;
			break;
	}

	if (productsStorageQuantity > 0) {
		btnComprar.classList.add(btnClassActive);
		anchorEndBuy.setAttribute('href', 'public/pages/deliverySection.html');
		anchorEndBuy.classList.remove('anchorEndBuy');
	}
};
