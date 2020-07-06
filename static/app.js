const BASE_URL = 'http://127.0.0.1:5000/';
const defaultImage = 'https://tinyurl.com/demo-cupcake';

/** given data about a cupcake, generate html */

function generateCupcakeHTML(cupcake) {
	return `
      <div data-cupcake-id=${cupcake.id}>
        <li>
          ${cupcake.flavor} / ${cupcake.size} / ${cupcake.rating}
          <button class="delete-button">Remove</button>
        </li>
        <img class="Cupcake-img"
              src="${cupcake.image}"
              alt="(no image provided)"
              height="200px" width="200px">
      </div>
    `;
}

/** put initial cupcakes on page. */

async function showInitialCupcakes() {
	const response = await axios.get(`${BASE_URL}/api/cupcakes`);

	for (let cupcakeData of response.data.cupcakes) {
		let newCupcake = $(generateCupcakeHTML(cupcakeData));
		$('#cupcakes-list').append(newCupcake);
	}
}

/** handle form for adding of new cupcakes */

$('#new-cupcake-form').on('submit', async function(evt) {
	evt.preventDefault();

	let flavor = $('#form-flavor').val();
	let rating = $('#form-rating').val();
	let size = $('#form-size').val();
	let image = $('#form-image').val();
	image = image ? image : defaultImage;

	const newCupcakeResponse = await axios.post(`${BASE_URL}/api/cupcakes`, {
		flavor,
		rating,
		size,
		image
	});

	let newCupcake = $(generateCupcakeHTML(newCupcakeResponse.data.cupcake));
	$('#cupcakes-list').append(newCupcake);
	$('#new-cupcake-form').trigger('reset');
});

/** handle clicking delete: delete cupcake */

$('#cupcakes-list').on('click', '.delete-button', async function(evt) {
	evt.preventDefault();

	let $cupcake = $(evt.target).closest('div');
	let cupcakeId = $cupcake.attr('data-cupcake-id');

	await axios.delete(`${BASE_URL}/api/cupcakes/${cupcakeId}`);
	$cupcake.remove();
});

$(showInitialCupcakes);

// my code

// const $body = $('body');
// const defaultImage = 'https://tinyurl.com/demo-cupcake';

// let resp = await axios.get('/api/cupcakes');
// let cupcakes = resp.data.cupcakes;

// const $listContainerDiv = $('<div id="#list-container"></div>');
// const $formContainerDiv = $('<div id="#form-container"></div>');
// $body.append($formContainerDiv, $listContainerDiv);

// const $createCupcakeForm = $(`
//     <form id="create-cupcake-form" class="cupcake-form">
//         <h4>Create Cupcake</h4>
//         <div class="login-input">
//             <label for="create-cupcake-flavor">Flavor</label>
//             <input id="create-cupcake-flavor" type="text">
//         </div>
//         <div class="login-input">
//             <label for="create-cupcake-size">Size</label>
//             <input id="create-cupcake-size" type="text">
//         </div>
//         <div class="login-input">
//             <label for="create-cupcake-rating">Rating</label>
//             <input id="create-cupcake-rating" type="text">
//         </div>
//         <div class="login-input">
//             <label for="create-cupcake-image">Image URL</label>
//             <input id="create-cupcake-image" type="text">
//         </div>
//         <button type="submit" id="create-cupcake" formaction="/api/cupcakes" formmethod="POST">Create Cupcake</button>
//     </form>
// `);

// $formContainerDiv.append($createCupcakeForm);
// // create ol to display cupcakes data and append to body
// const $ol = $('<ol></ol>');
// $listContainerDiv.append($ol);

// // iterate over cupcakes data to create list
// for (item of cupcakes) {
//     // create li and append to ordered list
//     const $titleLi = $(`
//         <li><strong>${item.flavor}</strong> - <button class="delete-cupcake" data-id="${item.id}">Remove</button></li>
//     `);
//     $ol.append($titleLi);

//     // create ul for second level for details
//     const $ul = $('<ul></ul>');
//     $titleLi.append($ul);

//     // append details to list
//     const $detailLi = $(`
//         <li><img src="${item.image}" height="50px" width="50px"></li>
//         <li>Size: ${item.size}</li>
//         <li>Rating: ${item.rating}</li>
//     `);
//     $ul.append($detailLi);
// }

// $createCupcakeForm.on('submit', async function(evt) {
//     evt.preventDefault(); // no page refresh
//     // grab the required fields
//     let flavor = $('#create-cupcake-flavor').val();
//     let size = $('#create-cupcake-size').val();
//     let rating = $('#create-cupcake-rating').val();
//     let image = $('#create-cupcake-image').val();
//     image = image ? image : defaultImage;
//     // call the create method, which calls the API and then builds a new user instance
//     newCupcake = await axios({
//         method: 'post',
//         url: '/api/cupcakes',
//         data: {
//             flavor,
//             size,
//             rating,
//             image
//         }
//     });
// });

// $('.delete-cupcake').click(deleteCupcake);

// async function deleteCupcake() {
//     const id = $(this).data('id');
//     await axios.delete(`/api/cupcakes/${id}`);
//     $(this).parent().remove();
// }
