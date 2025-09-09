const categoryBtn = document.getElementById('category-buttons');
const cardContainer = document.getElementById('cards');
const allTreesBtn = document.getElementById('all-trees');
const modal = document.getElementById('tree-modal');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');
const cartContainer = document.getElementById('items');
const totalPriceEl = document.getElementById('total-price');
const spinner = document.getElementById('spinner');
const categoryButtons = document.getElementById('category-buttons');

const loadCategory = () => {
  const url = 'https://openapi.programming-hero.com/api/categories';
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      category(data.categories);
    });
};

const category = (categories) => {
  categories.forEach((category) => {
    const li = document.createElement('li');

    li.innerHTML = `
            <button 
                id="category-${category.id}" 
                class="category-btn w-full rounded text-left px-1.5 py-1 block text-gray-800 hover:bg-green-700 cursor-pointer hover:text-white px-3 py-2 rounded" 
                data-id="${category.id}">
                ${category.category_name}
            </button>
        `;

    categoryBtn.appendChild(li);

    // Add click listener here
    const btn = document.getElementById(`category-${category.id}`);
    btn.addEventListener('click', () => {
      loadTreesWithCategoryId(category.id);
      setActiveButton(`category-${category.id}`);
    });
  });
};

const loadTreesWithCategoryId = (categoryId) => {
  showSpinner();
  fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`)
    .then((res) => res.json())
    .then((data) => showTrees(data.plants))
    .finally(() => hideSpinner());
};

const loadTrees = () => {
  showSpinner();
  fetch('https://openapi.programming-hero.com/api/plants')
    .then((res) => res.json())
    .then((data) => showTrees(data.plants))
    .finally(() => hideSpinner());
};

allTreesBtn.addEventListener('click', () => {
  loadTrees();
});

const showTrees = (plants) => {
  cardContainer.innerHTML = '';

  if (!plants || plants.length === 0) {
    cardContainer.innerHTML = `<p class="col-span-3 text-center text-gray-500">No trees available in this category.</p>`;
    return;
  }

  plants.forEach((plant) => {
    const card = document.createElement('div');
    card.classList.add(
      'lg:h-100',
      'w-80',

      'md:mt-0',
      'mt-0',
      'card',
      'flex',
      'flex-col',
      'gap-2',
      'bg-white',
      'p-2',
      'rounded-xl',

      'sm:w-72',
      'md:w-80'
    );
    card.innerHTML = `<img class="w-full h-40 object-cover rounded"" src=${plant.image} alt="" />
              <div class="plant-description flex flex-col gap-2">
                <h4 class="text-[14px] font-semibold cursor-pointer">${plant.name}</h4>
                <p class="text-[12px] min-h-23">${plant.description}</p>
                <div class="category-price flex justify-between items-center">
                  <p class="text-[14px] font-medium py-1 px-3 bg-[#dcfce7] rounded-2xl text-[#15803d]">${plant.category}</p>
                  <p class="font-bold  text-xl">৳<span> ${plant.price}</span></p>
                   
                </div>
              </div>
              <button class="bg-[#15803d] cursor-pointer text-white hover:bg-[#86cea0] py-3 w-full rounded-3xl">Add To Cart</button>`;

    const treeName = card.querySelector('h4');
    treeName.addEventListener('click', () => openModal(plant));

    card
      .querySelector('button')
      .addEventListener('click', () => addToCart(plant));

    cardContainer.appendChild(card);
  });
};

const openModal = (plant) => {
  modalContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">${plant.name}</h2>
        <img class="w-full h-64 object-cover rounded mb-4" src="${plant.image}" alt="${plant.name}" />
        <p class="mb-2"><strong>Category:</strong> ${plant.category}</p>
        <p class="mb-2">
  <strong>Price:  ৳ </strong> 
  ${plant.price}
</p>

        <p><strong>Description:</strong> ${plant.description}</p>
    `;
  modal.classList.remove('hidden');
  modal.classList.add('flex'); // show modal
};

const closeModal = () => {
  modal.classList.add('hidden');
  modal.classList.remove('flex'); // hide modal
};

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

const addToCart = (plant) => {
  let existingItem = Array.from(cartContainer.children).find(
    (item) => item.querySelector('h4').textContent === plant.name
  );

  if (existingItem) {
    const qtyEl = existingItem.querySelector('.item-qty');
    qtyEl.textContent = parseInt(qtyEl.textContent) + 1;
  } else {
    const item = document.createElement('div');
    item.classList.add(
      'item',
      'flex',
      'justify-between',
      'my-2',
      'p-2',
      'rounded',
      'bg-[#f0fdf4]'
    );
    item.dataset.price = plant.price; // store price in data attribute
    item.innerHTML = `
            <div class="item-details flex flex-col">
                <h4>${plant.name}</h4>
                <p>৳<span class="item-price">${plant.price}</span> x <span class="item-qty">1</span></p>
                <div class="qty-controls mt-1 flex gap-2">
                    <button class="decrease bg-gray-300 px-2 rounded">-</button>
                    <button class="increase bg-gray-300 px-2 rounded">+</button>
                </div>
            </div>
            <div class="delete-btn cursor-pointer"><i class="fa-solid fa-xmark"></i></div>
        `;

    // Increase quantity
    item.querySelector('.increase').addEventListener('click', () => {
      const qtyEl = item.querySelector('.item-qty');
      qtyEl.textContent = parseInt(qtyEl.textContent) + 1;
 updateTotal();

     
    });
 alert(`${plant.name} has been added to teh card`);
    // Decrease quantity
    item.querySelector('.decrease').addEventListener('click', () => {
      const qtyEl = item.querySelector('.item-qty');
      let currentQty = parseInt(qtyEl.textContent);
      if (currentQty > 1) {
        qtyEl.textContent = currentQty - 1;
        updateTotal();
      }
    });

    // Delete item
    item.querySelector('.delete-btn').addEventListener('click', () => {
      item.remove();
      updateTotal();
    });

    cartContainer.appendChild(item);
  }

  updateTotal();
};

const updateTotal = () => {
  let total = 0;
  cartContainer.querySelectorAll('.item').forEach((item) => {
    const price = parseFloat(item.dataset.price); // use data-price
    const qty = parseInt(item.querySelector('.item-qty').textContent);
    total += price * qty;
  });
  totalPriceEl.textContent = `৳${total}`;
};

const showSpinner = () => {
  spinner.classList.remove('hidden'); // flex stays
};

const hideSpinner = () => {
  spinner.classList.add('hidden');
};

const setActiveButton = (activeId) => {
  // Remove active style from all buttons
  document.querySelectorAll('.category-btn').forEach((btn) => {
    btn.classList.remove('bg-[#15803d]', 'text-white');
    btn.classList.add('hover:bg-[#00ff5e]');
  });

  // Apply active style to the clicked button by ID
  const activeBtn = document.getElementById(activeId);
  if (activeBtn) {
    activeBtn.classList.add('bg-[#15803d]', 'text-white');
    activeBtn.classList.remove('hover:bg-[#00ff5e]');
  }
};

document.querySelectorAll('.category-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const categoryId = e.target.dataset.id;

    if (categoryId) {
      loadTreesWithCategoryId(categoryId);
    } else {
      loadTrees(); // All Trees
    }

    // Set active style
    setActiveButton(e.target);
  });
});

allTreesBtn.addEventListener('click', () => {
  loadTrees();
  setActiveButton('all-trees');
});

window.addEventListener('DOMContentLoaded', () => {
  setActiveButton('all-trees');
  loadTrees(); // optional if you want to load all trees initially
});

loadTrees();
loadCategory();
cartContainer.innerHTML = '';
const hamburger = document.getElementById('hamburger');
const categories = document.getElementById('categories');

hamburger.addEventListener('click', () => {
  categories.classList.toggle('hidden');
});
