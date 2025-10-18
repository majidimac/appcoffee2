document.addEventListener('DOMContentLoaded', () => {

    // ####################################
    // Element Selections
    // ####################################
    const sections = {
        main: document.getElementById('main-menu'),
        roast: document.getElementById('calculator-section'),
        cafe: document.getElementById('cafe-section'),
        bakwash: document.getElementById('bakwash-section'),
        stopwatch: document.getElementById('stopwatch-section'),
        mix: document.getElementById('mix-section'),
        priceList: document.getElementById('price-list-section')
    };

    const cards = {
        roast: document.getElementById('roast-card'),
        cafe: document.getElementById('cafe-card'),
        bakwash: document.getElementById('bakwash-card'),
        mix: document.getElementById('mix-card'),
        stopwatch: document.getElementById('stopwatch-card'),
        priceList: document.getElementById('price-list-card')
    };

    const buttons = {
        calculateRoast: document.getElementById('calculate-roast-btn'),
        calculateCafe: document.getElementById('calculate-cafe-btn'),
        back: document.querySelectorAll('.back-button')
    };

    const themeToggler = document.getElementById('theme-toggler');
    const clockElement = document.getElementById('live-clock');

    // ####################################
    // Clock Logic
    // ####################################
    function updateClock() {
        if (!clockElement) return;
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        clockElement.textContent = new Intl.DateTimeFormat('fa-IR', options).format(now);
    }
    setInterval(updateClock, 1000);
    updateClock();

    // ####################################
    // Theme Switcher Logic
    // ####################################
    const getStoredTheme = () => localStorage.getItem('theme');
    const setStoredTheme = theme => localStorage.setItem('theme', theme);

    const getPreferredTheme = () => {
        const storedTheme = getStoredTheme();
        if (storedTheme) return storedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const setTheme = theme => {
        const isDark = theme === 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        const sunIcon = "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707-.707M6.343 17.657l-.707-.707m12.728 0l-.707.707M6.343 6.343l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z";
        const moonIcon = "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z";
        if (themeToggler) themeToggler.querySelector('path').setAttribute('d', isDark ? sunIcon : moonIcon);
    };

    setTheme(getPreferredTheme());

    if (themeToggler) {
        themeToggler.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            setStoredTheme(newTheme);
            setTheme(newTheme);
        });
    }

    // ####################################
    // Navigation Logic
    // ####################################
    function showSection(sectionId) {
        Object.values(sections).forEach(section => {
            if(section) section.style.display = 'none';
        });
        const sectionToShow = document.getElementById(sectionId);
        if (sectionToShow) sectionToShow.style.display = 'block';
    }

    if (cards.roast) cards.roast.addEventListener('click', () => showSection('calculator-section'));
    if (cards.cafe) cards.cafe.addEventListener('click', () => showSection('cafe-section'));
    if (cards.stopwatch) cards.stopwatch.addEventListener('click', () => showSection('stopwatch-section'));
    if (cards.mix) cards.mix.addEventListener('click', () => showSection('mix-section'));
    if (cards.bakwash) cards.bakwash.addEventListener('click', () => showSection('bakwash-section'));
    if (cards.priceList) cards.priceList.addEventListener('click', () => showSection('price-list-section'));

    buttons.back.forEach(button => {
        button.addEventListener('click', () => showSection('main-menu'));
    });

    // ####################################
    // Helper Functions
    // ####################################
    function formatCurrency(number) {
        if (isNaN(number)) return '0';
        return number.toLocaleString('fa-IR', { maximumFractionDigits: 0 });
    }

    function getInputValue(elementId, defaultValue = 0) {
        const input = document.getElementById(elementId);
        if (!input) return defaultValue;
        const value = parseFloat(input.value);
        return isNaN(value) ? defaultValue : value;
    }
    // #####################################################
// 🔹 منطق بخش کرنومتر بک‌واش (bakwash-section)
// #####################################################

if (sections.bakwash) {

    const backwashDisplay = document.getElementById('backwash-display');
    const backwashStatus = document.getElementById('backwash-status');
    const backwashBeep = document.getElementById('backwash-beep');

    const start10Btn = document.getElementById('backwash-start10');
    const start5Btn = document.getElementById('backwash-start5');

    let backwashTimer = null;

    // فرمت زمان برای نمایش
    function formatTime(sec) {
        const m = String(Math.floor(sec / 60)).padStart(2, '0');
        const s = String(sec % 60).padStart(2, '0');
        return `${m}:${s}`;
    }

    // پخش صدای بوق
    function playBackwashBeep() {
        backwashBeep.currentTime = 0;
        backwashBeep.play().catch(() => {});
    }

    // اجرای چرخه روشن/خاموش
    function runBackwashCycle(onTime, offTime, totalRounds, label) {
        clearInterval(backwashTimer);
        let round = 0;

        backwashStatus.innerText = `شروع ${label}...`;

        function nextRound() {
            if (round >= totalRounds) {
                backwashStatus.innerText = `✅ ${label} تمام شد.`;
                backwashDisplay.innerText = "00:00";
                return;
            }

            // 🔥 مرحله روشن
            playBackwashBeep();
            let sec = onTime;
            backwashStatus.innerText = `🔥 ${label} - دوره ${round + 1} (روشن)`;
            backwashDisplay.innerText = formatTime(sec);

            backwashTimer = setInterval(() => {
                sec--;
                backwashDisplay.innerText = formatTime(sec);
                if (sec <= 0) {
                    clearInterval(backwashTimer);

                    // 💧 مرحله خاموش
                    playBackwashBeep();
                    let rest = offTime;
                    backwashStatus.innerText = `💧 ${label} - دوره ${round + 1} (خاموش)`;
                    backwashDisplay.innerText = formatTime(rest);

                    backwashTimer = setInterval(() => {
                        rest--;
                        backwashDisplay.innerText = formatTime(rest);
                        if (rest <= 0) {
                            clearInterval(backwashTimer);
                            round++;
                            nextRound();
                        }
                    }, 1000);
                }
            }, 1000);
        }

        nextRound();
    }

    // 🎯 دکمه‌ها
    if (start10Btn) start10Btn.addEventListener('click', () => {
        runBackwashCycle(10, 10, 5, 'مرحله ۱۰ ثانیه‌ای');
    });

    if (start5Btn) start5Btn.addEventListener('click', () => {
        runBackwashCycle(5, 5, 10, 'مرحله ۵ ثانیه‌ای');
    });
}


    // ####################################
    // Roast Calculator Logic
    // ####################################
    function calculateRoast() {
        const batchInputElement = document.getElementById('batchInput');
        const batchOutputElement = document.getElementById('batchOutput');
        const resultsDiv = document.getElementById('results');

        batchInputElement.classList.remove('invalid-input');
        batchOutputElement.classList.remove('invalid-input');

        const batchInput = getInputValue('batchInput', NaN);
        const batchOutput = getInputValue('batchOutput', NaN);
        let isValid = true;
        if (isNaN(batchInput) || batchInput <= 0) { isValid = false; batchInputElement.classList.add('invalid-input'); }
        if (isNaN(batchOutput) || batchOutput < 0 || batchOutput > batchInput) { isValid = false; batchOutputElement.classList.add('invalid-input'); }

        if (!isValid) {
            resultsDiv.innerHTML = '<p style="color: red;">!لطفاً فیلدهای مشخص‌شده را با مقادیر معتبر پر کنید</p>';
            return;
        }

        const greenPrice = getInputValue('greenPrice');
        const roastWage = getInputValue('roastWage');
        const totalGreen = getInputValue('totalGreen');
        const weightLossPercent = ((batchInput - batchOutput) / batchInput) * 100;
        const totalRoastedOutput = totalGreen * (1 - (weightLossPercent / 100));
        let costOfRoastedCoffee = 0;
        if (totalRoastedOutput > 0) {
            const costPerKGGreen = greenPrice + roastWage;
            const overallTotalCost = costPerKGGreen * totalGreen;
            costOfRoastedCoffee = overallTotalCost / totalRoastedOutput;
        }
        resultsDiv.innerHTML = `<p><strong>درصد افت وزن:</strong> ${weightLossPercent.toFixed(2)} %</p><p><strong>قیمت تمام شده رُست شده:</strong> ${formatCurrency(costOfRoastedCoffee)} تومان/کیلوگرم</p><p><strong>مقدار قهوه خروجی در بچ:</strong> ${batchOutput.toFixed(2)} گرم</p><p><strong>کل قهوه رُست شده امروز:</strong> ${totalRoastedOutput.toFixed(2)} کیلوگرم</p>`;
    }
    if (buttons.calculateRoast) buttons.calculateRoast.addEventListener('click', calculateRoast);

    // ####################################
    // Cafe Revenue Logic
    // ####################################
    function calculateCafeRevenue() {
        const costPerKGElement = document.getElementById('costPerKG');
        const costSingleShotElement = document.getElementById('costSingleShot');
        const resultsDiv = document.getElementById('cafe-results');

        costPerKGElement.classList.remove('invalid-input');
        costSingleShotElement.classList.remove('invalid-input');

        const costPerKG = getInputValue('costPerKG', NaN);
        const costSingleShot = getInputValue('costSingleShot', NaN);

        let isValid = true;
        if (isNaN(costPerKG) || costPerKG <= 0) { isValid = false; costPerKGElement.classList.add('invalid-input'); }
        if (isNaN(costSingleShot) || costSingleShot <= 0) { isValid = false; costSingleShotElement.classList.add('invalid-input'); }

        if (!isValid) {
            resultsDiv.innerHTML = '<p style="color: red;">!لطفاً فیلدهای مشخص‌شده را با مقادیر معتبر پر کنید</p>';
            return;
        }

        const sellPriceKG = getInputValue('sellPriceKG'), costDoubleShot = getInputValue('costDoubleShot'), gramSingle = getInputValue('gramSingle'), gramDouble = getInputValue('gramDouble'), otherCostPerShot = getInputValue('otherCostPerShot'), salesSingle = getInputValue('salesSingle'), salesDouble = getInputValue('salesDouble'), salesMixKG = getInputValue('salesMixKG');
        const revenueSingle = salesSingle * costSingleShot, revenueDouble = salesDouble * costDoubleShot, revenueMix = salesMixKG * sellPriceKG, totalDailyRevenue = revenueSingle + revenueDouble + revenueMix;
        const totalGramUsed = (salesSingle * gramSingle) + (salesDouble * gramDouble) + (salesMixKG * 1000), totalKGUsed = totalGramUsed / 1000, costOfCoffeeUsed = totalKGUsed * costPerKG;
        const totalSalesShots = salesSingle + salesDouble, totalOtherCost = totalSalesShots * otherCostPerShot, totalDailyCost = costOfCoffeeUsed + totalOtherCost, totalDailyProfit = totalDailyRevenue - totalDailyCost;
        const daysInMonth = 30, totalMonthlyRevenue = totalDailyRevenue * daysInMonth, totalMonthlyProfit = totalDailyProfit * daysInMonth, totalMonthlyKGUsed = totalKGUsed * daysInMonth;

        resultsDiv.innerHTML = `<h3>خلاصه روزانه</h3><p><strong>کل درآمد فروش روزانه:</strong> ${formatCurrency(totalDailyRevenue)} تومان</p><p><strong>کل هزینه (مواد + جانبی):</strong> ${formatCurrency(totalDailyCost)} تومان</p><p><strong>سود ناخالص روزانه:</strong> <span style="color: var(--primary-color); font-weight: bold;">${formatCurrency(totalDailyProfit)} تومان</span></p><p><strong>مقدار قهوه مصرفی روزانه:</strong> <strong>${totalKGUsed.toFixed(2)} کیلوگرم</strong></p><hr style="border-top: 1px dashed var(--accent-color); margin: 15px 0;"><h3>خلاصه ماهانه (30 روز)</h3><p><strong>کل درآمد ماهانه:</strong> ${formatCurrency(totalMonthlyRevenue)} تومان</p><p><strong>سود ناخالص ماهانه:</strong> <span style="color: var(--primary-color); font-weight: bold;">${formatCurrency(totalMonthlyProfit)} تومان</span></p><p><strong>مقدار قهوه مصرفی ماهانه:</strong> <strong>${totalMonthlyKGUsed.toFixed(2)} کیلوگرم</strong></p>`;
    }
    if (buttons.calculateCafe) buttons.calculateCafe.addEventListener('click', calculateCafeRevenue);

    // ####################################
    // Stopwatch Logic
    // ####################################
    if (sections.stopwatch) {
        const stopwatchDisplay = sections.stopwatch.querySelector('.stopwatch-display');
        const startPauseBtn = sections.stopwatch.querySelector('#start-pause-btn');
        const resetBtn = sections.stopwatch.querySelector('#reset-btn');
        const stage1MinutesInput = sections.stopwatch.querySelector('#stage1-minutes');
        const stage1SecondsInput = sections.stopwatch.querySelector('#stage1-seconds');
        const stage2MinutesInput = sections.stopwatch.querySelector('#stage2-minutes');
        const stage2SecondsInput = sections.stopwatch.querySelector('#stage2-seconds');
        const stageIndicator = sections.stopwatch.querySelector('#stage-indicator');

        let timerInterval = null;
        let isRunning = false;
        let currentStage = 1;
        let timeRemaining = 0;
        const stageDurations = [0, 0];

        function playBeep() {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                oscillator.connect(audioContext.destination);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.5);
            } catch (e) { console.error("Could not play beep:", e); }
        }

        function updateDisplay() {
            const minutes = Math.floor(Math.abs(timeRemaining) / 60);
            const seconds = Math.abs(timeRemaining) % 60;
            stopwatchDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        function stopTimer() {
            clearInterval(timerInterval);
            isRunning = false;
            startPauseBtn.textContent = 'ادامه';
            if (stageIndicator) stageIndicator.style.display = 'none';
        }

        function tick() {
            if (timeRemaining > 0) {
                timeRemaining--;
                updateDisplay();
            }
            if (timeRemaining <= 0) {
                playBeep();
                if (currentStage === 1) {
                    currentStage = 2;
                    timeRemaining = stageDurations[1];
                    if (stageIndicator) stageIndicator.textContent = `مرحله ${currentStage} در حال اجرا`;
                    updateDisplay();
                    if (timeRemaining <= 0) stopTimer();
                } else {
                    stopTimer();
                }
            }
        }

        function startTimer() {
            if (isRunning) return;
            if (timeRemaining <= 0) resetTimer();
            if (timeRemaining <= 0) return;

            if (stageIndicator) {
                stageIndicator.textContent = `مرحله ${currentStage} در حال اجرا`;
                stageIndicator.style.display = 'block';
            }
            isRunning = true;
            startPauseBtn.textContent = 'توقف';
            timerInterval = setInterval(tick, 1000);
        }

        function toggleTimer() {
            if (isRunning) {
                stopTimer();
            } else {
                startTimer();
            }
        }

        function resetTimer() {
            stopTimer();
            currentStage = 1;
            stageDurations[0] = (parseInt(stage1MinutesInput.value, 10) || 0) * 60 + (parseInt(stage1SecondsInput.value, 10) || 0);
            stageDurations[1] = (parseInt(stage2MinutesInput.value, 10) || 0) * 60 + (parseInt(stage2SecondsInput.value, 10) || 0);
            timeRemaining = stageDurations[0];
            startPauseBtn.textContent = 'شروع';
            if (stageIndicator) stageIndicator.style.display = 'none';
            updateDisplay();
        }

        startPauseBtn.addEventListener('click', toggleTimer);
        resetBtn.addEventListener('click', resetTimer);

        [stage1MinutesInput, stage1SecondsInput, stage2MinutesInput, stage2SecondsInput].forEach(input => {
            input.addEventListener('input', resetTimer);
        });

        resetTimer();
    }

    // ####################################
    // Bean Mix Calculator Logic (Final Corrected Version)
    // ####################################
    if (sections.mix) {
        const beanRowsContainer = sections.mix.querySelector('#bean-rows-container');
        const addBeanBtn = sections.mix.querySelector('#add-bean-btn');
        const calculateMixBtn = sections.mix.querySelector('#calculate-mix-btn');
        const mixResults = sections.mix.querySelector('#mix-results');
        const totalPercentageSpan = sections.mix.querySelector('#total-percentage');
        let beanRowCount = 0;

        function createBeanRow() {
            if (beanRowsContainer.children.length >= 5) {
                addBeanBtn.style.display = 'none';
                return;
            }
            beanRowCount++;
            const rowWrapper = document.createElement('div');
            rowWrapper.className = 'bean-row-wrapper';

            // Add separator for all but the first row
            if (beanRowsContainer.children.length > 0) {
                rowWrapper.innerHTML += '<hr>';
            }

            rowWrapper.innerHTML += `
                <div class="bean-row cafe-grid four-cols">
                    <div class="input-group"><input type="text" class="bean-name" placeholder="نوع دانه ${beanRowCount}"></div>
                    <div class="input-group"><input type="number" class="bean-price" placeholder="قیمت (تومان/کیلو)"></div>
                    <div class="input-group"><input type="number" class="bean-percentage" placeholder="درصد (%)" min="0" max="100"></div>
                    <div class="input-group"><input type="number" class="bean-weight" placeholder="وزن (گرم)"></div>
                </div>
                <button class="calc-button remove-bean-btn" style="background: var(--danger-color); font-size: 0.9rem; padding: 0.5rem; width: auto; margin-top: -1rem; align-self: center;">حذف</button>
            `;

            beanRowsContainer.appendChild(rowWrapper);

            rowWrapper.querySelector('.remove-bean-btn').addEventListener('click', () => {
                rowWrapper.remove();
                if (beanRowsContainer.children.length < 5) {
                    addBeanBtn.style.display = 'block';
                }
                updateTotalPercentage();
            });

            rowWrapper.querySelector('.bean-percentage').addEventListener('input', updateTotalPercentage);
        }

        function updateTotalPercentage() {
            const percentages = beanRowsContainer.querySelectorAll('.bean-percentage');
            let total = 0;
            percentages.forEach(input => {
                total += parseFloat(input.value) || 0;
            });
            totalPercentageSpan.textContent = total.toFixed(0);
            totalPercentageSpan.style.color = (Math.round(total) === 100) ? '#28a745' : 'var(--danger-color)';
        }

        function calculateMixPrice() {
            const rows = beanRowsContainer.querySelectorAll('.bean-row-wrapper');
            let totalPercentage = 0;
            let totalWeight = 0;
            let totalCostFromWeight = 0;
            let finalPriceFromPercentage = 0;

            rows.forEach(row => {
                const percentage = parseFloat(row.querySelector('.bean-percentage').value) || 0;
                const price = parseFloat(row.querySelector('.bean-price').value) || 0;
                const weight = parseFloat(row.querySelector('.bean-weight').value) || 0;

                totalPercentage += percentage;

                if (weight > 0 && price > 0) {
                    totalWeight += weight;
                    totalCostFromWeight += (weight / 1000) * price;
                }

                if (percentage > 0 && price > 0) {
                    finalPriceFromPercentage += (percentage / 100) * price;
                }
            });

            let resultHTML = '';

            // Calculation based on weight
            if (totalWeight > 0) {
                const pricePerKgFromWeight = totalCostFromWeight / (totalWeight / 1000);
                resultHTML += `<p><strong>قیمت نهایی (بر اساس وزن):</strong> ${formatCurrency(pricePerKgFromWeight)} تومان/کیلوگرم</p>`;
            }

            // Calculation based on percentage
            if (Math.round(totalPercentage) === 100) {
                resultHTML += `<p><strong>قیمت نهایی (بر اساس درصد):</strong> ${formatCurrency(finalPriceFromPercentage)} تومان/کیلوگرم</p>`;
            } else {
                resultHTML += `<p style="font-size: 0.9rem; color: var(--danger-color);">(برای محاسبه بر اساس درصد، مجموع درصدها باید 100 باشد)</p>`;
            }

            if (resultHTML === '') {
                mixResults.innerHTML = `<p style="color: var(--danger-color);">لطفاً مقادیر را برای محاسبه وارد کنید.</p>`;
            } else {
                mixResults.innerHTML = resultHTML;

                const oneMonthButton = document.createElement('button');
                oneMonthButton.textContent = 'قیمت نهایی برای خرید یک ماهه';
                oneMonthButton.className = 'calc-button';
                oneMonthButton.style.marginTop = '1rem';

                oneMonthButton.addEventListener('click', () => {
                    const priceWithIncreasePerc = priceFromPercentage * 1.06;
                    const priceWithIncreaseWeight = pricePerKgFromWeight * 1.06;

                    const increaseHTML = `<hr><p style="color: var(--primary-color);">با 6% افزایش:</p>`;
                    let increaseResults = '';
                    if (pricePerKgFromWeight > 0) {
                       increaseResults += `<p><strong>بر اساس وزن:</strong> ${formatCurrency(priceWithIncreaseWeight)} تومان/کیلوگرم</p>`;
                    }
                     if (Math.round(totalPercentage) === 100) {
                       increaseResults += `<p><strong>بر اساس درصد:</strong> ${formatCurrency(priceWithIncreasePerc)} تومان/کیلوگرم</p>`;
                    }

                    mixResults.innerHTML += increaseHTML + increaseResults;
                    oneMonthButton.remove();
                }, { once: true });

                mixResults.appendChild(oneMonthButton);
            }
        }

        addBeanBtn.addEventListener('click', createBeanRow);
        calculateMixBtn.addEventListener('click', calculateMixPrice);

        // Add initial row
        createBeanRow();
    }

    // ####################################
    // Price List Image Generation Logic (Redesigned)
    // ####################################
    if (sections.priceList) {
        const coffeeListContainer = sections.priceList.querySelector('#coffee-list-container');
        const powderListContainer = sections.priceList.querySelector('#powder-list-container');
        const addCoffeeRowBtn = sections.priceList.querySelector('#add-coffee-row-btn');
        const addPowderRowBtn = sections.priceList.querySelector('#add-powder-row-btn');
        const generateImageBtn = sections.priceList.querySelector('#generate-image-btn');

       const coffeeTypes = [
  "ویتنام","برزیل","چری","کلمبیا","اندونزی PB","اوگاندا",
  "اتیوپی","کنیا","یمن","گواتمالا","هندوراس","پرو","مکزیک",
  "پاناما","کاستاریکا","اندونزی عربیکا","جاوا عربیکا","بوربون",
  "تیپیکا","اندونزی روبوستا","برزیل روبوستا","هند روبوستا",
  " 70/30 میکس عربیکا","50/50 میکس","100 عربیکا ","100 ربوستا ","70/30 میکس ربوستا"
];
        const roastTypes = ["مدیوم", "شکلاتی", "دارک"];
        const powderTypes = ["گلد", "کاپوچینو ۷۰/۳۰", "کرک چای", "ماسالا", "هات چاکلت"];
        

        function createDropdown(options) {
            const select = document.createElement('select');
            options.forEach(optionText => {
                const option = document.createElement('option');
                option.value = optionText;
                option.textContent = optionText;
                select.appendChild(option);
            });
            return select;
        }

        function createCoffeeRow() {
            const row = document.createElement('div');
            row.className = 'price-list-dynamic-row';

            const coffeeTypeSelect = createDropdown(coffeeTypes);
            const roastTypeSelect = createDropdown(roastTypes);
            const priceInput = document.createElement('input');
            priceInput.type = 'number';
            priceInput.placeholder = 'قیمت';
            const percentageInput = document.createElement('input');
            percentageInput.type = 'number';
            percentageInput.placeholder = 'درصد';

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'حذف';
            removeBtn.className = 'calc-button remove-row-btn';
            removeBtn.onclick = () => row.remove();

            row.append(coffeeTypeSelect, roastTypeSelect, priceInput, percentageInput, removeBtn);
            coffeeListContainer.appendChild(row);
        }

        function createPowderRow() {
            const row = document.createElement('div');
            row.className = 'price-list-dynamic-row';

            const powderTypeSelect = createDropdown(powderTypes);
            const priceInput = document.createElement('input');
            priceInput.type = 'number';
            priceInput.placeholder = 'قیمت';
            const percentageInput = document.createElement('input');
            percentageInput.type = 'number';
            percentageInput.placeholder = 'درصد';

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'حذف';
            removeBtn.className = 'calc-button remove-row-btn';
            removeBtn.onclick = () => row.remove();

            row.append(powderTypeSelect, priceInput, percentageInput, removeBtn);
            powderListContainer.appendChild(row);
        }

        function generateImage() {
            const brandName = document.getElementById('brand-name').value || 'کافه شما';
            const socialId = document.getElementById('social-id').value || '@your_cafe';

            document.getElementById('image-brand-name').textContent = brandName;
            document.getElementById('image-social-id').textContent = socialId;

            const imageTemplate = document.getElementById('image-output-template');
            const imageCoffeeList = imageTemplate.querySelector('#image-coffee-list');
            const imagePowderList = imageTemplate.querySelector('#image-powder-list');

            imageCoffeeList.innerHTML = '<h3>دانه‌های قهوه</h3>';
            imagePowderList.innerHTML = '<h3>محصولات پودری</h3>';

            let hasCoffee = false;
            coffeeListContainer.querySelectorAll('.price-list-dynamic-row').forEach(row => {
                const [coffee, roast, priceStr, percentStr] = Array.from(row.children).map(el => el.value);
                const price = parseFloat(priceStr);
                const percent = parseFloat(percentStr);
                if (price && percent) {
                    hasCoffee = true;
                    const finalPrice = price * (1 + (percent / 100));
                    const item = document.createElement('div');
                    item.className = 'image-item-row';
                    item.innerHTML = `<span class="item-name">${coffee} (${roast})</span><span class="item-price">${formatCurrency(finalPrice)} تومان</span>`;
                    imageCoffeeList.appendChild(item);
                }
            });
            if (!hasCoffee) imageCoffeeList.innerHTML = '';

            let hasPowder = false;
            powderListContainer.querySelectorAll('.price-list-dynamic-row').forEach(row => {
                const [powder, priceStr, percentStr] = Array.from(row.children).map(el => el.value);
                const price = parseFloat(priceStr);
                const percent = parseFloat(percentStr);
                if (price && percent) {
                    hasPowder = true;
                    const finalPrice = price * (1 + (percent / 100));
                    const item = document.createElement('div');
                    item.className = 'image-item-row';
                    item.innerHTML = `<span class="item-name">${powder}</span><span class="item-price">${formatCurrency(finalPrice)} تومان</span>`;
                    imagePowderList.appendChild(item);
                }
            });
            if (!hasPowder) imagePowderList.innerHTML = '';

            if (!hasCoffee && !hasPowder) {
                alert('لطفا حداقل یک مورد را برای ایجاد تصویر وارد کنید.');
                return;
            }

            imageTemplate.style.display = 'block';

            html2canvas(imageTemplate, { useCORS: true, scale: 2 }).then(canvas => {
                const image = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.href = image;
                link.download = `${brandName.replace(/\s+/g, '-')}-price-list.png`;
                link.click();
                imageTemplate.style.display = 'none';
            });
        }

        addCoffeeRowBtn.addEventListener('click', createCoffeeRow);
        addPowderRowBtn.addEventListener('click', createPowderRow);
        generateImageBtn.addEventListener('click', generateImage);

        // Add one of each row by default
        createCoffeeRow();
        createPowderRow();
    }
});