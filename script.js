class TemperatureConverter {
    constructor() {
        this.temperatureInput = document.getElementById('temperature-input');
        this.unitSelect = document.getElementById('unit-select');
        this.convertButton = document.getElementById('convert-btn');
        this.resultsSection = document.getElementById('results');
        this.errorMessage = document.getElementById('error-message');
        
        this.celsiusResult = document.getElementById('celsius-result');
        this.fahrenheitResult = document.getElementById('fahrenheit-result');
        this.kelvinResult = document.getElementById('kelvin-result');
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        this.convertButton.addEventListener('click', () => this.handleConversion());
        
        // Allow Enter key to trigger conversion
        this.temperatureInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleConversion();
            }
        });
        
        // Clear error message when user starts typing
        this.temperatureInput.addEventListener('input', () => {
            this.hideError();
        });
    }
    
    validateInput(value) {
        if (value === '' || value === null || value === undefined) {
            return { isValid: false, message: 'Please enter a temperature value.' };
        }
        
        const numValue = parseFloat(value);
        
        if (isNaN(numValue)) {
            return { isValid: false, message: 'Please enter a valid number.' };
        }
        
        // Check for absolute zero violations
        const unit = this.unitSelect.value;
        if (unit === 'celsius' && numValue < -273.15) {
            return { isValid: false, message: 'Temperature cannot be below absolute zero (-273.15°C).' };
        }
        if (unit === 'fahrenheit' && numValue < -459.67) {
            return { isValid: false, message: 'Temperature cannot be below absolute zero (-459.67°F).' };
        }
        if (unit === 'kelvin' && numValue < 0) {
            return { isValid: false, message: 'Kelvin temperature cannot be negative.' };
        }
        
        return { isValid: true, value: numValue };
    }
    
    celsiusToFahrenheit(celsius) {
        return (celsius * 9/5) + 32;
    }
    
    celsiusToKelvin(celsius) {
        return celsius + 273.15;
    }
    
    fahrenheitToCelsius(fahrenheit) {
        return (fahrenheit - 32) * 5/9;
    }
    
    fahrenheitToKelvin(fahrenheit) {
        return this.celsiusToKelvin(this.fahrenheitToCelsius(fahrenheit));
    }
    
    kelvinToCelsius(kelvin) {
        return kelvin - 273.15;
    }
    
    kelvinToFahrenheit(kelvin) {
        return this.celsiusToFahrenheit(this.kelvinToCelsius(kelvin));
    }
    
    convertTemperature(value, fromUnit) {
        let celsius, fahrenheit, kelvin;
        
        switch (fromUnit) {
            case 'celsius':
                celsius = value;
                fahrenheit = this.celsiusToFahrenheit(value);
                kelvin = this.celsiusToKelvin(value);
                break;
            case 'fahrenheit':
                celsius = this.fahrenheitToCelsius(value);
                fahrenheit = value;
                kelvin = this.fahrenheitToKelvin(value);
                break;
            case 'kelvin':
                celsius = this.kelvinToCelsius(value);
                fahrenheit = this.kelvinToFahrenheit(value);
                kelvin = value;
                break;
            default:
                throw new Error('Invalid unit');
        }
        
        return { celsius, fahrenheit, kelvin };
    }
    
    formatTemperature(value, unit) {
        const rounded = Math.round(value * 100) / 100;
        const unitSymbols = {
            celsius: '°C',
            fahrenheit: '°F',
            kelvin: 'K'
        };
        
        return `${rounded}${unitSymbols[unit]}`;
    }
    
    displayResults(results) {
        this.celsiusResult.textContent = this.formatTemperature(results.celsius, 'celsius');
        this.fahrenheitResult.textContent = this.formatTemperature(results.fahrenheit, 'fahrenheit');
        this.kelvinResult.textContent = this.formatTemperature(results.kelvin, 'kelvin');
        
        this.resultsSection.classList.add('show');
    }
    
    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.add('show');
        this.resultsSection.classList.remove('show');
    }
    
    hideError() {
        this.errorMessage.classList.remove('show');
    }
    
    showLoading() {
        this.convertButton.classList.add('loading');
        this.convertButton.disabled = true;
    }
    
    hideLoading() {
        this.convertButton.classList.remove('loading');
        this.convertButton.disabled = false;
    }
    
    async handleConversion() {
        this.hideError();
        this.showLoading();
        
        // Add a small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 300));
        
        try {
            const inputValue = this.temperatureInput.value.trim();
            const validation = this.validateInput(inputValue);
            
            if (!validation.isValid) {
                this.showError(validation.message);
                return;
            }
            
            const fromUnit = this.unitSelect.value;
            const results = this.convertTemperature(validation.value, fromUnit);
            
            this.displayResults(results);
            
        } catch (error) {
            this.showError('An error occurred during conversion. Please try again.');
            console.error('Conversion error:', error);
        } finally {
            this.hideLoading();
        }
    }
}

// Initialize the temperature converter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TemperatureConverter();
});