console.log("Cat app starting...");

const breedSelect = document.getElementById("breedSelect");
const infoDump = document.getElementById("infoDump");
const progressBar = document.getElementById("progressBar");
const getFavouritesBtn = document.getElementById("getFavouritesBtn");
const carouselInner = document.getElementById("carouselInner");

// Put your API key here (required for favourites)
// Get one free at: https://thecatapi.com/signup
const API_KEY = ""; // Add your API key here for favorites to work

/* -------------------------
   Axios defaults
-------------------------- */
axios.defaults.baseURL = "https://api.thecatapi.com/v1";
if (API_KEY) {
  axios.defaults.headers.common["x-api-key"] = API_KEY;
}

/* -------------------------
   Axios Interceptors
-------------------------- */
axios.interceptors.request.use((config) => {
  // Store start time for performance tracking
  config.metadata = { startTime: performance.now() };

  console.log(
    `[Axios] Request started: ${config.method?.toUpperCase()} ${config.url}`
  );

  // Start progress bar
  progressBar.style.width = "0%";
  document.body.style.cursor = "progress";

  return config;
});

axios.interceptors.response.use(
  (response) => {
    const end = performance.now();
    const ms = end - (response.config.metadata?.startTime ?? end);

    console.log(
      `[Axios] Response received in ${ms.toFixed(1)}ms: ${response.config.url}`
    );

    // Complete progress bar
    progressBar.style.width = "100%";
    setTimeout(() => {
      progressBar.style.width = "0%";
    }, 500);
    document.body.style.cursor = "";

    return response;
  },
  (error) => {
    document.body.style.cursor = "";
    progressBar.style.width = "0%";
    console.error("[Axios] Error:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

/* -------------------------
   Progress handler
-------------------------- */
function updateProgress(evt) {
  if (!evt.lengthComputable || !evt.total) {
    progressBar.style.width = "50%";
    return;
  }

  const pct = Math.round((evt.loaded / evt.total) * 100);
  progressBar.style.width = `${Math.min(pct, 90)}%`;
}

/* -------------------------
   Render breed information
-------------------------- */
function renderBreedInfo(breed) {
  if (!breed) {
    infoDump.innerHTML = "<p>No breed information available.</p>";
    return;
  }

  infoDump.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = breed.name || "Unknown Breed";

  const desc = document.createElement("p");
  desc.textContent = breed.description || "No description available.";

  const meta = document.createElement("div");
  meta.innerHTML = `
    <p><strong>Origin:</strong> ${breed.origin || "N/A"}</p>
    <p><strong>Temperament:</strong> ${breed.temperament || "N/A"}</p>
    <p><strong>Life span:</strong> ${breed.life_span || "N/A"} years</p>
    ${
      breed.wikipedia_url
        ? `<p><strong>Wikipedia:</strong> <a href="${breed.wikipedia_url}" target="_blank" rel="noreferrer">Learn more</a></p>`
        : ""
    }
  `;

  infoDump.appendChild(title);
  infoDump.appendChild(desc);
  infoDump.appendChild(meta);
}

/* -------------------------
   Build Bootstrap Carousel
-------------------------- */
function buildCarousel(images) {
  carouselInner.innerHTML = "";

  if (!Array.isArray(images) || images.length === 0) {
    carouselInner.innerHTML = `
      <div class="carousel-item active">
        <div class="card">
          <div class="img-wrapper">
            <p class="text-muted">No images available</p>
          </div>
        </div>
      </div>
    `;
    return;
  }

  images.forEach((img, idx) => {
    const item = document.createElement("div");
    item.className = `carousel-item ${idx === 0 ? "active" : ""}`;

    item.innerHTML = `
      <div class="card">
        <div class="img-wrapper position-relative">
          <img src="${img.url}" class="d-block w-100" alt="Cat ${idx + 1}" 
               onerror="this.src='https://via.placeholder.com/800x500?text=Image+Not+Available'" />
          <button class="btn btn-light position-absolute top-0 end-0 m-2"
                  data-img-id="${img.id}" 
                  title="Toggle favourite"
                  aria-label="Add to favorites">
            ❤️
          </button>
        </div>
      </div>
    `;

    carouselInner.appendChild(item);
  });

  // Bind favorite button click handlers
  carouselInner.querySelectorAll("button[data-img-id]").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const imgId = e.currentTarget.getAttribute("data-img-id");
      
      if (!API_KEY) {
        alert("⚠️ Favorites require an API key!\n\nGet a free API key at:\nhttps://thecatapi.com/signup\n\nThen add it to the API_KEY variable in index.js");
        return;
      }

      try {
        const result = await favourite(imgId);
        
        // Toggle button style based on result
        if (result.status === "created") {
          e.currentTarget.classList.remove("btn-light");
          e.currentTarget.classList.add("btn-danger");
          e.currentTarget.title = "Remove from favorites";
        } else {
          e.currentTarget.classList.remove("btn-danger");
          e.currentTarget.classList.add("btn-light");
          e.currentTarget.title = "Add to favorites";
        }
      } catch (err) {
        console.error("Favorite error:", err);
        alert("Failed to update favorite. Check console for details.");
      }
    });
  });

  // Reinitialize Bootstrap carousel
  const carouselElement = document.getElementById("carouselExampleControls");
  const existingCarousel = bootstrap.Carousel.getInstance(carouselElement);
  if (existingCarousel) {
    existingCarousel.dispose();
  }
  new bootstrap.Carousel(carouselElement, {
    interval: false,
    wrap: true
  });
}

/* -------------------------
   Initial Load - Get all breeds
-------------------------- */
async function initialLoad() {
  try {
    const res = await axios.get("/breeds", {
      onDownloadProgress: updateProgress,
    });

    const breeds = res.data;

    if (!Array.isArray(breeds) || breeds.length === 0) {
      throw new Error("No breeds returned from API");
    }

    // Populate breed selector
    breedSelect.innerHTML = "";
    breeds.forEach((breed) => {
      const opt = document.createElement("option");
      opt.value = breed.id;
      opt.textContent = breed.name;
      breedSelect.appendChild(opt);
    });

    // Load first breed
    if (breeds.length > 0) {
      breedSelect.value = breeds[0].id;
      await handleBreedChange();
    }

    console.log(`✅ Loaded ${breeds.length} breeds`);
  } catch (error) {
    console.error("Initial load failed:", error);
    infoDump.innerHTML = `
      <div class="alert alert-danger" role="alert">
        <h4>Failed to load breeds</h4>
        <p>Please check your internet connection and try refreshing the page.</p>
        <p class="mb-0"><small>Error: ${error.message}</small></p>
      </div>
    `;
    throw error;
  }
}

/* -------------------------
   Handle breed selection change
-------------------------- */
async function handleBreedChange() {
  const breedId = breedSelect.value;

  if (!breedId) return;

  try {
    const res = await axios.get("/images/search", {
      params: {
        breed_ids: breedId,
        limit: 10,
        size: "med",
        order: "RANDOM",
      },
      onDownloadProgress: updateProgress,
    });

    const images = res.data;

    if (!Array.isArray(images) || images.length === 0) {
      carouselInner.innerHTML = "";
      infoDump.innerHTML = `
        <div class="alert alert-warning" role="alert">
          No images found for this breed. Try selecting another breed.
        </div>
      `;
      return;
    }

    // Build carousel with images
    buildCarousel(images);

    // Display breed information
    const breed = images[0]?.breeds?.[0];
    renderBreedInfo(breed);

    console.log(`✅ Loaded ${images.length} images for breed: ${breedId}`);
  } catch (error) {
    console.error("Breed change error:", error);
    infoDump.innerHTML = `
      <div class="alert alert-danger" role="alert">
        Failed to load images for this breed.
      </div>
    `;
  }
}

// Listen for breed selection changes
breedSelect.addEventListener("change", handleBreedChange);

/* -------------------------
   Toggle Favorite (requires API key)
-------------------------- */
async function favourite(imgId) {
  if (!API_KEY) {
    throw new Error("API key required for favorites");
  }

  try {
    // Get current favorites
    const favRes = await axios.get("/favourites", {
      onDownloadProgress: updateProgress,
    });

    const favs = favRes.data;
    const existing = favs.find((f) => String(f.image_id) === String(imgId));

    if (existing) {
      // Remove from favorites
      await axios.delete(`/favourites/${existing.id}`, {
        onDownloadProgress: updateProgress,
      });
      console.log(`❌ Unfavorited image: ${imgId}`);
      return { status: "deleted", imgId };
    } else {
      // Add to favorites
      const created = await axios.post(
        "/favourites",
        { image_id: imgId },
        { onDownloadProgress: updateProgress }
      );
      console.log(`❤️ Favorited image: ${imgId}`);
      return { status: "created", imgId, favouriteId: created.data?.id };
    }
  } catch (error) {
    console.error("Favorite error:", error);
    throw error;
  }
}

/* -------------------------
   Get all favorites (requires API key)
-------------------------- */
async function getFavourites() {
  if (!API_KEY) {
    alert("⚠️ Favorites require an API key!\n\nGet a free API key at:\nhttps://thecatapi.com/signup\n\nThen add it to the API_KEY variable in index.js");
    return;
  }

  try {
    const res = await axios.get("/favourites", {
      onDownloadProgress: updateProgress,
    });

    const favs = res.data;

    if (!Array.isArray(favs) || favs.length === 0) {
      carouselInner.innerHTML = "";
      infoDump.innerHTML = `
        <div class="alert alert-info" role="alert">
          <h4>No favorites yet</h4>
          <p>Click the ❤️ button on any cat image to add it to your favorites!</p>
        </div>
      `;
      return;
    }

    // Extract images from favorites
    const images = favs
      .filter((f) => f.image && f.image.url)
      .map((f) => ({ 
        id: f.image_id, 
        url: f.image.url 
      }));

    buildCarousel(images);
    
    infoDump.innerHTML = `
      <h2>❤️ Your Favorites</h2>
      <p>You have ${images.length} favorite cat${images.length !== 1 ? 's' : ''}!</p>
    `;

    console.log(`✅ Loaded ${images.length} favorites`);
  } catch (error) {
    console.error("Get favorites error:", error);
    infoDump.innerHTML = `
      <div class="alert alert-danger" role="alert">
        Failed to load favorites. Please check your API key and try again.
      </div>
    `;
  }
}

// Get favorites button click handler
getFavouritesBtn.addEventListener("click", getFavourites);

/* -------------------------
   Initialize app
-------------------------- */
initialLoad().catch((error) => {
  console.error("❌ App initialization failed:", error);
});