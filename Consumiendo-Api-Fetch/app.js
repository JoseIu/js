const btn = document.querySelector('#button');
const content = document.querySelector('.content');

const mostrarHTML = datos => {
	const fragment = document.createDocumentFragment();

	datos.forEach(element => {
		const { author, author_url, post_url } = element;
		const article = document.createElement('article');

		article.classList.add('card');
		article.innerHTML = /*html */ `
        <h2 class="card__title">${author}</h2>
		<div class="card__btns">
			<a class="card__btn"  target="_blank" href="${author_url}">Autor</a>
			<a class="card__btn"  target="_blank" href="${post_url}">Ver imagen</a>
		</div>`;

		fragment.append(article);
	});
	content.append(fragment);
};

const consumirApi = () => {
	const url = 'https://picsum.photos/list';

	fetch(url)
		.then(respuesta => respuesta.json())
		.then(datos => mostrarHTML(datos));
};

btn.addEventListener('click', consumirApi);
