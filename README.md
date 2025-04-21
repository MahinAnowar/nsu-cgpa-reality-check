# nsu-cgpa-reality-check 🌀


Tired of waiting anxiously for RDS to update? Want a quick estimate of where your CGPA might land after this semester? The **NSU CGPA Reality Check** tool gives you an instant preview!

This web application allows North South University students to easily calculate their potential cumulative GPA (CGPA) by entering their previous academic details and current semester grades. It provides immediate feedback with stylish, animated SVG gauges for CGPA and total credits earned.

---

## ✨ Features

*   **Instant CGPA Calculation:** Input previous CGPA/Credits and current course grades to see your estimated overall CGPA.
*   **Visual Results:** Animated SVG gauges display your estimated CGPA and total credits dynamically.
*   **Course Management:** Easily add or remove course rows for the current semester.
*   **Previous History:** Incorporates your previous total credits and CGPA into the calculation.
*   **Responsive Design:** Looks and works great on desktop, tablet, and mobile devices.
*   **Theme Toggle:** Switch between Light and Dark mode ☀️ / 🌙 (adapts to system preference initially).
*   **Input Validation:** Basic checks to prevent calculation errors from invalid inputs.
*   **Pure Vanilla JS:** No heavy frameworks, keeping it lightweight and fast.

---

## 🚀 Tech Stack

*   **HTML5**
*   **CSS3:**
    *   **Tailwind CSS v1:** For rapid utility-first styling.
    *   **Custom CSS:** For SVG gauge styling, animations, and specific layout tweaks.
*   **Vanilla JavaScript (ES6+):** For DOM manipulation, calculations, event handling, and animations.
*   **SVG:** For creating the interactive result gauges.

---

## 🕹️ How to Use

**Live Version:**

1.  Visit the live demo: [https://mahinanowar.github.io/nsu-cgpa-reality-check/](https://mahinanowar.github.io/nsu-cgpa-reality-check/)
2.  Enter your **Previous Credits** and **Previous CGPA** (if applicable, otherwise leave blank or enter 0).
3.  For each course taken this semester:
    *   Enter the **Credits** for the course.
    *   Select the expected **Grade**.
    *   (Optional) Enter the **Course Initial**.
4.  Use the `➕ Add Course` button if you took more courses than initially shown.
5.  Use the `❌` button to remove any course rows you don't need.
6.  Click the `✔️ Calculate CGPA` button.
7.  View your estimated results in the animated gauges!
8.  Use the `🔄 Reset` button to clear all inputs.

**Local Setup:**

1.  Clone the repository:
    ```bash
    git clone https://github.com/MahinAnowar/nsu-cgpa-reality-check.git
    ```
2.  Navigate to the directory:
    ```bash
    cd nsu-cgpa-reality-check
    ```
3.  Open the `index.html` file in your web browser.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/MahinAnowar/nsu-cgpa-reality-check/issues) if you want to contribute. Please adhere to standard coding practices and provide clear descriptions for issues and pull requests.

---
