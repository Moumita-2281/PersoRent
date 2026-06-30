const vehicles = [
  {
    name: 'Yamaha MT-15',
    type: 'bike',
    location: 'Kestopur, Kolkata',
    price: 899,
    deposit: 3000,
    rating: 4.8,
    emoji: '🏍️',
    tags: ['Helmet included', 'Verified owner', 'Manual'],
    description: 'Sporty 155cc bike, perfect for city rides and short trips.'
  },
  {
    name: 'Honda Activa 6G',
    type: 'scooter',
    location: 'Salt Lake Sector V',
    price: 499,
    deposit: 1500,
    rating: 4.7,
    emoji: '🛵',
    tags: ['Easy pickup', 'Great mileage', 'Verified'],
    description: 'Clean scooter for office commute, errands and daily use.'
  },
  {
    name: 'Royal Enfield Classic 350',
    type: 'bike',
    location: 'New Town, Kolkata',
    price: 1299,
    deposit: 4500,
    rating: 4.9,
    emoji: '🏍️',
    tags: ['Touring ready', 'Photo proof', 'Verified'],
    description: 'Comfortable cruiser for weekend rides and highway trips.'
  },
  {
    name: 'Maruti Swift',
    type: 'car',
    location: 'Dumdum, Kolkata',
    price: 2199,
    deposit: 8000,
    rating: 4.6,
    emoji: '🚗',
    tags: ['AC', '5 seats', 'Manual'],
    description: 'Compact hatchback for family visits and city travel.'
  },
  {
    name: 'TVS Ntorq 125',
    type: 'scooter',
    location: 'Baguiati, Kolkata',
    price: 599,
    deposit: 2000,
    rating: 4.7,
    emoji: '🛵',
    tags: ['Bluetooth', 'Sporty', 'Verified'],
    description: 'Fun scooter with quick acceleration and good storage.'
  },
  {
    name: 'Hyundai i20',
    type: 'car',
    location: 'Park Street, Kolkata',
    price: 2599,
    deposit: 10000,
    rating: 4.8,
    emoji: '🚙',
    tags: ['Automatic', 'AC', 'Premium'],
    description: 'Premium hatchback with smooth automatic gearbox.'
  }
];

const vehicleGrid = document.getElementById('vehicleGrid');
const typeFilter = document.getElementById('typeFilter');
const filterPills = document.getElementById('filterPills');
const dateInput = document.getElementById('dateInput');

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

function renderVehicles(filter = 'all') {
  const filtered = filter === 'all' ? vehicles : vehicles.filter(vehicle => vehicle.type === filter);
  vehicleGrid.innerHTML = filtered.map(vehicle => `
    <article class="vehicle-card" data-type="${vehicle.type}">
      <div class="vehicle-image" aria-hidden="true">${vehicle.emoji}</div>
      <div class="vehicle-card-content">
        <h3>${vehicle.name}</h3>
        <p>${vehicle.location} · ⭐ ${vehicle.rating}</p>
        <p>${vehicle.description}</p>
        <div class="vehicle-meta">
          ${vehicle.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="vehicle-footer">
          <div class="vehicle-price">
            <strong>${formatCurrency(vehicle.price)}</strong>
            <span>per day · deposit ${formatCurrency(vehicle.deposit)}</span>
          </div>
          <button class="btn btn-primary" data-book="${vehicle.name}">Book</button>
        </div>
      </div>
    </article>
  `).join('');
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal(modal) {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
}

function setBooking(vehicleName) {
  const vehicle = vehicles.find(item => item.name === vehicleName) || vehicles[0];
  const fee = Math.round(vehicle.price * 0.15);
  document.getElementById('bookingTitle').textContent = `Book ${vehicle.name}`;
  document.getElementById('rentAmount').textContent = formatCurrency(vehicle.price);
  document.getElementById('depositAmount').textContent = formatCurrency(vehicle.deposit);
  document.getElementById('feeAmount').textContent = formatCurrency(fee);
  document.getElementById('bookingNote').textContent = '';
  openModal('bookingModal');
}

function setActiveFilter(filter) {
  document.querySelectorAll('.pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.filter === filter);
  });
  typeFilter.value = filter;
  renderVehicles(filter);
}

function initializeDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.value = `${yyyy}-${mm}-${dd}`;
}

document.addEventListener('click', event => {
  const scrollTarget = event.target.closest('[data-scroll]');
  if (scrollTarget) {
    document.querySelector(scrollTarget.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' });
  }

  const modalButton = event.target.closest('[data-open-modal]');
  if (modalButton) openModal(modalButton.dataset.openModal);

  if (event.target.matches('[data-close-modal]')) {
    closeModal(event.target.closest('.modal'));
  }

  if (event.target.classList.contains('modal')) closeModal(event.target);

  const bookButton = event.target.closest('[data-book]');
  if (bookButton) setBooking(bookButton.dataset.book);

  const pill = event.target.closest('.pill');
  if (pill) setActiveFilter(pill.dataset.filter);

  const tab = event.target.closest('.tab-btn');
  if (tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  }

  const role = event.target.closest('.role-card');
  if (role) {
    document.querySelectorAll('.role-card').forEach(card => card.classList.remove('active'));
    role.classList.add('active');
  }
});

document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('active');
});

document.getElementById('searchBtn').addEventListener('click', () => {
  setActiveFilter(typeFilter.value);
  document.getElementById('vehicles').scrollIntoView({ behavior: 'smooth' });
});

typeFilter.addEventListener('change', event => setActiveFilter(event.target.value));

document.getElementById('listingForm').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.target);
  const vehicle = {
    name: data.get('vehicleName'),
    type: data.get('vehicleType'),
    location: data.get('location'),
    price: Number(data.get('price')),
    deposit: Number(data.get('deposit')),
    rating: 5.0,
    emoji: data.get('vehicleType') === 'car' ? '🚗' : data.get('vehicleType') === 'scooter' ? '🛵' : '🏍️',
    tags: ['New listing', 'Pending admin', 'Photo proof'],
    description: data.get('description')
  };
  vehicles.unshift(vehicle);
  setActiveFilter('all');
  document.getElementById('listingNote').textContent = `${vehicle.name} has been added to the demo list. Real launch should keep it pending until admin approval.`;
  event.target.reset();
  document.getElementById('vehicles').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('confirmBookingBtn').addEventListener('click', () => {
  document.getElementById('bookingNote').textContent = 'Demo booking requested. In real app this would redirect to Razorpay/Cashfree and hold security deposit.';
});

initializeDate();
renderVehicles();
