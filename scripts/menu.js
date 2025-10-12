// Menu page fu// Menu functionality
class MenuManager {
    constructor() {
        this.products = [];
        this.currentCategory = 'coffee';
        this.displayedProducts = [];
        this.isMobile = window.innerWidth <= 768;
        
        this.init();
    }
    
    async init() {
        await this.loadProducts();
        this.setupEventListeners();
        this.displayProducts();
        this.setupModal();
    }
    
    async loadProducts() {
        try {
            const response = await fetch('products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.products = await response.json();
        } catch (error) {
            console.error('Error loading products:', error);
            this.products = [];
        }
    }
    
    setupEventListeners() {
        // Category tabs
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.closest('.tab-btn')?.dataset?.category;
                if (category) {
                    this.switchCategory(category);
                }
            });
        });
        
        // Load more button
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMoreProducts());
        }
        
        // Resize handler
        window.addEventListener('resize', () => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;
            
            if (wasMobile !== this.isMobile) {
                this.displayProducts();
            }
        });
    }
    
    switchCategory(category) {
        this.currentCategory = category;
        
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        this.displayProducts();
    }
    
    displayProducts() {
        const categoryProducts = this.products.filter(p => p.category === this.currentCategory);
        const grid = document.getElementById('menu-grid');
        const loadMoreBtn = document.getElementById('load-more-btn');
        
        grid.innerHTML = '';
        
        const maxProducts = this.isMobile ? 4 : categoryProducts.length;
        this.displayedProducts = categoryProducts.slice(0, maxProducts);
        
        this.displayedProducts.forEach(product => {
            const card = this.createProductCard(product);
            grid.appendChild(card);
        });
        
        // Show/hide load more button
        if (this.isMobile && categoryProducts.length > 4) {
            loadMoreBtn.style.display = this.displayedProducts.length < categoryProducts.length ? 'block' : 'none';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }
    
    loadMoreProducts() {
        const categoryProducts = this.products.filter(p => p.category === this.currentCategory);
        const grid = document.getElementById('menu-grid');
        const loadMoreBtn = document.getElementById('load-more-btn');
        
        const remainingProducts = categoryProducts.slice(this.displayedProducts.length);
        
        remainingProducts.forEach(product => {
            const card = this.createProductCard(product);
            grid.appendChild(card);
        });
        
        this.displayedProducts = categoryProducts;
        loadMoreBtn.style.display = 'none';
    }
    
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Get image based on category and product index
        const categoryProducts = this.products.filter(p => p.category === product.category);
        const productIndex = categoryProducts.indexOf(product) + 1;
        
        // Use correct file extension
        let imagePath;
        if (product.category === 'coffee' && productIndex === 1) {
            imagePath = `assets/coffee-1.png`;
        } else {
            const extension = product.category === 'coffee' ? 'jpg' : 'png';
            imagePath = `assets/${product.category}-${productIndex}.${extension}`;
        }
        
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = this.escapeHtml(product.name);
        img.className = 'product-image';
        
        const title = document.createElement('h3');
        title.textContent = product.name;
        
        const description = document.createElement('p');
        description.textContent = product.description;
        
        const price = document.createElement('span');
        price.className = 'price';
        price.textContent = `$${product.price}`;
        
        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(price);
        
        card.addEventListener('click', () => this.openModal(product));
        
        return card;
    }
    
    setupModal() {
        const modal = document.getElementById('product-modal');
        const overlay = document.querySelector('.modal-overlay');
        const closeBtn = document.querySelector('.modal-close');
        
        // Close modal events
        [overlay, closeBtn].forEach(element => {
            if (element) {
                element.addEventListener('click', () => this.closeModal());
            }
        });
        
        // Prevent modal close when clicking inside modal content
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }
    
    openModal(product) {
        const modal = document.getElementById('product-modal');
        
        // Populate modal content
        document.getElementById('modal-product-name').textContent = product.name;
        document.getElementById('modal-product-description').textContent = product.description;
        
        // Set modal image
        const categoryProducts = this.products.filter(p => p.category === product.category);
        const productIndex = categoryProducts.indexOf(product) + 1;
        
        // Use correct file extension
        let imagePath;
        if (product.category === 'coffee' && productIndex === 1) {
            imagePath = `assets/coffee-1.png`;
        } else {
            const extension = product.category === 'coffee' ? 'jpg' : 'png';
            imagePath = `assets/${product.category}-${productIndex}.${extension}`;
        }
        
        document.getElementById('modal-product-image').src = imagePath;
        document.getElementById('modal-product-image').alt = product.name;
        
        // Setup size options
        this.setupSizeOptions(product);
        
        // Setup additives options
        this.setupAdditivesOptions(product);
        
        // Calculate initial price
        this.updateTotalPrice(product);
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        const modal = document.getElementById('product-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    setupSizeOptions(product) {
        const container = document.getElementById('size-options');
        container.innerHTML = '';
        
        Object.entries(product.sizes).forEach(([size, data], index) => {
            const btn = document.createElement('button');
            btn.className = `option-btn ${index === 0 ? 'active' : ''}`;
            btn.dataset.size = size;
            btn.dataset.price = data['add-price'];
            const sizeText = document.createElement('span');
            sizeText.innerHTML = `${size.toUpperCase()}<br/>${this.escapeHtml(data.size)}`;
            btn.appendChild(sizeText);
            
            btn.addEventListener('click', () => {
                container.querySelectorAll('.option-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.updateTotalPrice(product);
            });
            
            container.appendChild(btn);
        });
    }
    
    setupAdditivesOptions(product) {
        const container = document.getElementById('additives-options');
        container.innerHTML = '';
        
        product.additives.forEach(additive => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.dataset.price = additive['add-price'];
            const additiveText = document.createElement('span');
            additiveText.innerHTML = `${this.escapeHtml(additive.name)}<br/>+$${additive['add-price']}`;
            btn.appendChild(additiveText);
            
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                this.updateTotalPrice(product);
            });
            
            container.appendChild(btn);
        });
    }
    
    updateTotalPrice(product) {
        let total = parseFloat(product.price);
        
        // Add size price
        const activeSize = document.querySelector('#size-options .option-btn.active');
        if (activeSize) {
            total += parseFloat(activeSize.dataset.price);
        }
        
        // Add additives prices
        document.querySelectorAll('#additives-options .option-btn.active').forEach(btn => {
            total += parseFloat(btn.dataset.price);
        });
        
        const totalElement = document.getElementById('total-price');
        if (totalElement) {
            totalElement.textContent = `$${total.toFixed(2)}`;
        }
    }
}

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize menu manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        new MenuManager();
    } catch (error) {
        console.error('Failed to initialize MenuManager:', error);
    }
});