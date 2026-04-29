const navItems = [
  ["Home", "index.html", "home"],
  ["About", "about.html", "about"],
  ["Contact", "contact.html", "contact"]
];

const page = document.body.dataset.page;
const interestFormEndpoint = "https://script.google.com/macros/s/AKfycbzvoPoBpSZ3QUXQAx4ldxhPOaUYx-qukwrpfFUf9gQsY7NuBDUkKCOLnMMW7r-zgPhy/exec";
const notificationEmail = "info@sslearninglab.com";

function renderHeader() {
  const navLinks = navItems
    .map(([label, href, key]) => {
      const activeClass = page === key ? "is-active" : "";
      return `<a class="${activeClass}" href="${href}">${label}</a>`;
    })
    .join("");

  const header = `
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="index.html">
          <span class="brand-seal">
            <img class="brand-mark" src="images/header-logo-circle.png" alt="S&S Learning Lab icon">
          </span>
          <div class="brand-copy">
            <strong>S&amp;S Learning Lab</strong>
          </div>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-label="Open navigation">Menu</button>
        <nav class="site-nav" aria-label="Primary navigation">${navLinks}</nav>
      </div>
    </header>
  `;

  document.getElementById("site-header").innerHTML = header;

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }
}

function renderFooter() {
  document.getElementById("site-footer").innerHTML = `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <img src="images/ss-learning-lab-icon.png" alt="S&S Learning Lab icon">
          <div>
            <strong>S&amp;S Learning Lab</strong>
            <p>Focus. Accountability. Success.</p>
          </div>
        </div>
        <nav class="footer-nav" aria-label="Footer navigation">
          <a href="index.html">Home</a>
          <a href="about.html">About Us</a>
          <a href="contact.html">Contact</a>
        </nav>
        <div class="footer-socials" aria-label="Social and contact links">
          <a class="footer-icon-link" href="https://www.facebook.com/profile.php?id=61564703307374" target="_blank" rel="noreferrer" aria-label="Facebook">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.6 1.7-1.6H16V4.8c-.3 0-.9-.1-1.8-.1-2.7 0-4.4 1.6-4.4 4.6V11H7v3h2.8v7h3.7Z"></path>
            </svg>
          </a>
          <a class="footer-icon-link" href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm0 1.8A2.7 2.7 0 0 0 4.8 7.5v9a2.7 2.7 0 0 0 2.7 2.7h9a2.7 2.7 0 0 0 2.7-2.7v-9a2.7 2.7 0 0 0-2.7-2.7h-9Zm9.6 1.35a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1ZM12 7.2A4.8 4.8 0 1 1 7.2 12 4.8 4.8 0 0 1 12 7.2Zm0 1.8A3 3 0 1 0 15 12a3 3 0 0 0-3-3Z"></path>
            </svg>
          </a>
          <a class="footer-icon-link" href="mailto:info@sslearninglab.com" aria-label="Email">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M4.5 5h15A2.5 2.5 0 0 1 22 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 16.5v-9A2.5 2.5 0 0 1 4.5 5Zm0 1.8a.7.7 0 0 0-.46.17L12 13.2l7.96-6.23a.7.7 0 0 0-.46-.17h-15Zm15.7 10.4V8.83l-7.64 5.98a.9.9 0 0 1-1.12 0L3.8 8.83v8.37c0 .39.31.7.7.7h15a.7.7 0 0 0 .7-.7Z"></path>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  `;
}

function wireForms() {
  const responses = {
    interest: "Thank you! We will be reaching out soon with next steps and early enrollment opportunities.",
    newsletter: "You're on the parent resource list. This block is ready to connect to Mailchimp for live email capture.",
    contact: "Your message is ready for follow-up. Connect this form to your preferred automation tool for live delivery and confirmation emails.",
    tour: "Your tour request is queued. Add your booking endpoint when ready to enable live confirmations."
  };

  function formDataToObject(form) {
    const formData = new FormData(form);
    const data = {};

    for (const [key, value] of formData.entries()) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    }

    return data;
  }

  async function submitInterestForm(formData) {
    const payload = {
      ...formData,
      submittedAt: new Date().toISOString(),
      recipientEmail: notificationEmail,
      sourcePage: page
    };

    if (!interestFormEndpoint) {
      localStorage.setItem("ss-learning-lab-interest", JSON.stringify(payload));
      return {
        ok: true,
        message: "The form is working on the page now. To send every inquiry into your Google Sheet and notify info@sslearninglab.com, paste your Google Apps Script web app URL into script.js."
      };
    }

    const response = await fetch(interestFormEndpoint, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Interest form submission failed.");
    }

    return {
      ok: true,
      message: "We received your interest form and will be in touch soon with next steps."
    };
  }

  function showInterestSuccessState(form, messageText) {
    form.classList.add("is-success");
    form.innerHTML = `
      <div class="form-success-state">
        <h2>Thank you for your submission.</h2>
        <p>${messageText}</p>
      </div>
    `;
  }

  document.querySelectorAll(".site-form").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const type = form.dataset.formType;
      const message = form.querySelector(".form-message");
      const formData = formDataToObject(form);
      const submitButton = form.querySelector('button[type="submit"]');
      const defaultLabel = submitButton ? submitButton.textContent : "";

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }

      try {
        if (type === "interest") {
          const result = await submitInterestForm(formData);
          showInterestSuccessState(form, result.message);
          return;
        } else {
          const storageKey = `ss-learning-lab-${type}`;
          localStorage.setItem(storageKey, JSON.stringify(formData));
          if (message) {
            message.textContent = responses[type] || "Thanks. We received your form.";
          }
        }

        form.reset();
      } catch (error) {
        if (message) {
          message.textContent = "The form could not be submitted yet. Once the Google Sheet endpoint is connected, inquiries will route automatically.";
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = defaultLabel;
        }
      }
    });
  });
}

function wireCalendar() {
  const calendarRoot = document.querySelector("[data-calendar-slots]");
  if (!calendarRoot) {
    return;
  }

  let weekOffset = 0;
  const slotInput = document.querySelector('input[name="selectedSlot"]');

  function nextWeekday(startDate, desiredDay, step) {
    const date = new Date(startDate);
    while (date.getDay() !== desiredDay) {
      date.setDate(date.getDate() + step);
    }
    return date;
  }

  function buildSlots() {
    const today = new Date();
    const monday = nextWeekday(today, 1, 1);
    monday.setDate(monday.getDate() + weekOffset * 7);
    const slotDays = [1, 2, 4];
    const labels = [];

    slotDays.forEach((day, index) => {
      const slotDate = new Date(monday);
      slotDate.setDate(monday.getDate() + (day - 1));
      labels.push({
        title: slotDate.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" }),
        time: index === 1 ? "12:30 PM tour" : "9:30 AM tour"
      });
      labels.push({
        title: slotDate.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" }),
        time: index === 2 ? "2:00 PM tour" : "1:15 PM tour"
      });
    });

    calendarRoot.innerHTML = labels
      .map((slot) => `
        <button type="button" class="slot-button" data-slot="${slot.title} | ${slot.time}">
          <strong>${slot.title}</strong>
          <span>${slot.time}</span>
        </button>
      `)
      .join("");

    calendarRoot.querySelectorAll(".slot-button").forEach((button) => {
      button.addEventListener("click", () => {
        calendarRoot.querySelectorAll(".slot-button").forEach((item) => item.classList.remove("is-selected"));
        button.classList.add("is-selected");
        if (slotInput) {
          slotInput.value = button.dataset.slot;
        }
      });
    });
  }

  buildSlots();

  document.querySelectorAll("[data-calendar-nav]").forEach((button) => {
    button.addEventListener("click", () => {
      weekOffset += button.dataset.calendarNav === "next" ? 1 : -1;
      if (weekOffset < 0) {
        weekOffset = 0;
      }
      buildSlots();
    });
  });
}

renderHeader();
renderFooter();
wireForms();
wireCalendar();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
