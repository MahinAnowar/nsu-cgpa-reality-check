
// --- Constants, DOM Refs (keep all the same) ---
const GRADE_POINTS = Object.freeze({ "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7, "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "F": 0.0 });
const MIN_COURSES_TO_SHOW = 1;
const GAUGE_RADIUS = 45;
const GAUGE_CIRCUMFERENCE = 2 * Math.PI * GAUGE_RADIUS;
const MAX_CGPA = 4.0;
const MAX_CREDITS = 150;
// DOM Element Refs ... (Keep all from previous step)
const addCourseBtn = document.getElementById("addCourseBtn"); const calculateBtn = document.getElementById("calculateBtn"); const resetBtn = document.getElementById("resetBtn"); const themeToggleBtn = document.getElementById("themeToggleBtn"); const mainTableBody = document.getElementById("mainTableBody"); const prevCrInput = document.getElementById("prevCr"); const prevCgInput = document.getElementById("prevCg"); const resultsSection = document.getElementById("resultsSection"); const errorMessagesDiv = document.getElementById("errorMessages"); const emptyStateRow = document.getElementById("emptyStateRow"); const cgpaCircleProgress = document.getElementById("cgpaCircleProgress"); const creditsCircleProgress = document.getElementById("creditsCircleProgress"); const cgpaTextValue = document.getElementById("cgpaTextValue"); const creditsTextValue = document.getElementById("creditsTextValue"); const htmlElement = document.documentElement; const themeIcon = themeToggleBtn.querySelector('.theme-icon');
let courseCounter = 0;


// --- Helper Functions (checkEmptyState, addCourseRow, removeCourseRow, clearAllErrors - keep same) ---
function checkEmptyState() { const courseRows = mainTableBody.querySelectorAll('tr.course-row'); emptyStateRow.style.display = courseRows.length === 0 ? 'table-row' : 'none'; }
function addCourseRow(isInitial = false) { courseCounter++; const newRowElement = document.createElement('tr'); newRowElement.classList.add('course-row', 'data-row', 'align-middle'); if (!isInitial) { newRowElement.classList.add('row-entering'); } newRowElement.innerHTML = ` <td class="px-1 sm:px-4 py-2"><input class="form-control form-control-sm" aria-label="Course ${courseCounter} Initial" placeholder="Course Initial (e.g., CSE115)" type="text"></td> <td class="px-1 sm:px-4 py-2"><input class="form-control form-control-sm course-credit" aria-label="Course ${courseCounter} Credits" placeholder="Credits" type="number" min="0.5" step="0.5" title="Credits for this course (e.g., 3.0 or 1.5)."></td> <td class="px-1 sm:px-4 py-2"><select class="form-control form-control-sm course-grade" aria-label="Course ${courseCounter} Grade"><option>A</option><option>A-</option><option>B+</option><option>B</option><option>B-</option><option>C+</option><option>C</option><option>C-</option><option>D+</option><option>D</option><option>F</option></select></td> <td class="px-1 sm:px-4 py-2 text-center"><button class="btn btn-danger remove-course-btn" type="button" aria-label="Remove Course ${courseCounter}">❌</button></td> `; if(emptyStateRow) { mainTableBody.insertBefore(newRowElement, emptyStateRow); } else { mainTableBody.appendChild(newRowElement); } if (!isInitial) { requestAnimationFrame(() => { newRowElement.classList.remove('row-entering'); }); } checkEmptyState(); }
function removeCourseRow(event) { if (event.target.classList.contains('remove-course-btn')) { const rowToRemove = event.target.closest('tr.course-row'); if (rowToRemove) { rowToRemove.classList.add('row-removing'); rowToRemove.addEventListener('transitionend', () => { rowToRemove.remove(); checkEmptyState(); resultsSection.style.display = 'none'; }, { once: true }); } } }
function clearAllErrors() { const errorInputs = document.querySelectorAll('.input-error'); errorInputs.forEach(input => input.classList.remove('input-error')); errorMessagesDiv.textContent = ''; }

// --- setGaugeValue (remains the same) ---
function setGaugeValue(circleElement, textElement, value, max) {
    if (!circleElement || !textElement) return; // Safety check
    if (isNaN(value) || isNaN(max) || max <= 0) { value = 0; max = 1; }
    const clampedValue = Math.max(0, Math.min(value, max));
    const percentage = clampedValue / max;
    const offset = GAUGE_CIRCUMFERENCE * (1 - percentage);
    circleElement.style.strokeDashoffset = offset; // Apply style

    // Update text
    if(textElement.id === 'cgpaTextValue') { textElement.textContent = clampedValue.toFixed(2); }
    else { textElement.textContent = value.toFixed(1); } // Show credits with .1 precision maybe? Or Math.round(value)
}

// --- calculateCgpa (UPDATED TO FIX ANIMATION TIMING) ---
function calculateCgpa() {
     // --- Validation remains the same ---
     clearAllErrors();
     let hasError = false;
     let errors = [];
     let prevCredits = parseFloat(prevCrInput.value) || 0; let prevCgpa = parseFloat(prevCgInput.value) || 0;
     if (prevCrInput.value.trim() !== '' && (isNaN(prevCredits) || prevCredits < 0)) { prevCrInput.classList.add('input-error'); errors.push("Prev Credits invalid."); hasError = true; prevCredits = 0; }
     if (prevCgInput.value.trim() !== '' && (isNaN(prevCgpa) || prevCgpa < 0 || prevCgpa > 4)) { prevCgInput.classList.add('input-error'); errors.push("Prev CGPA invalid (0-4)."); hasError = true; prevCgpa = 0; }
     const currentCoursesData = []; const courseRows = mainTableBody.querySelectorAll('tr.course-row'); let totalCurrentCredits = 0;
     courseRows.forEach((row, index) => { const creditInput = row.querySelector('.course-credit'); const gradeSelect = row.querySelector('.course-grade'); let rowError = false; const credits = parseFloat(creditInput.value); if (!creditInput.value.trim() || isNaN(credits) || credits <= 0) { creditInput.classList.add('input-error'); errors.push(`Course ${index + 1}: Credits invalid (>0).`); hasError = true; rowError = true; } const grade = gradeSelect.value; const gradePoint = GRADE_POINTS[grade]; if (gradePoint === undefined) { errors.push(`Course ${index + 1}: Invalid grade.`); hasError = true; rowError = true; } if (!rowError) { currentCoursesData.push({ credits: credits, gradePoint: gradePoint }); totalCurrentCredits += credits; } });
     if (courseRows.length === 0 && prevCredits <= 0) { errors.push('Please add courses or enter previous details.'); hasError = true; }
     if (hasError) { errorMessagesDiv.innerHTML = errors.join('<br>'); resultsSection.style.display = 'none'; return; }

     // --- Calculation remains the same ---
     let totalCurrentGradePointsEarned = currentCoursesData.reduce((sum, course) => sum + (course.credits * course.gradePoint), 0);
     const totalOverallCredits = prevCredits + totalCurrentCredits;
     const totalOverallGradePointsEarned = (prevCredits * prevCgpa) + totalCurrentGradePointsEarned;
     let finalCgpa = (totalOverallCredits > 0) ? totalOverallGradePointsEarned / totalOverallCredits : 0;

     // --- Make results visible and THEN update gauges in next frame ---
     // 1. Clear previous errors and Make results visible
     errorMessagesDiv.textContent = ''; // Clear errors on success calculation
     resultsSection.style.display = 'block';

     // 2. Update Text Immediately (Optional but good for perceived responsiveness)
      if(cgpaTextValue) cgpaTextValue.textContent = finalCgpa.toFixed(2);
      if(creditsTextValue) creditsTextValue.textContent = totalOverallCredits.toFixed(1);

     // 3. Schedule the gauge SVG style update for the *next frame*
     requestAnimationFrame(() => {
          setGaugeValue(cgpaCircleProgress, cgpaTextValue, finalCgpa, MAX_CGPA);
          setGaugeValue(creditsCircleProgress, creditsTextValue, totalOverallCredits, MAX_CREDITS);
     });
}

// --- resetCalculator (remains the same, but relies on setGaugeValue resetting) ---
 function resetCalculator() {
    if (!confirm("Are you sure you want to clear all inputs and results?")) return;
    clearAllErrors(); prevCrInput.value = ''; prevCgInput.value = '';
    mainTableBody.querySelectorAll('tr.course-row').forEach(row => row.remove());
    for (let i = 0; i < MIN_COURSES_TO_SHOW; i++) { addCourseRow(true); }
    // Set gauges back to 0 *before* hiding the section
     setGaugeValue(cgpaCircleProgress, cgpaTextValue, 0, MAX_CGPA);
     setGaugeValue(creditsCircleProgress, creditsTextValue, 0, MAX_CREDITS);
    resultsSection.style.display = 'none'; // Now hide it
    errorMessagesDiv.textContent = ''; checkEmptyState();
}


// --- Theme Functions (remain the same) ---
 function toggleTheme() { const isDarkMode = htmlElement.classList.toggle('dark'); localStorage.setItem('theme', isDarkMode ? 'dark' : 'light'); updateThemeUI(isDarkMode); }
 function updateThemeUI(isDarkMode) { if (themeIcon) { themeIcon.textContent = isDarkMode ? '🌙' : '☀️'; } }
 function loadTheme() { const savedTheme = localStorage.getItem('theme'); const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches; let isDarkMode = savedTheme ? savedTheme === 'dark' : systemPrefersDark; if (isDarkMode) htmlElement.classList.add('dark'); else htmlElement.classList.remove('dark'); updateThemeUI(isDarkMode); }


// --- Event Listeners (remain the same) ---
addCourseBtn.addEventListener('click', () => addCourseRow(false));
calculateBtn.addEventListener('click', calculateCgpa);
resetBtn.addEventListener('click', resetCalculator);
themeToggleBtn.addEventListener('click', toggleTheme);
mainTableBody.addEventListener('click', removeCourseRow);

// --- Initial Setup (remain the same) ---
document.addEventListener('DOMContentLoaded', () => {
     loadTheme();
      // Ensure initial stroke offset is set for empty state
      if (cgpaCircleProgress) cgpaCircleProgress.style.strokeDashoffset = GAUGE_CIRCUMFERENCE;
      if (creditsCircleProgress) creditsCircleProgress.style.strokeDashoffset = GAUGE_CIRCUMFERENCE;

     const existingRows = mainTableBody.querySelectorAll('tr.course-row').length;
     if (existingRows < MIN_COURSES_TO_SHOW) {
         for(let i = existingRows; i < MIN_COURSES_TO_SHOW; i++) {
             addCourseRow(true);
         }
     }
     checkEmptyState();
});

