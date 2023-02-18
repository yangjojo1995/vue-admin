import 'viewerjs/dist/viewer.css'
import Viewer from 'viewerjs'

const viewerId = 'viewer-a2f0babeca934657942f1f5acfee79fa'
let viewerEl = null
let viewer = null

function getViewer () {
  viewerEl = document.createElement('div')
  viewerEl.setAttribute('id', viewerId)
  viewerEl.setAttribute('style', 'position: fixed;left: -100000px;top: -100000px;width: 0;overflow: hidden;height: 0;')
  document.querySelector('body').appendChild(viewerEl)

  return new Viewer(document.querySelector(`#${viewerId}`), {
    // https://github.com/fengyuanchen/viewerjs/blob/main/README.md

    backdrop: true, // Enable the modal backdrop, specify static for the backdrop that will not close the modal on click.
    button: true, // Show the button on the top-right of the viewer.
    navbar: true, // Specify the visibility of the navbar.
    title: true, // Specify the visibility and the content of the title.
    toolbar: true, // Specify the visibility and the content of the title.
    className: '', // Specify the visibility and layout of the toolbar its buttons.
    container: 'body', // Container to place the viewer in the modal mode.
    filter: null, // Filter the images for viewing (should return true if the image is viewable, return false to ignore the image).
    fullscreen: true, // Enable to request full screen when play.
    inheritedAttributes: ['crossOrigin', 'decoding', 'isMap', 'loading', 'referrerPolicy', 'sizes', 'srcset', 'useMap'], // Define the extra attributes to inherit from the original image.
    initialViewIndex: 0, // Define the initial index of the image for viewing.
    inline: false, // Enable inline mode.
    interval: 5000, // The amount of time to delay between automatically cycling an image when playing.
    keyboard: true, // Enable keyboard support.
    focus: true, // Focus the active item in the navbar when initialized.
    loading: true, // Indicate if showing a loading spinner when loading the image or not.
    loop: true, // Indicate if enabling loop viewing or not.
    minWidth: 200, // Define the minimum width of the viewer.
    minHeight: 100, // Define the minimum height of the viewer.
    movable: true, // Enable to move the image.
    rotatable: true, // Enable to rotate the image.
    scalable: true, // Enable to scale the image.
    zoomable: true, // Enable to zoom the image.
    zoomOnTouch: true, // Enable to zoom the current image by dragging on the touch screen.
    zoomOnWheel: true, // Enable to zoom the image by wheeling the mouse.
    slideOnTouch: true, // Enable to slide to the next or previous image by swiping on the touch screen.
    toggleOnDblclick: true, // Indicate if toggle the image size between its natural size and initial size when double click on the image or not. In other words, call the toggle method automatically when double click on the image.
    tooltip: true, // Show the tooltip with image ratio (percentage) when zooming in or zooming out.
    transition: true, // Enable CSS3 Transition for some special elements.
    zIndex: 2015, // Define the CSS z-index value of the viewer in modal mode.
    zIndexInline: 0, // Define the CSS z-index value of the viewer in inline mode.
    zoomRatio: 0.1, // Define the ratio when zooming the image by wheeling the mouse.
    minZoomRatio: 0.01, // Define the min ratio of the image when zooming out.
    maxZoomRatio: 100, // Define the max ratio of the image when zooming in.
    url: 'src', // Define where to get the original image URL for viewing.
    ready: null, // Shortcut of the ready event.
    show: null, // Shortcut of the show event.
    hide: null, // Shortcut of the hide event.
    hidden: null, // Shortcut of the hidden event.
    view: null, // Shortcut of the view event.
    viewed: null, // Shortcut of the viewed event.
    move: null, // Shortcut of the move event.
    moved: null, // Shortcut of the moved event.
    rotate: null, // Shortcut of the rotate event.
    rotated: null, // Shortcut of the rotated event.
    scale: null, // Shortcut of the scale event.
    scaled: null, // Shortcut of the scaled event.
    zoom: null, // Shortcut of the zoom event.
    zoomed: null, // Shortcut of the zoomed event.
    play: null, // Shortcut of the play event.
    stop: null // Shortcut of the stop event.

  })
}

export default function (src, srcList = []) {
  const images = [...srcList]
  let index = images.indexOf(src)
  if (index < 0) {
    index = 0
    images.unshift(src)
  }

  if (!viewer) viewer = getViewer()

  if (viewerEl) {
    viewerEl.innerHTML = ''
    for (const image of images) {
      const imageEl = document.createElement('img')
      imageEl.setAttribute('src', image)
      viewerEl.appendChild(imageEl)
    }
  }

  viewer.update()
  viewer.view(index)

  return viewer
}
