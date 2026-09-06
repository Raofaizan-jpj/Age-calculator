/**
 * Age Calculator — High Precision Date & Calendar Calculation Engine
 * 100% Client-Side, Accessible, and Mobile-Friendly
 */

document.addEventListener('DOMContentLoaded', function () {
    // Form and input elements
    const ageForm = document.getElementById('ageForm');
    const birthDateInput = document.getElementById('birthDate');
    const targetDateInput = document.getElementById('targetDate');
    const setTodayBtn = document.getElementById('setTodayBtn');
    const resetBtn = document.getElementById('resetBtn');

    // Feedback elements
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    const resultsSection = document.getElementById('resultsSection');
    const toast = document.getElementById('toastNotification');
    const toastMessage = document.getElementById('toastMessage');

    // Hero exact age display elements
    const exactYearsEl = document.getElementById('exactYears');
    const exactMonthsEl = document.getElementById('exactMonths');
    const exactWeeksEl = document.getElementById('exactWeeks');
    const exactDaysEl = document.getElementById('exactDays');
    const exactAgeSentence = document.getElementById('exactAgeSentence');

    // Stat cards elements
    const cardYears = document.getElementById('cardYears');
    const cardYearsDecimal = document.getElementById('cardYearsDecimal');
    const cardMonths = document.getElementById('cardMonths');
    const cardMonthsSub = document.getElementById('cardMonthsSub');
    const cardWeeks = document.getElementById('cardWeeks');
    const cardWeeksSub = document.getElementById('cardWeeksSub');
    const cardDays = document.getElementById('cardDays');
    const cardNextBirthday = document.getElementById('cardNextBirthday');
    const cardNextBirthdayDay = document.getElementById('cardNextBirthdayDay');
    const cardDaysUntilBirthday = document.getElementById('cardDaysUntilBirthday');
    const cardDaysUntilBirthdaySub = document.getElementById('cardDaysUntilBirthdaySub');
    const cardDayOfBirth = document.getElementById('cardDayOfBirth');
    const cardZodiac = document.getElementById('cardZodiac');
    const cardZodiacDates = document.getElementById('cardZodiacDates');
    const cardZodiacIcon = document.getElementById('cardZodiacIcon');

    // Cumulative time elements
    const statHours = document.getElementById('statHours');
    const statMinutes = document.getElementById('statMinutes');
    const statSeconds = document.getElementById('statSeconds');

    // Action buttons
    const copyResultBtn = document.getElementById('copyResultBtn');
    const shareResultBtn = document.getElementById('shareResultBtn');

    // Current calculation cache for copy/share
    let latestResultSummary = '';

    /**
     * Format a date object as YYYY-MM-DD
     */
    function formatDateToYYYYMMDD(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    /**
     * Initialize default date values
     */
    function initDefaultDates() {
        const today = new Date();
        const todayStr = formatDateToYYYYMMDD(today);
        targetDateInput.value = todayStr;
        targetDateInput.max = '9999-12-31';
        birthDateInput.max = todayStr;
    }

    initDefaultDates();

    // "Today" shortcut button
    setTodayBtn.addEventListener('click', function () {
        const todayStr = formatDateToYYYYMMDD(new Date());
        targetDateInput.value = todayStr;
        hideError();
    });

    /**
     * Check if a year is a Gregorian leap year
     */
    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    /**
     * Get days in a specific calendar month
     */
    function getDaysInMonth(year, month) {
        // month is 1-indexed (1 to 12)
        return new Date(year, month, 0).getDate();
    }

    /**
     * Format number with standard commas
     */
    function formatNumber(num) {
        return num.toLocaleString('en-US');
    }

    /**
     * Helper for singular/plural terms
     */
    function pluralize(val, singular, plural) {
        return val === 1 ? `${val} ${singular}` : `${val} ${plural || singular + 's'}`;
    }

    /**
     * Determine Western Zodiac sign
     */
    function getZodiacSign(month, day) {
        const signs = [
            { name: 'Capricorn', icon: '♑', startM: 12, startD: 22, endM: 1, endD: 19, dates: 'Dec 22 – Jan 19' },
            { name: 'Aquarius', icon: '♒', startM: 1, startD: 20, endM: 2, endD: 18, dates: 'Jan 20 – Feb 18' },
            { name: 'Pisces', icon: '♓', startM: 2, startD: 19, endM: 3, endD: 20, dates: 'Feb 19 – Mar 20' },
            { name: 'Aries', icon: '♈', startM: 3, startD: 21, endM: 4, endD: 19, dates: 'Mar 21 – Apr 19' },
            { name: 'Taurus', icon: '♉', startM: 4, startD: 20, endM: 5, endD: 20, dates: 'Apr 20 – May 20' },
            { name: 'Gemini', icon: '♊', startM: 5, startD: 21, endM: 6, endD: 20, dates: 'May 21 – Jun 20' },
            { name: 'Cancer', icon: '♋', startM: 6, startD: 21, endM: 7, endD: 22, dates: 'Jun 21 – Jul 22' },
            { name: 'Leo', icon: '♌', startM: 7, startD: 23, endM: 8, endD: 22, dates: 'Jul 23 – Aug 22' },
            { name: 'Virgo', icon: '♍', startM: 8, startD: 23, endM: 9, endD: 22, dates: 'Aug 23 – Sep 22' },
            { name: 'Libra', icon: '♎', startM: 9, startD: 23, endM: 10, endD: 22, dates: 'Sep 23 – Oct 22' },
            { name: 'Scorpio', icon: '♏', startM: 10, startD: 23, endM: 11, endD: 21, dates: 'Oct 23 – Nov 21' },
            { name: 'Sagittarius', icon: '♐', startM: 11, startD: 22, endM: 12, endD: 21, dates: 'Nov 22 – Dec 21' }
        ];

        for (const s of signs) {
            if (s.startM === 12 && s.endM === 1) {
                if ((month === 12 && day >= s.startD) || (month === 1 && day <= s.endD)) {
                    return s;
                }
            } else if ((month === s.startM && day >= s.startD) || (month === s.endM && day <= s.endD)) {
                return s;
            }
        }
        return { name: 'Capricorn', icon: '♑', dates: 'Dec 22 – Jan 19' };
    }

    /**
     * Display validation error
     */
    function showError(msg) {
        errorMessage.textContent = msg;
        errorAlert.classList.remove('hidden');
        resultsSection.classList.add('hidden');
        errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Hide validation error
     */
    function hideError() {
        errorMessage.textContent = '';
        errorAlert.classList.add('hidden');
    }

    /**
     * Show toast notification
     */
    let toastTimeout;
    function showToast(msg) {
        toastMessage.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }

    /**
     * Core age calculation logic
     */
    function calculateAge() {
        hideError();

        const birthStr = birthDateInput.value;
        const targetStr = targetDateInput.value;

        // Validation rules
        if (!birthStr) {
            showError('Please enter your date of birth.');
            birthDateInput.focus();
            return;
        }

        if (!targetStr) {
            showError('Please select a valid target date.');
            targetDateInput.focus();
            return;
        }

        const [by, bm, bd] = birthStr.split('-').map(Number);
        const [ty, tm, td] = targetStr.split('-').map(Number);

        const birthDateObj = new Date(by, bm - 1, bd);
        const targetDateObj = new Date(ty, tm - 1, td);

        if (isNaN(birthDateObj.getTime())) {
            showError('Please enter a valid date of birth.');
            return;
        }

        if (isNaN(targetDateObj.getTime())) {
            showError('Please select a valid target date.');
            return;
        }

        // Compare timestamps
        const birthUtc = Date.UTC(by, bm - 1, bd);
        const targetUtc = Date.UTC(ty, tm - 1, td);

        if (targetUtc < birthUtc) {
            showError('The target date must be on or after the date of birth.');
            return;
        }

        // Check for unrealistic range (> 150 years)
        const yearsDiffEstimate = ty - by;
        if (yearsDiffEstimate > 150) {
            showError('Please enter a realistic date of birth (less than 150 years ago).');
            return;
        }

        // 1. Calculate Exact Years, Months, and Days
        let years = ty - by;
        let months = tm - bm;
        let days = td - bd;

        if (days < 0) {
            months--;
            // Number of days in the month preceding the target date month
            const prevYear = tm === 1 ? ty - 1 : ty;
            const prevMonth = tm === 1 ? 12 : tm - 1;
            const prevMonthDays = getDaysInMonth(prevYear, prevMonth);
            days += prevMonthDays;
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        // Subdivide days into completed weeks and extra days
        const weeks = Math.floor(days / 7);
        const remainingDays = days % 7;

        // 2. Calculate Total Cumulative Metrics
        const totalDays = Math.round((targetUtc - birthUtc) / (1000 * 60 * 60 * 24));
        const totalWeeks = Math.floor(totalDays / 7);
        const totalWeeksRemDays = totalDays % 7;
        const totalMonths = years * 12 + months;
        const totalHours = totalDays * 24;
        const totalMinutes = totalHours * 60;
        const totalSeconds = totalMinutes * 60;
        const decimalYears = (totalDays / 365.2425).toFixed(2);

        // 3. Calculate Day of Birth
        const weekdayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'long' });
        const birthDayOfWeek = weekdayFormatter.format(birthDateObj);

        // 4. Calculate Western Zodiac Sign
        const zodiac = getZodiacSign(bm, bd);

        // 5. Calculate Next Birthday & Countdown
        let nextBdayYear = ty;
        let nextBdayMonth = bm;
        let nextBdayDay = bd;

        // Leap year baby adjustment (Feb 29)
        let isFeb29Baby = (bm === 2 && bd === 29);
        if (isFeb29Baby && !isLeapYear(nextBdayYear)) {
            // Common convention celebration day on non-leap years
            nextBdayDay = 28;
        }

        let nextBdayUtc = Date.UTC(nextBdayYear, nextBdayMonth - 1, nextBdayDay);

        // If target date is past this year's birthday, next birthday is next year
        if (targetUtc > nextBdayUtc) {
            nextBdayYear++;
            if (isFeb29Baby && !isLeapYear(nextBdayYear)) {
                nextBdayDay = 28;
            } else if (isFeb29Baby && isLeapYear(nextBdayYear)) {
                nextBdayDay = 29;
            }
            nextBdayUtc = Date.UTC(nextBdayYear, nextBdayMonth - 1, nextBdayDay);
        }

        const nextBdayDateObj = new Date(nextBdayYear, nextBdayMonth - 1, nextBdayDay);
        const daysUntilBirthday = Math.round((nextBdayUtc - targetUtc) / (1000 * 60 * 60 * 24));

        const fullDateFormatter = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        const nextBdayFormatted = fullDateFormatter.format(nextBdayDateObj);
        const nextBdayWeekday = weekdayFormatter.format(nextBdayDateObj);

        // ------------------ Update UI ------------------
        // Hero Section
        exactYearsEl.textContent = years;
        exactMonthsEl.textContent = months;
        exactWeeksEl.textContent = weeks;
        exactDaysEl.textContent = remainingDays;

        exactAgeSentence.textContent = `You are exactly ${pluralize(years, 'year')}, ${pluralize(months, 'month')}, ${pluralize(weeks, 'week')}, and ${pluralize(remainingDays, 'day')} old.`;

        // Metric Cards
        cardYears.textContent = formatNumber(years);
        cardYearsDecimal.textContent = `${decimalYears} years total`;

        cardMonths.textContent = formatNumber(totalMonths);
        cardMonthsSub.textContent = `Plus ${days} ${days === 1 ? 'day' : 'days'}`;

        cardWeeks.textContent = formatNumber(totalWeeks);
        cardWeeksSub.textContent = `Plus ${totalWeeksRemDays} ${totalWeeksRemDays === 1 ? 'day' : 'days'}`;

        cardDays.textContent = formatNumber(totalDays);

        // Birthday Cards
        if (daysUntilBirthday === 0) {
            cardNextBirthday.textContent = 'Today! 🎂';
            cardNextBirthdayDay.textContent = 'Happy Birthday!';
            cardDaysUntilBirthday.textContent = '0';
            cardDaysUntilBirthdaySub.textContent = "It's your birthday today!";
        } else {
            cardNextBirthday.textContent = nextBdayFormatted;
            cardNextBirthdayDay.textContent = `${nextBdayWeekday}${isFeb29Baby && !isLeapYear(nextBdayYear) ? ' (Observed)' : ''}`;
            cardDaysUntilBirthday.textContent = formatNumber(daysUntilBirthday);
            cardDaysUntilBirthdaySub.textContent = daysUntilBirthday === 1 ? 'Day remaining' : 'Days remaining';
        }

        // Day of Birth & Zodiac
        cardDayOfBirth.textContent = birthDayOfWeek;
        cardZodiac.textContent = zodiac.name;
        cardZodiacIcon.textContent = zodiac.icon;
        cardZodiacDates.textContent = zodiac.dates;

        // Cumulative Times
        statHours.textContent = formatNumber(totalHours);
        statMinutes.textContent = formatNumber(totalMinutes);
        statSeconds.textContent = formatNumber(totalSeconds);

        // Cache summary for clipboard & sharing
        latestResultSummary = `Age Calculation Result:
• Exact Age: ${years} Years, ${months} Months, ${weeks} Weeks, ${remainingDays} Days
• Total Days Lived: ${formatNumber(totalDays)} Days
• Total Weeks Lived: ${formatNumber(totalWeeks)} Weeks
• Total Months Lived: ${formatNumber(totalMonths)} Months
• Next Birthday: ${nextBdayFormatted} (${formatNumber(daysUntilBirthday)} days remaining)
• Day of Birth: ${birthDayOfWeek}
• Zodiac Sign: ${zodiac.name} (${zodiac.dates})
Calculated online with https://age-calculator-blue-zeta.vercel.app/`;

        // Reveal results
        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Form submit listener
    ageForm.addEventListener('submit', function (e) {
        e.preventDefault();
        calculateAge();
    });

    // Reset listener
    ageForm.addEventListener('reset', function () {
        hideError();
        resultsSection.classList.add('hidden');
        setTimeout(initDefaultDates, 0);
    });

    // Copy Result button
    copyResultBtn.addEventListener('click', async function () {
        if (!latestResultSummary) return;

        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(latestResultSummary);
                showToast('Result copied to clipboard!');
            } else {
                // Fallback using textarea
                const textArea = document.createElement('textarea');
                textArea.value = latestResultSummary;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showToast('Result copied to clipboard!');
            }
        } catch (err) {
            showToast('Unable to copy. Please copy manually.');
        }
    });

    // Share Result button
    shareResultBtn.addEventListener('click', async function () {
        if (!latestResultSummary) return;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My Age Calculation Result',
                    text: latestResultSummary,
                    url: 'https://age-calculator-blue-zeta.vercel.app/'
                });
            } catch (err) {
                // User dismissed or share was aborted
            }
        } else {
            // Fallback to clipboard
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(latestResultSummary);
                    showToast('Share link & summary copied to clipboard!');
                }
            } catch (err) {
                showToast('Share not supported on this browser.');
            }
        }
    });
});
