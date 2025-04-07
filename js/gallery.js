const galleryData = {
    "2024-2025": [
        { title: "Tech Symposium", photos: Array.from({ length: 20 }, (_, i) => `https://picsum.photos/300/200?random=${i + 1}`) },
        { title: "Hackathon", photos: Array.from({ length: 20 }, (_, i) => `https://picsum.photos/300/200?random=${i + 21}`) },
        { title: "Coding Bootcamp", photos: Array.from({ length: 20 }, (_, i) => `https://picsum.photos/300/200?random=${i + 41}`) },
        { title: "AI Workshop", photos: Array.from({ length: 20 }, (_, i) => `https://picsum.photos/300/200?random=${i + 61}`) },
        { title: "Google DevFest", photos: Array.from({ length: 20 }, (_, i) => `https://picsum.photos/300/200?random=${i + 81}`) }
    ],
    "2023-2024": [
        { title: "Web Dev Seminar", photos: Array.from({ length: 20 }, (_, i) => `https://picsum.photos/300/200?random=${i + 101}`) },
        { title: "App Dev Challenge", photos: Array.from({ length: 20 }, (_, i) => `https://picsum.photos/300/200?random=${i + 121}`) }
    ],
    "2022-2023": [
        { title: "Intro to GDSC", photos: Array.from({ length: 20 }, (_, i) => `https://picsum.photos/300/200?random=${i + 141}`) },
        { title: "Open Source Day", photos: Array.from({ length: 20 }, (_, i) => `https://picsum.photos/300/200?random=${i + 161}`) }
    ]
};

function updateEvents(year) {
    const eventDropdown = document.getElementById("eventDropdown");
    eventDropdown.innerHTML = ""; // Clear existing options

    let events = [];
    if (year === "all") {
        Object.values(galleryData).forEach(yearData => {
            events = events.concat(yearData);
        });
    } else {
        events = galleryData[year];
    }

    events.forEach(event => {
        const option = document.createElement("option");
        option.value = event.title;
        option.textContent = event.title;
        eventDropdown.appendChild(option);
    });

    updatePhotos(); // Show photos for the first event by default
}

function updatePhotos() {
    const year = document.querySelector(".year-btn.active").dataset.year;
    const eventTitle = document.getElementById("eventDropdown").value;
    const photoGrid = document.getElementById("photoGrid");
    photoGrid.innerHTML = ""; // Clear existing photos

    let photos = [];
    if (year === "all") {
        Object.values(galleryData).flat().forEach(event => {
            if (event.title === eventTitle) {
                photos = event.photos;
            }
        });
    } else {
        photos = galleryData[year].find(event => event.title === eventTitle).photos;
    }

    photos.forEach(photo => {
        const photoItem = document.createElement("div");
        photoItem.classList.add("photo-item");

        const img = document.createElement("img");
        img.src = photo;
        img.alt = `${eventTitle} Photo`;

        photoItem.appendChild(img);
        photoGrid.appendChild(photoItem);
    });
}

// Handle year button clicks
document.querySelectorAll(".year-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".year-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        updateEvents(btn.dataset.year);
    });
});

// Load 2024-2025 by default
window.onload = () => {
    updateEvents("2024-2025");
};