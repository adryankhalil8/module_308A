# 308A.4 — AJAX and Data Fetching

> **React Developer Curriculum** · Lesson 4 of 5

---

## Learning Objectives

By the end of this lesson, learners will be able to:

- Describe the purpose of AJAX and the `XMLHttpRequest` object.
- Use AJAX to make requests from a server without reloading the webpage.
- Use AJAX to receive and work with data from a server.
- Use the **Fetch API** to asynchronously communicate with a server.
- Use the **Axios** library to asynchronously communicate with a server.

---

## Asynchronous JavaScript and XML (AJAX)

**AJAX** is a term used to describe the use of the `XMLHttpRequest` (XHR) object to communicate with servers. Despite the naming conventions, AJAX and the XHR object can both be used to retrieve **any type of data**, not just XML.

> **"Asynchronous"** in web development = the ability to communicate with a server, exchange data, and update the local webpage **without having to fully refresh it.**

---

## The XMLHttpRequest Object

### Creating a Request

```javascript
const request = new XMLHttpRequest();
```

### Key Methods

| Method | Purpose |
|--------|---------|
| `open(method, url, async)` | Configure the request |
| `send(data)` | Send the request |
| `setRequestHeader(header, value)` | Set request headers |

```javascript
request.open("GET", "http://www.example.com/myFile.json", true);
request.send();
```

### Handling Responses

The `onreadystatechange` event fires each time `readyState` changes:

| Value | Constant | Description |
|-------|----------|-------------|
| `0` | `XMLHttpRequest.UNSENT` | Client created, `open()` not called |
| `1` | `XMLHttpRequest.OPENED` | `open()` has been called |
| `2` | `XMLHttpRequest.HEADERS_RECEIVED` | `send()` has been called |
| `3` | `XMLHttpRequest.LOADING` | Downloading; partial data available |
| `4` | `XMLHttpRequest.DONE` | Operation is complete |

```javascript
function handleResponse() {
    if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
            console.log(request.responseText);
        } else {
            console.log("Error: " + request.status);
        }
    }
}

request.onreadystatechange = handleResponse;
```

---

## Simple AJAX Example

Create two files in the same directory:

**`test.html`**
```html
This is a test!
```

**`index.html`**
```html
<button id="myBtn" type="button">Test it Out</button>

<script>
let request;

document.getElementById("myBtn").addEventListener("click", testRequest);

function testRequest() {
    request = new XMLHttpRequest();

    if (!request) {
        alert("Failed to create an XMLHttpRequest Object.");
        return false;
    }

    request.onreadystatechange = alertResponse;
    request.open("GET", "test.html");
    request.send();
}

function alertResponse() {
    if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
            alert(request.responseText);
        } else {
            alert("Error: " + request.status);
        }
    }
}
</script>
```

---

## Working with XML

Convert test.html to a proper XML file:

**`test.xml`**
```xml
<?xml version="1.0"?>
<root>XML data test!</root>
```

Handle the XML response:

```javascript
function alertResponse() {
    if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
            const xmlDoc = request.responseXML;
            const doc_root = xmlDoc.querySelector("root");
            let data = doc_root.firstChild.data;
            alert(data);
        } else {
            alert("Error: " + request.status);
        }
    }
}
```

---

## Posting Data with XMLHttpRequest

```javascript
request.open("POST", "https://jsonplaceholder.typicode.com/todos");

request.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
);

let inputVal = document.getElementById("myInput").value;
let encodedVal = encodeURIComponent(inputVal);
request.send(`data=${encodedVal}`);
```

> 📌 A `POST` request may return a status of **201 Created** instead of 200 OK — both are successful responses!

---

## The Fetch API

The **Fetch API** is a more powerful and flexible replacement for `XMLHttpRequest`.

### Basic Usage

```javascript
async function logJSONData() {
    const response = await fetch("http://www.example.com/something.json");
    const jsonData = await response.json();
    console.log(jsonData);
}
```

> `fetch()` does **not** directly return JSON — it returns a **Promise** that resolves with a `Response` object. Use `.json()` to extract JSON data.

### Response Methods

| Method | Returns |
|--------|---------|
| `response.json()` | Parsed JSON data |
| `response.text()` | Text string |
| `response.blob()` | Blob (binary data) |
| `response.formData()` | FormData object |
| `response.arrayBuffer()` | ArrayBuffer |
| `response.clone()` | Clone of the Response |

### Fetch Options

The second parameter is an options object:

```javascript
const response = await fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(requestBody),
});
```

### Example: Random Dog Image

```html
<img id="dog" src="" height="250" style="cursor: pointer" />

<script>
    const dog = document.getElementById('dog');
    dog.addEventListener("click", getNewDog);

    async function getNewDog() {
        dog.style.cursor = 'wait';
        const response = await fetch("https://dog.ceo/api/breeds/image/random");
        const jsonData = await response.json();
        dog.src = jsonData.message;
        dog.style.cursor = 'pointer';
    }

    getNewDog();
</script>
```

### Posting Data with Fetch

```javascript
async function testRequest() {
    let inputVal = document.getElementById("myInput").value;
    let requestBody = { data: inputVal };

    const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        }
    });

    if (response.ok) {
        const jsonData = await response.json();
        console.log(jsonData);
    } else {
        console.log("Error: " + response.status);
    }
}
```

> 📌 Check compatibility at [Can I Use](https://caniuse.com/?search=fetch) before relying on fetch in production.

---

## Axios

**Axios** is a popular HTTP client library that uses `XMLHttpRequest` under the hood, but provides a much cleaner API.

### Installation

```html
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```

### Key Advantages Over Fetch

| Feature | Fetch | Axios |
|---------|-------|-------|
| JSON parsing | Manual (`.json()`) | Automatic |
| Data serialization | Manual (`JSON.stringify`) | Automatic |
| Error handling | Must check `response.ok` | Rejects on non-2xx status |
| Request timeout | Complex to implement | Built-in `timeout` option |
| Interceptors | Not available | Built-in |
| Browser support | Modern browsers only | Wider support |

### Basic Syntax

```javascript
// GET request
const response = await axios.get(url);
console.log(response.data);

// POST request
const response = await axios.post(url, requestBody, {
    headers: { 'Content-Type': 'application/json; charset=UTF-8' }
});
```

### Axios Request Aliases

```javascript
axios.request(config)
axios.get(url[, config])
axios.delete(url[, config])
axios.head(url[, config])
axios.options(url[, config])
axios.post(url[, data[, config]])
axios.put(url[, data[, config]])
axios.patch(url[, data[, config]])
```

### Response Object Structure

```javascript
{
  data: {},          // Response body (already parsed)
  status: 200,       // HTTP status code
  statusText: 'OK',  // HTTP status message
  headers: {},        // Response headers
  config: {},         // Request configuration
  request: {}         // The XHR object
}
```

### Response Timeout

```javascript
axios.get(url, {
  timeout: 5000,  // 5 seconds
});
```

### Interceptors

Interceptors fire between actions — modify requests before sending or responses before handling:

**Request Interceptor:**
```javascript
axios.interceptors.request.use(request => {
    console.log('Request sent.');
    return request;
});
```

**Response Interceptor:**
```javascript
axios.interceptors.response.use(
    (response) => {
        console.log('Successful response!');
        return response;
    },
    (error) => {
        console.log('Unsuccessful response...');
        throw error;
    }
);
```

**Timing Requests:**
```javascript
axios.interceptors.request.use(request => {
    request.metadata = request.metadata || {};
    request.metadata.startTime = new Date().getTime();
    return request;
});

axios.interceptors.response.use(
    (response) => {
        response.config.metadata.endTime = new Date().getTime();
        response.durationInMS = response.config.metadata.endTime - response.config.metadata.startTime;
        console.log(`Request took ${response.durationInMS} milliseconds.`);
        return response;
    },
    (error) => {
        error.config.metadata.endTime = new Date().getTime();
        error.durationInMS = error.config.metadata.endTime - error.config.metadata.startTime;
        throw error;
    }
);
```

**Removing Interceptors:**
```javascript
const myInterceptor = axios.interceptors.request.use(/* ... */);
axios.interceptors.request.eject(myInterceptor);
```

---

## Lab Activity

Complete the following:

**R-ALAB 308A.4.1 — Working with External Data**

This assignment challenges you to create an interactive application using data from an external API (The Cat API) using both `fetch` and Axios.

---

*Copyright © Per Scholas 2026*

