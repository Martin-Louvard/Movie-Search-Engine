let selector = document.getElementById("movies");

const inputElement = document.querySelector('input[type="text"]');

document.querySelector(".searchMovie").addEventListener("submit", (event) => {
  event.preventDefault();
  const keywordInputValue = inputElement.value;
  fetchMovies(keywordInputValue);
});

const fetchMovies = async (keywordInputValue) => {
  fetch(
    "http://www.omdbapi.com/?s=" + keywordInputValue + "&apikey=f94e8624&r=json"
  )
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      return response;
    })
    .then((response) => {
      selector.innerHTML = "";
      response.Search.forEach((film) => {
        showSelectedMovies(
          selector,
          film.Title,
          film.Year,
          film.Poster,
          film.imdbID
        );
      });
    })
    .catch((error) => console.error(error));
};

const showSelectedMovies = (selector, title, year, poster, imdbID) => {
  selector.innerHTML += `
      <div class="film not-visible">
        <div class="card m-4 p-4" style="width: 25rem;">
        <h5 class="card-title"> ${title}</h5>
        <img class="card-img-top" src="${poster}" alt="Card image cap" id="image${imdbID}">
          <div class="card-body">
            <p class="card-text">Année de sortie du film: ${year}</p>
            <button type="button" class="btn btn-primary modal-buttons" id="${imdbID}" data-toggle="modal" data-target="#exampleModal">
              Read More
            </button>
          </div>
        </div>
      </div>
      
  `;
  let items = document.querySelectorAll(".film");
  items.forEach(function (item) {
    observer.observe(item);
  });

  let modalButtons = document.querySelectorAll(".modal-buttons");
  modalButtons.forEach(function (modalButton) {
    modalButton.addEventListener("click", () => {
      async function getPlot() {
        fetch(`http://www.omdbapi.com/?i=${modalButton.id}&apikey=4f5b8e69`)
          .then((response) => response.json())
          .then((response) => {
            console.log(response.Plot);
            return response.Plot;
          })
          .then((response) => changeModal(response));
      }
      const changeModal = async (Plot) => {
        modalBody.innerHTML = "";
        console.log(Plot);
        modalTitle.innerText =
          modalButton.parentNode.parentNode.childNodes[1].innerText;
        console.log(modalButton.previousElementSibling);
        modalBody.appendChild(
          modalButton.parentNode.previousElementSibling.cloneNode()
        );
        modalBody.append(modalButton.previousElementSibling.innerText);
        modalBody.appendChild(document.createElement("br"));
        modalBody.append(Plot);
      };
      getPlot();
    });
  });
};

let observer = new IntersectionObserver(
  function (observables) {
    observables.forEach(function (observable) {
      if (observable.intersectionRatio > 0.5) {
        observable.target.classList.remove("not-visible");
        console.log(observable);
      }
    });
  },
  {
    threshold: [0.5],
  }
);

let modalTitle = document.getElementById("exampleModalLabel");
let modalBody = document.getElementById("modal-body");
