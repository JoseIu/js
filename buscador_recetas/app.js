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
};

const seleccionarCategoria = e => {
	const categoriaValor = e.target.value;

	const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoriaValor}`;

	fetch(url)
		.then(resultado => resultado.json())
		.then(datos => mostrarCategorias(datos.meals));
};

const mostrarCategorias = recetas => {
	console.log(recetas);
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
		const { strMeal, strMealThumb } = dato;

		const card = document.createElement('article');
		card.classList.add('card');
		card.innerHTML = /*html*/ `
            <div class="card__image">
                <img class="card__img" src="${strMealThumb}" loading="lazy" alt="${strMeal}"/>
            </div>
            <div class="card__info">
                <h3 class="card__title">${strMeal}</h3>
                <button class="card__btn" type="button">Ver Receta</button>
            </div>
        `;
		fragment.append(card);
	});
	console.log(fragment);
	div.append(fragment);
	resultados.append(titleResultados);
	resultados.append(div);
};

document.addEventListener('DOMContentLoaded', () => {
	iniciarAPP();
});
