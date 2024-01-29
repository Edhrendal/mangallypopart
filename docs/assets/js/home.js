'use strict'

// Carousel
const carouselContent = document.querySelector(".carousel .content")
const carouselControlStop = document.querySelector(".carousel .controls .stop")
const carouselControlPlay = document.querySelector(".carousel .controls .play")
let hasBeenPaused = false
const carouselTrackIndicators = document.querySelectorAll(".carousel .track .indicator")
let autoCarouselTimeout
// * Get data
const imageReferences = []
carouselContent.querySelectorAll(".photo").forEach(imageInitializer => {
    imageReferences.push(imageInitializer.dataset.location)
    imageInitializer.remove()
})
// * Shuffle
for (let i = imageReferences.length -1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [imageReferences[i], imageReferences[j]] = [imageReferences[j], imageReferences[i]]
}
// * Init
setCarouselPhoto()
setAutoCarouselTimeout()
// * Content height as full screen
carouselContent.style.height = document.querySelector("body").offsetHeight
    - document.querySelector(".site-header").offsetHeight
    + "px"
// * Events
document.querySelector(".carousel .controls .previous").addEventListener("click", _ => (
    changeCarouselPhoto(false)
))
document.querySelector(".carousel .controls .next").addEventListener("click", _ => (
    changeCarouselPhoto(true)
))
carouselControlStop.addEventListener("click", _ => {
    window.clearTimeout(autoCarouselTimeout)
    carouselControlStop.style.display = "none"
    carouselControlPlay.style.display = null // Remove element style to use stylesheet one
    hasBeenPaused = true
})
carouselControlPlay.addEventListener("click", _ => {
    hasBeenPaused = false
    setAutoCarouselTimeout()
})
carouselTrackIndicators.forEach(indicatorElement => {
    indicatorElement.addEventListener("click", _ => {
        const thisIndex = Number(indicatorElement.dataset.index)
        if (Number(carouselContent.querySelector(".photo").dataset.index) === thisIndex) {
            // Same index; no update
            return
        }

        doCarouselPhotoUpdate(thisIndex)
    })
})

// * Functions
function setAutoCarouselTimeout() {
    if (hasBeenPaused) {
        return
    }

    autoCarouselTimeout = window.setTimeout(_ => changeCarouselPhoto(true), 5000)
    carouselControlPlay.style.display = "none"
    carouselControlStop.style.display = null // Remove element style to use stylesheet one
}

function setCarouselPhoto(index = 0) {
    index = index in imageReferences ? index : 0
    const photo = imageReferences.at(index)
    const photoTemplate = document.createElement("template")
    photoTemplate.innerHTML =
        `<div class="photo" style="background-image: url(${photo})" data-index="${index}"></div>`

    carouselContent.append(photoTemplate.content)
    carouselTrackIndicators.item(index).classList.add("active")

    // Reset auto carousel in order to prevent some update conflicts
    if (autoCarouselTimeout) {
        window.clearTimeout(autoCarouselTimeout)
        setAutoCarouselTimeout()
    }
}

function changeCarouselPhoto(next = true) {
    const currentIndex = Number(carouselContent.querySelector(".photo").dataset.index)
    let newIndex
    if (next) {
        newIndex = (currentIndex + 1) in imageReferences ? currentIndex + 1 : 0
    } else {
        newIndex = (currentIndex - 1) in imageReferences ? currentIndex - 1 : imageReferences.length - 1
    }

    doCarouselPhotoUpdate(newIndex)
}

function doCarouselPhotoUpdate(newIndex) {
    carouselContent.querySelector(".photo").remove()
    document.querySelector(".carousel .track .active").classList.remove("active")
    setCarouselPhoto(newIndex)
}
