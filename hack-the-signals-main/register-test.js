
document.addEventListener('DOMContentLoaded', function () {
    const registerButtons = document.querySelectorAll('.register-btn');
    const modal = document.getElementById('registration-modal');
    const closeBtn = document.querySelector('.close-modal');
    const categoryText = document.getElementById('category-text');
    const priceText = document.getElementById('price-text');

    registerButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const category = button.getAttribute('data-category');
            openModal(category);
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            closeModal();
        });
    }

    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    function openModal(category) {
        let label = '', price = '';
        switch (category) {
            case 'cs-sps':
                label = 'IEEE CS/SPS Member';
                price = '₹499';
                break;
            case 'ieee':
                label = 'IEEE Member';
                price = '₹699';
                break;
            case 'non-ieee':
                label = 'NON-IEEE Member';
                price = '₹899';
                break;
            case 'free':
                label = 'Free Registration';
                price = '₹0';
                break;
            default:
                label = 'Unknown';
                price = '₹?';
        }

        if (categoryText && priceText) {
            categoryText.textContent = label;
            priceText.textContent = price;
        }

        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('active');
            setTimeout(() => modal.style.opacity = '1', 10);
        }
    }

    function closeModal() {
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
                modal.classList.remove('active');
            }, 300);
        }
    }

    window.openRegistrationForm = openModal;
});
