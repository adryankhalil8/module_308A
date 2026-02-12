// import * as Carousel from "./carousel.js";
// import axios from "axios";

// // The breed selection input element.
// const breedSelect = document.getElementById("breedSelect");
// // The information section div element.
// const infoDump = document.getElementById("infoDump");
// // The progress bar div element.
// const progressBar = document.getElementById("progressBar");
// // The get favourites button element.
// const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// // Step 0: Store your API key here for reference and easy access.
// const API_KEY = "live_1svFm9FrzizxA6bLwxwKGNGgFZ1kXJhngHNU1kIS2ojtZqm61XhnJzF9wqU0HxXu";

// /**
// /* -------------------------
//    Step 1: initialLoad()
// -------------------------- */
// async function initialLoad() {
//   // Get list of breeds
//   const res = await axios.get("/breeds", {
//     onDownloadProgress: updateProgress,
//   });

//   const breeds = res.data;

//   // Populate select
//   breedSelect.innerHTML = "";
//   breeds.forEach((breed) => {
//     const opt = document.createElement("option");
//     opt.value = breed.id;
//     opt.textContent = breed.name;
//     breedSelect.appendChild(opt);
//   });

//   // Build initial carousel using first breed
//   if (breeds.length > 0) {
//     breedSelect.value = breeds[0].id;
//     await handleBreedChange(); // Step 2: create initial carousel
//   }
// }

// /**
//  * 2. Create an event handler for breedSelect that does the following:
//  * - Retrieve information on the selected breed from the cat API using fetch().
//  *  - Make sure your request is receiving multiple array items!
//  *  - Check the API documentation if you're only getting a single object.
//  * - For each object in the response array, create a new element for the carousel.
//  *  - Append each of these new elements to the carousel.
//  * - Use the other data you have been given to create an informational section within the infoDump element.
//  *  - Be creative with how you create DOM elements and HTML.
//  *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
//  *  - Remember that functionality comes first, but user experience and design are important.
//  * - Each new selection should clear, re-populate, and restart the Carousel.
//  * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
//  */
// async function handleBreedChange() {
//   const breedId = breedSelect.value;

//   // IMPORTANT: to get an ARRAY of images, use /images/search with limit > 1
//   const res = await axios.get("/images/search", {
//     params: {
//       breed_ids: breedId,
//       limit: 10, // multiple items
//       size: "med",
//       order: "RANDOM",
//     },
//     onDownloadProgress: updateProgress,
//   });

//   const images = res.data; // should be array
//    // Some breeds (ex Malayan) sometimes return empty results.
//   // You must handle empty arrays.
//   if (!Array.isArray(images) || images.length === 0) {
//     if (Carousel.clear) Carousel.clear();
//     infoDump.innerHTML = `<p>No images found for this breed right now. Try another breed.</p>`;
//     return;
//   }
//   buildCarouselFromImages(images);

//   // Breed data is embedded in images[0].breeds[0] usually
//   const breed = images[0]?.breeds?.[0];
//   renderBreedInfo(breed, images[0]?.url);
// }

// breedSelect.addEventListener("change", handleBreedChange);


// /**
//  * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
//  */
// /**
//  * 4. Change all of your fetch() functions to axios!
//  * - axios has already been imported for you within index.js.
//  * - If you've done everything correctly up to this point, this should be simple.
//  * - If it is not simple, take a moment to re-evaluate your original code.
//  * - Hint: Axios has the ability to set default headers. Use this to your advantage
//  *   by setting a default header with your API key so that you do not have to
//  *   send it manually with all of your requests! You can also set a default base URL!
//  */
// axios.defaults.baseURL = "https://api.thecatapi.com/v1";
// axios.default.header.common["x-api-key"] = API_KEY;

// /**
//  * 5. Add axios interceptors to log the time between request and response to the console.
//  * - Hint: you already have access to code that does this!
//  * - Add a console.log statement to indicate when requests begin.
//  * - As an added challenge, try to do this on your own without referencing the lesson material.
//  */
// axios.interceptors.request.use((config) => {
//     config.metadata = { startTime: performance.now() };
//     console.log(`[Axios] Request started: ${config.method?.toUpperCase()} ${config.url}`);
//     progressBar.style.width = "0%";
//     document.body.style.cursor = "progress";

//     return config;
// });

// axios.interceptors.response.use(
//     (response) => {
//         const end = performance.now();
//         const ms = end - (response.config.metadata?.startTime ?? end);

//         console.log(`[Axios] Response received in ${ms.toFixed(1)}ms: ${response.config.url}`);

//         progressBar.style.widthe = "100%";
//         document.body.style.cursor = "";

//         return response;
//     },
//     (error) => {
//         document.body.style.cursor = "";
//         progressBar.style.width = "0%";

//         console.error("[Axios] Error:", error?.response?.data || error.message);
//     } 
// );

// /**
//  * 6. Next, we'll create a progress bar to indicate the request is in progress.
//  * - The progressBar element has already been created for you.
//  *  - You need only to modify its "width" style property to align with the request progress.
//  * - In your request interceptor, set the width of the progressBar element to 0%.
//  *  - This is to reset the progress with each request.
//  * - Research the axios onDownloadProgress config option.
//  * - Create a function "updateProgress" that receives a ProgressEvent object.
//  *  - Pass this function to the axios onDownloadProgress config option in your event handler.
//  * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
//  *  - Update the progress of the request using the properties you are given.
//  * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
//  *   once or twice per request to this API. This is still a concept worth familiarizing yourself
//  *   with for future projects.
//  */

// function updateProgess(evt) { 
//     comsole.log("ProgressEvent:", evt);

//     if (!evt,total) {
//         progressBar.style.width = "60%";
//         return;
//     }
//     const pct =Math.round((evt.loaded / evt.total) * 100);
//     progressBar.style.width = `${pct}%`;
// }

// function renderBreedInfo(breed, imageUrl) {
//     infoDump.innerHTML = "";

//     const title = document.createElement("h2");
//     title.textContent = breed?.name ?? "unkown Breed";

//     const img = document.createElement("img");
//     img.src = imageUrl ?? "";
//     img.alt = breed?.name ?? "Cat";
//     img.style.borderRadius = "12px";

//     const meta = document.createElement("div");
//   meta.innerHTML = `
//     <p><strong>Origin:</strong> ${breed?.origin ?? "N/A"}</p>
//     <p><strong>Temperament:</strong> ${breed?.temperament ?? "N/A"}</p>
//     <p><strong>Life span:</strong> ${breed?.life_span ?? "N/A"}</p>
//     <p><strong>Wikipedia:</strong> ${
//       breed?.wikipedia_url
//         ? `<a href="${breed.wikipedia_url}" target="_blank" rel="noreferrer">Link</a>`
//         : "N/A"
//     }</p>
//   `;

//   infoDump.append(title, img, desc, meta);
// }

// /* ---------------------------------------------------
//    Helper: rebuild carousel from image array
//    (you may need to rename these Carousel methods)
// --------------------------------------------------- */
// function buildCarouselFromImages(images) {
//   // Clear / reset
//   if (Carousel.clear) Carousel.clear();
//   if (Carousel.reset) Carousel.reset();

//   // Add slides
//   images.forEach((img) => {
//     // Expect TheCatAPI image object: { id, url, breeds: [...] }
//     const url = img.url;

//     // You MUST adapt this to your carousel.js API:
//     // Common patterns:
//     // - Carousel.append(url, img.id)
//     // - Carousel.addItem({ url, id })
//     // - Carousel.createCarouselItem(url, favourite)
//     if (Carousel.addItem) {
//       Carousel.addItem({ url, id: img.id });
//     } else if (Carousel.appendCarouselItem) {
//       Carousel.appendCarouselItem(url, img.id);
//     } else if (Carousel.createCarouselItem) {
//       Carousel.createCarouselItem(url, img.id);
//     } else {
//       console.warn("Update buildCarouselFromImages(): unknown Carousel API.");
//     }
//   });

//   // Restart
//   if (Carousel.start) Carousel.start();
// }
// /**
//  * 7. As a final element of progress indication, add the following to your axios interceptors:
//  * - In your request interceptor, set the body element's cursor style to "progress."
//  * - In your response interceptor, remove the progress cursor style from the body element.
//  */
// /**
//  * 8. To practice posting data, we'll create a system to "favourite" certain images.
//  * - The skeleton of this function has already been created for you.
//  * - This function is used within Carousel.js to add the event listener as items are created.
//  *  - This is why we use the export keyword for this function.
//  * - Post to the cat API's favourites endpoint with the given ID.
//  * - The API documentation gives examples of this functionality using fetch(); use Axios!
//  * - Add additional logic to this function such that if the image is already favourited,
//  *   you delete that favourite using the API, giving this function "toggle" functionality.
//  * - You can call this function by clicking on the heart at the top right of any image.
//  */
// export async function favourite(imgId) {
//   // your code here
// }

// /**
//  * 9. Test your favourite() function by creating a getFavourites() function.
//  * - Use Axios to get all of your favourites from the cat API.
//  * - Clear the carousel and display your favourites when the button is clicked.
//  *  - You will have to bind this event listener to getFavouritesBtn yourself.
//  *  - Hint: you already have all of the logic built for building a carousel.
//  *    If that isn't in its own function, maybe it should be so you don't have to
//  *    repeat yourself in this section.
//  */
// async function getFavourites() {
//   const res = await axios.get("/favourites", {
//     onDownloadProgress: updateProgress,
//   });

//   const favs = res.data;

//   if (!Array.isArray(favs) || favs.length === 0) {
//     if (Carousel.clear) Carousel.clear();
//     infoDump.innerHTML = "<p>No favourites yet. Click the heart on an image to add one.</p>";
//     return;
//   }

//   // Convert favourites into "image-like" objects for carousel builder
//   const images = favs
//     .filter((f) => f.image && f.image.url)
//     .map((f) => ({
//       id: f.image_id,
//       url: f.image.url,
//       breeds: [], // favourites endpoint doesn’t always include breed data
//     }));

//   buildCarouselFromImages(images);

//   infoDump.innerHTML = `<h2>Your Favourites</h2><p>Total: ${images.length}</p>`;
// }

// getFavouritesBtn.addEventListener("click", getFavourites);

// /**
//  * 10. Test your site, thoroughly!
//  * - What happens when you try to load the Malayan breed?
//  *  - If this is working, good job! If not, look for the reason why and fix it!
//  * - Test other breeds as well. Not every breed has the same data available, so
//  *   your code should account for this.
//  */
