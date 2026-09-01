// Age Calculator JavaScript
// Complete functionality for accurate age calculation

document.addEventListener('DOMContentLoaded', function() {
    const ageForm = document.getElementById('ageForm');
    const birthDateInput = document.getElementById('birthDate');
    const errorMessage = document.getElementById('errorMessage');
    const resultsSection = document.getElementById('resultsSection');

    // Set max date to today
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    birthDateInput.max = `${year}-${month}-${day}`;

    // Form submit event
    ageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateAge();
    });

    // Reset button event
    ageForm.addEventListener('reset', function() {
        errorMessage.textContent = '';
        resultsSection.classList.add('hidden');
    });

    /**
     * Validates the birth date
     * @param {string} dateString - Date string in YYYY-MM-DD format
     * @returns {object} - { isValid: boolean, error: string }
     */
    function validateBirthDate(dateString) {
        if (!dateString) {
            return { isValid: false, error: 'Please select your date of birth.' };
        }

        const birthDate = new Date(dateString + 'T00:00:00');
        const today = new Date();

        // Check if date is in the future
        if (birthDate > today) {
            return { isValid: false, error: 'Your birth date cannot be in the future.' };
        }

        // Check if age is unrealistic (more than 150 years)
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age > 150) {
            return { isValid: false, error: 'Please enter a valid date of birth.' };
        }

        // Check if it's a valid date
        if (isNaN(birthDate.getTime())) {
            return { isValid: false, error: 'Please enter a valid date.' };
        }

        return { isValid: true, error: '' };
    }

    /**
     * Check if a year is a leap year
     * @param {number} year
     * @returns {boolean}
     */
    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    /**
     * Get days in a specific month
     * @param {number} month - Month (1-12)
     * @param {number} year - Year
     * @returns {number} - Days in month
     */
    function getDaysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    /**
     * Calculate exact age in years, months, and days
     * @param {Date} birthDate
     * @param {Date} today
     * @returns {object} - { years, months, days }
     */
    function calculateYearsMonthsDays(birthDate, today) {
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        // Adjust if birthday hasn't occurred this month
        if (days < 0) {
            months--;
            const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += getDaysInMonth(prevMonth.getMonth() + 1, prevMonth.getFullYear());
        }

        // Adjust if birthday month hasn't occurred this year
        if (months < 0) {
            years--;
            months += 12;
        }

        return { years, months, days };
    }

    /**
     * Calculate total days between two dates
     * @param {Date} birthDate
     * @param {Date} today
     * @returns {number} - Total days
     */
    function calculateTotalDays(birthDate, today) {
        const timeDiff = today.getTime() - birthDate.getTime();
        return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    }

    /**
     * Calculate next birthday
     * @param {Date} birthDate
     * @param {Date} today
     * @returns {object} - { date: string, daysRemaining: number }
     */
    function calculateNextBirthday(birthDate, today) {
        let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

        // If birthday has already passed this year, set it for next year
        if (nextBirthday < today) {
            nextBirthday = new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
        }

        // Calculate days remaining
        const timeDiff = nextBirthday.getTime() - today.getTime();
        const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        // Format date
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = nextBirthday.toLocaleDateString('en-US', options);

        return { date: dateString, daysRemaining };
    }

    /**
     * Format number with commas for display
     * @param {number} num
     * @returns {string}
     */
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    /**
     * Main calculate age function
     */
    function calculateAge() {
        errorMessage.textContent = '';
        resultsSection.classList.add('hidden');

        // Validate input
        const validation = validateBirthDate(birthDateInput.value);
        if (!validation.isValid) {
            errorMessage.textContent = validation.error;
            return;
        }

        // Parse dates
        const birthDate = new Date(birthDateInput.value + 'T00:00:00');
        const today = new Date();

        // Calculate all metrics
        const ageData = calculateYearsMonthsDays(birthDate, today);
        const totalDays = calculateTotalDays(birthDate, today);
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = ageData.years * 12 + ageData.months;
        const totalHours = totalDays * 24;
        const totalMinutes = totalHours * 60;
        const nextBirthdayData = calculateNextBirthday(birthDate, today);

        // Update DOM with results
        document.getElementById('years').textContent = ageData.years;
        document.getElementById('months').textContent = ageData.months;
        document.getElementById('days').textContent = ageData.days;
        
        document.getElementById('totalMonths').textContent = formatNumber(totalMonths);
        document.getElementById('totalWeeks').textContent = formatNumber(totalWeeks);
        document.getElementById('totalDays').textContent = formatNumber(totalDays);
        document.getElementById('totalHours').textContent = formatNumber(totalHours);
        document.getElementById('totalMinutes').textContent = formatNumber(totalMinutes);
        
        document.getElementById('nextBirthday').textContent = nextBirthdayData.date;
        document.getElementById('daysUntilBirthday').textContent = formatNumber(nextBirthdayData.daysRemaining);

        // Show results section with animation
        resultsSection.classList.remove('hidden');
    }
});
