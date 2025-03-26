// Elementos do DOM
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const resultsElement = document.getElementById('results');

// Função para mostrar/ocultar loading
function toggleLoading(show) {
    loadingElement.classList.toggle('hidden', !show);
}

// Função para mostrar erro
function showError(message) {
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
    resultsElement.innerHTML = '';
}

// Função para criar card de produto
function createProductCard(product) {
    return '<div class="product-card">' +
        '<img class="product-image" ' +
        'src="' + product.imageUrl + '" ' +
        'alt="' + product.title + '" ' +
        'loading="lazy" ' +
        'onerror="this.src=\'https://via.placeholder.com/300x300?text=No+Image\'">' +
        '<div class="product-info">' +
        '<h3 class="product-title">' + product.title + '</h3>' +
        '<div class="product-rating">' +
        '<span>' + (product.rating || 'No rating') + '</span>' +
        '<span>(' + (product.reviewCount || '0') + ' reviews)</span>' +
        '</div>' +
        '<a href="' + product.productUrl + '" ' +
        'class="product-link" ' +
        'target="_blank" ' +
        'rel="noopener noreferrer">' +
        'View on Amazon</a>' +
        '</div>' +
        '</div>';
}

// Função para criar paginação
function createPagination(currentPage, totalPages) {
    if (totalPages <= 1) return '';

    let paginationHtml = '<div class="pagination">';

    // Botão Previous
    if (currentPage > 1) {
        paginationHtml += `<button class="page-btn" data-page="${currentPage - 1}">Previous</button>`;
    }

    // Páginas numeradas
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 || // Primeira página
            i === totalPages || // Última página
            (i >= currentPage - 2 && i <= currentPage + 2) // 2 páginas antes e depois da atual
        ) {
            paginationHtml += `
                <button class="page-btn ${i === currentPage ? 'active' : ''}" 
                        data-page="${i}">
                    ${i}
                </button>
            `;
        } else if (
            i === currentPage - 3 ||
            i === currentPage + 3
        ) {
            paginationHtml += '<span class="page-dots">...</span>';
        }
    }

    // Botão Next
    if (currentPage < totalPages) {
        paginationHtml += `<button class="page-btn" data-page="${currentPage + 1}">Next</button>`;
    }

    paginationHtml += '</div>';
    return paginationHtml;
}

// Função para buscar produtos
async function searchProducts(keyword, page = 1) {
    try {
        showError('');
        toggleLoading(true);
        const response = await fetch(`http://localhost:3000/scrape?keyword=${encodeURIComponent(keyword)}&page=${page}`);

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to fetch products');
        }

        const data = await response.json();
        const productsHtml = data.products.map(createProductCard).join('');
        const paginationHtml = createPagination(data.page, data.totalPages);

        resultsElement.innerHTML = `
            <div class="results-info">
                Showing page ${data.page} of ${data.totalPages} (${data.totalProducts} products)
            </div>
            <div class="results-grid">
                ${productsHtml}
            </div>
            ${paginationHtml}
        `;

        // Adicionar event listeners para os botões de paginação
        document.querySelectorAll('.page-btn').forEach(button => {
            button.addEventListener('click', () => {
                const newPage = parseInt(button.dataset.page);
                searchProducts(keyword, newPage);
            });
        });

    } catch (error) {
        showError(error.message);
    } finally {
        toggleLoading(false);
    }
}

// Event Listeners
searchButton.addEventListener('click', () => {
    const keyword = searchInput.value.trim();
    if (keyword) {
        searchProducts(keyword);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const keyword = searchInput.value.trim();
        if (keyword) {
            searchProducts(keyword);
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');

    let isSearching = false;

    const clearAllStates = () => {
        resultsDiv.classList.add('hidden');
        loadingDiv.classList.add('hidden');
        errorDiv.classList.add('hidden');
        searchButton.disabled = false;
        searchInput.disabled = false;
        searchButton.innerHTML = 'Search';
    };

    const showLoading = () => {
        clearAllStates();
        loadingDiv.classList.remove('hidden');
        searchButton.disabled = true;
        searchInput.disabled = true;
        searchButton.innerHTML = 'Searching...';
    };

    const showError = (message) => {
        clearAllStates();
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    };

    const showResults = (content) => {
        clearAllStates();
        resultsDiv.innerHTML = content;
        resultsDiv.classList.remove('hidden');
    };

    const searchProducts = async (keyword) => {
        if (isSearching) return;
        isSearching = true;

        try {
            if (!keyword?.trim()) {
                throw new Error('Please enter a search term');
            }

            showLoading();

            const response = await fetch('http://localhost:3000/scrape?keyword=' +
                encodeURIComponent(keyword.trim()));

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();

            if (!data.products || data.products.length === 0) {
                throw new Error('No products found');
            }

            const content = '<div class="results-grid">' +
                data.products.map(createProductCard).join('') +
                '</div>';

            showResults(content);

        } catch (error) {
            showError(error.message);
        } finally {
            isSearching = false;
        }
    };

    const handleSearch = () => {
        const keyword = searchInput.value;
        if (keyword) {
            searchProducts(keyword);
        } else {
            showError('Please enter a search term');
        }
    };

    searchButton.addEventListener('click', handleSearch);

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    });

    // Limpa mensagens de erro quando o usuário começa a digitar
    searchInput.addEventListener('input', () => {
        errorDiv.classList.add('hidden');
    });
}); 