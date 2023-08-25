
const moviesURL = "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1"
const API_KEY = "eb672dad6f5efad36a0f4d091083358e"
const IMAGE_LINK = "https://image.tmdb.org/t/p/original/"
const SEARCH_LINK = "https://api.themoviedb.org/3/search/movie"
const mainElement = document.querySelector("main")
const TOP_RATED_LINK = "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1"
const POPULAR_LINK = "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1"
let movies;
const getFullMovie = async (link) => {
    const movies = await fetch(link, {
        method: "GET", headers: {
            "accept": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYjY3MmRhZDZmNWVmYWQzNmEwZjRkMDkxMDgzMzU4ZSIsInN1YiI6IjY0ZGNlNjhiZDEwMGI2MTRiM2ZmY2RiNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Z0lBHPr4s079IAR8S3ODLBMxKLtIY0QcPi8qNN7Yaow"
        }
    }).then(res => {
        return res.json()
    }
    ).then(res => {
        return res.results
    }).catch(err => console.error(err))
    return movies

}
const displayPopularMovies = async () => {
const movies = await getFullMovie(POPULAR_LINK)
// console.log(movie)
await displayMovieList(movies)
addWatchButtons()
}
displayPopularMovies()
//Display movie list
const displayMovieList = (movies) => {
    mainElement.innerHTML = ""
    movieList = document.createElement("div")
    movieList.className = "films-list"
    movieList.innerHTML = ""

    movies.filter(movie => movie.poster_path !== null).forEach(movie => {
        const movieItem = document.createElement("div")
        const { title, overview, poster_path, backdrop_path, id } = movie
        movieItem.className = "film-item"
        // movieItem.style = "width: 18rem;"
        movieItem.innerHTML = `
        <img class="film-poster" id="${id}-open" src=${poster_path?IMAGE_LINK.concat(poster_path): "#"} alt=${title} >
        <dialog class="film-info" id=${id}>
            <img class="modal-film-backdrop" src=${IMAGE_LINK.concat(backdrop_path)} alt=${title}>
            <h3 class="modal-film-title">${title}</h3>
            <button class="watch-btn">Watch</button>
            <p>${overview}</p>
        </dialog>
        `
        
        // const openImg = document.querySelector("") 
        movieList.appendChild(movieItem)
    mainElement.appendChild(movieList)
        const imgId = id + "-open"
        const openImg = document.getElementById(imgId) 
        const dialog = document.getElementById(id)
        openImg.addEventListener("click", () => {dialog.showModal()})
            /*<h5 class="film-title">${title}</h5>
            <button class="watch-btn"><a href="#" id=${id}>Watch</a></button>*/
})


    
} 


//Search movie
const formElement = document.querySelector("form")
formElement.addEventListener("submit", e => {
    e.preventDefault()
    const searchTerm = document.querySelector(".navbar-input").value
    searchMovies(searchTerm)
})
const searchMovies = (searchTerm) => {
    if(searchTerm === "" || searchTerm === null){
        getFullMovie()
    }
    else{
    movies = fetch(SEARCH_LINK + `?query=${searchTerm}`,{ method: "GET", headers: {
        "accept": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYjY3MmRhZDZmNWVmYWQzNmEwZjRkMDkxMDgzMzU4ZSIsInN1YiI6IjY0ZGNlNjhiZDEwMGI2MTRiM2ZmY2RiNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Z0lBHPr4s079IAR8S3ODLBMxKLtIY0QcPi8qNN7Yaow"
    }} ).then(res => {
        return res.json()
    }).then(res => {
        return res.results
    }).then(res => {
        displayMovieList(res)}).then(res => {addWatchButtons()})
    .catch(err => console.error(err))
}
}

//Top rated movies
const displayCarouselMovies = async () => {
    const movies = await getFullMovie(TOP_RATED_LINK)
    const carouselTrack = document.querySelector(".carousel-track")
    movies.filter(movie => movie.backdrop_path !== null).filter(movie => movies.indexOf(movie) < 4).forEach(movie => {
        const carouselSlide = document.createElement("li")
        carouselSlide.className = "carousel-slide"
        if(movies.indexOf(movie) == 0){
            carouselSlide.className ="carousel-slide current-slide"
        }
        const { title, backdrop_path, id } = movie
        carouselSlide.innerHTML = `
        <img class="carousel-img" src=${IMAGE_LINK.concat(backdrop_path)} alt=${title} >
        `
        carouselTrack.appendChild(carouselSlide)
    }
    )
    return ""
}
const moveSlide = (track, currentSlide, targetSlide) => {
        track.style.transform = "translateX(-" + targetSlide.style.left + ")"
        currentSlide.classList.remove("current-slide")
        targetSlide.classList.add("current-slide")
}
const carouselWork = () => {
    const track = document.querySelector(".carousel-track")
    const slides = Array.from(track.children)
    const nextBtn = document.querySelector(".carousel-btn--right")
    const prevBtn = document.querySelector(".carousel-btn--left")
    const slideWidth = slides[0].getBoundingClientRect().width
    let flow = 1
    slides.forEach((slide, index) => {
    slide.style.left = slideWidth * index + 'px'
    })

    const carouselShow = () => {
        const currentSlide = track.querySelector(".current-slide")
        if(currentSlide.nextElementSibling == null) flow *= -1 
        let nextSlide = flow === 1 ? currentSlide.nextElementSibling : currentSlide.previousElementSibling
        moveSlide(track ,currentSlide, nextSlide)
        setTimeout(
            carouselShow
        , 4000)

    }
    nextBtn.addEventListener("click", e => {
        const currentSlide = track.querySelector(".current-slide")
        const nextSlide = currentSlide.nextElementSibling
        console.log(nextSlide)
        moveSlide(track, currentSlide, nextSlide)
    })
    prevBtn.addEventListener("click", e => {
        const currentSlide = track.querySelector(".current-slide")
        const prevSlide = currentSlide.previousElementSibling
        console.log(prevSlide)
        moveSlide(track, currentSlide, prevSlide)
    })
    setTimeout(carouselShow, 4000)
}

displayCarouselMovies().then(carouselWork)
// const promiseCarousel = new Promise((res, rej) => {
//     displayCarouselMovies()
//     res("") 
// }).then()



// Watch movie
const addWatchButtons = () => {
    const watchButtons = document.querySelectorAll(".btn-watch")
    const location = window.location.pathname
    console.log(location)
    watchButtons.forEach(btn => {
        btn.addEventListener("click", async () => {
            // mainElement.innerHTML = 
        })
    }
    )
}





