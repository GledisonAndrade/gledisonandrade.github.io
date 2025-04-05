document.addEventListener('DOMContentLoaded', function() {
    // 1. Menu Mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('#main-nav ul');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('show');
            this.setAttribute('aria-expanded', nav.classList.contains('show'));
        });
    }

    // 2. Atualizar ano no footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // 3. Slider de depoimentos
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    
    if (testimonials.length > 0 && prevBtn && nextBtn) {
        let currentIndex = 0;
        
        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                testimonial.classList.toggle('active', i === index);
            });
        }
        
        prevBtn.addEventListener('click', function() {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : testimonials.length - 1;
            showTestimonial(currentIndex);
        });
        
        nextBtn.addEventListener('click', function() {
            currentIndex = (currentIndex < testimonials.length - 1) ? currentIndex + 1 : 0;
            showTestimonial(currentIndex);
        });
        
        // Mostrar primeiro item
        showTestimonial(0);
    }

    // 4. Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            
            if (emailInput && emailInput.value) {
                alert(`Obrigado por assinar nossa newsletter! Um email foi enviado para ${emailInput.value}`);
                this.reset();
            }
        });
    }

    // 5. Conversor de alimentos
    const foodConverterForm = document.getElementById('food-converter');
    if (foodConverterForm && window.location.pathname.includes('alimentacao.html')) {
        foodConverterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const quantity = parseFloat(this.querySelector('#quantity').value) || 0;
            const fromUnit = this.querySelector('#from-unit').value;
            const toUnit = this.querySelector('#to-unit').value;
            const foodType = this.querySelector('#food-type').value;
            
            const result = convertFoodMeasure(quantity, fromUnit, toUnit, foodType);
            const resultElement = document.getElementById('result');
            
            if (resultElement) {
                resultElement.innerHTML = `
                    <strong>Resultado:</strong> ${quantity} ${fromUnit} de ${foodType} = ${result} ${toUnit}
                `;
            }
        });
    }

    // 6. Accordion para dicas
    const accordionBtns = document.querySelectorAll('.accordion-btn');
    if (accordionBtns.length > 0) {
        accordionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const isActive = this.classList.toggle('active');
                const content = this.nextElementSibling;
                
                if (content) {
                    content.style.maxHeight = isActive ? content.scrollHeight + "px" : null;
                }
            });
            
            // Abrir primeiro item por padrão
            if (btn === accordionBtns[0]) {
                btn.classList.add('active');
                const firstContent = btn.nextElementSibling;
                if (firstContent) {
                    firstContent.style.maxHeight = firstContent.scrollHeight + "px";
                }
            }
        });
    }

    // 7. Formulário de contato
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            this.reset();
        });
    }

    // 8. Detalhes das raças
    const breedButtons = document.querySelectorAll('.breed-details');
    if (breedButtons.length > 0) {
        breedButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const isActive = this.classList.toggle('active');
                const breedId = this.getAttribute('data-breed');
                const detailsContent = document.getElementById(`${breedId}-details`);
                
                if (detailsContent) {
                    detailsContent.classList.toggle('active', isActive);
                    
                    this.innerHTML = isActive 
                        ? 'Ocultar detalhes <i class="fas fa-chevron-up"></i>' 
                        : 'Ver detalhes <i class="fas fa-chevron-down"></i>';
                    
                    if (isActive) {
                        setTimeout(() => {
                            detailsContent.scrollIntoView({
                                behavior: 'smooth',
                                block: 'nearest'
                            });
                        }, 50);
                    }
                }
            });
        });
        
        // Fechar ao clicar fora
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.breed-details') && !e.target.closest('.breed-details-content')) {
                document.querySelectorAll('.breed-details-content.active').forEach(content => {
                    content.classList.remove('active');
                    const button = content.previousElementSibling;
                    if (button && button.classList.contains('breed-details')) {
                        button.classList.remove('active');
                        button.innerHTML = 'Ver detalhes <i class="fas fa-chevron-down"></i>';
                    }
                });
            }
        });
    }
});

// Função de conversão de alimentos (mantida fora do DOMContentLoaded para reutilização)
function convertFoodMeasure(quantity, fromUnit, toUnit, foodType) {
    const densities = {
        'ração_seca': { 'xícara': 120, 'colher_sopa': 15 },
        'ração_umida': { 'xícara': 240, 'colher_sopa': 30 },
        'carne': { 'xícara': 225, 'colher_sopa': 25 }
    };
    
    if (!densities[foodType]) return 0;

    // Converter para gramas primeiro
    let grams;
    switch (fromUnit) {
        case 'xícara': grams = quantity * densities[foodType]['xícara']; break;
        case 'colher_sopa': grams = quantity * densities[foodType]['colher_sopa']; break;
        case 'grama': grams = quantity; break;
        case 'kg': grams = quantity * 1000; break;
        default: return 0;
    }
    
    // Converter de gramas para unidade desejada
    switch (toUnit) {
        case 'xícara': return (grams / densities[foodType]['xícara']).toFixed(2);
        case 'colher_sopa': return (grams / densities[foodType]['colher_sopa']).toFixed(2);
        case 'grama': return grams.toFixed(2);
        case 'kg': return (grams / 1000).toFixed(2);
        default: return grams.toFixed(2);
    }
}