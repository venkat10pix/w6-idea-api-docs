document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const form = document.getElementById("idea-form");
  const titleInput = document.getElementById("idea-title");
  const descInput = document.getElementById("idea-desc");
  const titleError = document.getElementById("title-error");
  const descError = document.getElementById("desc-error");
  const submitBtn = document.getElementById("submit-btn");
  const gallery = document.getElementById("idea-gallery");
  const emptyState = document.getElementById("empty-state");
  const ideaCountBadge = document.getElementById("idea-count-badge");
  const titleCount = document.getElementById("title-count");
  const descCount = document.getElementById("desc-count");

  let ideaCount = 0;

  // Character count handlers
  const updateCharCount = (input, counterElement, max) => {
    const length = input.value.length;
    counterElement.textContent = length;

    // Update styling based on proximity to limit
    const percentage = length / max;
    counterElement.parentElement.classList.remove("near-limit", "at-limit");
    if (percentage >= 1) {
      counterElement.parentElement.classList.add("at-limit");
    } else if (percentage >= 0.8) {
      counterElement.parentElement.classList.add("near-limit");
    }
  };

  titleInput.addEventListener("input", () => {
    updateCharCount(titleInput, titleCount, 50);
    // Clear error on generic input
    if (titleInput.parentElement.classList.contains("invalid")) {
      titleInput.parentElement.classList.remove("invalid");
      titleError.textContent = "";
    }
  });

  descInput.addEventListener("input", () => {
    updateCharCount(descInput, descCount, 500);
    if (descInput.parentElement.classList.contains("invalid")) {
      descInput.parentElement.classList.remove("invalid");
      descError.textContent = "";
    }
  });

  // Validation logic
  const validateForm = () => {
    let isValid = true;
    const titleVal = titleInput.value.trim();
    const descVal = descInput.value.trim();

    // Validate Title
    if (!titleVal) {
      titleInput.parentElement.classList.add("invalid");
      titleError.textContent = "Idea Title is required.";
      isValid = false;
    } else if (titleVal.length > 50) {
      titleInput.parentElement.classList.add("invalid");
      titleError.textContent = "Title must be 50 characters or less.";
      isValid = false;
    } else {
      titleInput.parentElement.classList.remove("invalid");
      titleError.textContent = "";
    }

    // Validate Description
    if (!descVal) {
      descInput.parentElement.classList.add("invalid");
      descError.textContent = "Description is required.";
      isValid = false;
    } else if (descVal.length > 500) {
      descInput.parentElement.classList.add("invalid");
      descError.textContent = "Description must be 500 characters or less.";
      isValid = false;
    } else {
      descInput.parentElement.classList.remove("invalid");
      descError.textContent = "";
    }

    // Force screen reader to announce error if invalid, setting focus to first invalid
    if (!isValid) {
      if (!titleVal || titleVal.length > 50) {
        titleInput.focus();
      } else {
        descInput.focus();
      }
    }

    return isValid;
  };

  // Date formatting helper
  const formatDate = () => {
    const now = new Date();
    const dateOptions = { month: "short", day: "numeric", year: "numeric" };
    const timeOptions = { hour: "2-digit", minute: "2-digit" };
    return `${now.toLocaleDateString(undefined, dateOptions)} at ${now.toLocaleTimeString(undefined, timeOptions)}`;
  };

  // Sanitize input to prevent XSS
  const escapeHTML = (str) => {
    return str.replace(
      /[&<>'"]/g,
      (tag) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        })[tag] || tag,
    );
  };

  // Add idea to gallery DOM
  const addIdeaToGallery = (title, description) => {
    const ideaCard = document.createElement("article");
    ideaCard.className = "idea-card";
    ideaCard.tabIndex = 0; // Make focusable

    // Use animation delay based on existing cards for neat cascade effect if adding multiple.
    // Here we just add one at top so negligible.

    ideaCard.innerHTML = `
            <div class="idea-card-header">
                <h3>${escapeHTML(title)}</h3>
                <span class="idea-date">${formatDate()}</span>
            </div>
            <p>${escapeHTML(description)}</p>
        `;

    // Hide empty state if visible
    if (!emptyState.classList.contains("hidden")) {
      emptyState.classList.add("hidden");
    }

    // Prepend to gallery
    gallery.prepend(ideaCard);

    // Update count
    ideaCount++;
    ideaCountBadge.textContent = `${ideaCount} Idea${ideaCount !== 1 ? "s" : ""}`;
  };

  // Form Submit Handler
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent page reload

    if (validateForm()) {
      // Fake loading state for premium feel
      submitBtn.classList.add("loading");
      submitBtn.disabled = true;

      // Get values
      const title = titleInput.value.trim();
      const desc = descInput.value.trim();

      // Simulate slight delay for effect
      setTimeout(() => {
        // Add to gallery
        addIdeaToGallery(title, desc);

        // Reset form
        form.reset();
        updateCharCount(titleInput, titleCount, 50);
        updateCharCount(descInput, descCount, 500);

        // Clear loading state
        submitBtn.classList.remove("loading");
        submitBtn.disabled = false;

        // Announce to screen reader
        const announcement = document.createElement("div");
        announcement.setAttribute("role", "status");
        announcement.setAttribute("aria-live", "polite");
        announcement.className = "sr-only"; // Make it visually hidden
        announcement.style.position = "absolute";
        announcement.style.left = "-9999px";
        announcement.textContent =
          "Idea successfully submitted and added to the gallery.";
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 3000);
      }, 400); // 400ms fake delay
    }
  });
});
