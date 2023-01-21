const modal = document.querySelector('.modal');
const iniciarAPP = () => {
	const optenerCategorias = () => {
		const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';
		fetch(url)
			.then(resultado => resultado.json())
			.then(datos => llenarSelect(datos.categories));
	};

	optenerCategorias();
};

const llenarSelect = categorias => {
	const categories = document.querySelector('#categories');
	if (categories) {
		categories.addEventListener('change', seleccionarCategoria);
		const fragment = document.createDocumentFragment();

		categorias.forEach(categoria => {
			const { strCategory } = categoria;

			const option = document.createElement('option');
			option.classList.add('form__option');
			option.value = strCategory;
			option.textContent = strCategory;

			fragment.append(option);
		});

		categories.append(fragment);
	}
};

const seleccionarCategoria = e => {
	const categoriaValor = e.target.value;

	const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoriaValor}`;

	fetch(url)
		.then(resultado => resultado.json())
		.then(datos => mostrarCategorias(datos.meals));
};

//Mostradmos las cards
const mostrarCategorias = recetas => {
	limpiarDOM();
	//donde vamos a meter las cards
	const resultados = document.querySelector('.resultados');

	//titulo de Resultados
	const titleResultados = document.createElement('h2');
	titleResultados.classList.add('resultados__title');
	titleResultados.textContent = 'Resultados';

	const div = document.createElement('div');
	div.classList.add('resultados__cotent');

	//Creamos las cardas de cada receta
	const fragment = document.createDocumentFragment();
	recetas.forEach(dato => {
		const { strMeal, strMealThumb, idMeal } = dato;

		const card = document.createElement('article');
		card.classList.add('card');
		card.innerHTML = /*html*/ `
            <div class="card__image">
                <img class="card__img" src="${strMealThumb}" loading="lazy" alt="${strMeal}"/>
            </div>
            <div class="card__info">
                <h3 class="card__title">${strMeal}</h3>
                <button class="card__btn" type="button" onclick = "mostrarModal(${idMeal})" >Ver Receta</button>
            </div>
        `;
		fragment.append(card);
	});

	div.append(fragment);

	resultados.append(titleResultados, div);
};

const limpiarDOM = () => {
	const resultados = document.querySelector('.resultados');
	while (resultados.firstChild) {
		resultados.removeChild(resultados.firstChild);
	}
};

const mostrarModal = id => {
	modal.classList.add('modal--active');
	const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

	fetch(url)
		.then(resultado => resultado.json())
		.then(datos => mostarReceta(datos.meals[0]));

	//Mostramos los datos en el modal
	const mostarReceta = datos => {
		limpiarModal();
		const { idMeal, strMeal, strMealThumb, strInstructions } = datos;

		const modalContainer = document.querySelector('.modal__container');

		//Modal Left
		const modalFelt = document.createElement('div');
		modalFelt.classList.add('modal__left');
		modalFelt.innerHTML = /*html */ `
            <h2 class="modal__title">${strMeal}</h2>
            <img class="modal__img" src="${strMealThumb}" loading="lazy" alt="" />

            <div class="modal__content">
                <h3 class="modal__instructions">Instrucciones</h3>
             	<p class="modal__description"> ${strInstructions}</p>
            </div>
       `;
		//Modal Right
		const modalRight = document.createElement('div');
		modalRight.classList.add('modal__right');

		const h4 = document.createElement('h4');
		h4.classList.add('modal__ingredients');
		h4.textContent = 'Ingredientes Y cantidades';

		const ul = document.createElement('ul');
		ul.classList.add('modal__ul');
		const ulFragment = document.createDocumentFragment();
		for (let i = 1; i <= 20; i++) {
			if (datos[`strIngredient${i}`]) {
				const ingredientes = datos[`strIngredient${i}`];
				const cantidad = datos[`strMeasure${i}`];

				const li = document.createElement('li');
				li.classList.add('modal__li');
				li.textContent = `${ingredientes} - ${cantidad}`;

				ulFragment.append(li);
			}
		}

		ul.append(ulFragment);

		//Modal BTNS
		const modalBtns = document.createElement('div');
		modalBtns.classList.add('modal__btns');

		const btnFav = document.createElement('button');
		btnFav.classList.add('modal__btn');
		btnFav.textContent = existeStorage(idMeal) ? 'Eliminar Favorito' : 'Guardar Favorito';
		btnFav.onclick = () => {
			console.log(existeStorage(idMeal));
			if (existeStorage(idMeal)) {
				eliminarFav(idMeal);
				btnFav.textContent = 'Guardar Favorito';
				return;
			}
			agregarFav({ id: idMeal, titulo: strMeal, img: strMealThumb });
			btnFav.textContent = 'Eliminar Favorito';
		};

		const btnCerrar = document.createElement('button');
		btnCerrar.classList.add('modal__btn', 'modal__btn--grey');
		btnCerrar.textContent = 'Cerrar';
		btnCerrar.onclick = () => {
			cerrarModal();
		};

		modalBtns.append(btnFav, btnCerrar);

		modalRight.append(h4, ul, modalBtns);

		modalContainer.append(modalFelt, modalRight, modalRight);
	};
};

const cerrarModal = () => {
	modal.classList.remove('modal--active');
};
const limpiarModal = () => {
	const modalContainer = document.querySelector('.modal__container');
	while (modalContainer.firstChild) {
		modalContainer.removeChild(modalContainer.firstChild);
	}
};
const agregarFav = receta => {
	console.log(receta);
	const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
	localStorage.setItem('favoritos', JSON.stringify([...favoritos, receta]));
};
const eliminarFav = id => {
	const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
	const nuevosFav = favoritos.filter(favorito => favorito.id !== id);
	console.log(nuevosFav);
	localStorage.setItem('favoritos', JSON.stringify(nuevosFav));
};
const existeStorage = id => {
	const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
	return favoritos.some(favorito => favorito.id === id);
};

const mostrarFav = () => {
	const favoritosContainer = document.querySelector('.favoritos');

	if (favoritosContainer) {
		const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
		const resultadosCotent = document.createElement('div');
		resultadosCotent.classList.add('resultados__cotent');

		favoritos.forEach(fav => {
			const { id, titulo, img } = fav;

			const card = document.createElement('article');
			card.classList.add('card');

			const imgDiv = document.createElement('div');
			imgDiv.classList.add('card__image');
			imgDiv.innerHTML = /*html*/ `
			<img class="card__img" src="${img}" loading="lazy" alt="${titulo}"/>`;

			const btnInfo = document.createElement('div');
			btnInfo.classList.add('card__info');
			const h3 = document.createElement('h3');
			h3.classList.add('card__title');
			h3.textContent = titulo;

			const btn = document.createElement('button');
			btn.classList.add('card__btn');
			btn.textContent = 'Ver Receta';
			btn.onclick = () => {
				mostrarModal(id);
			};
			btnInfo.append(h3, btn);
			card.append(imgDiv, btnInfo);
			resultadosCotent.append(card);
		});
		favoritosContainer.append(resultadosCotent);
	}
};
document.addEventListener('DOMContentLoaded', () => {
	iniciarAPP();
	mostrarFav();
});
