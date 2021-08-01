function slider(selector) {
  const slider = document.querySelector(selector);
  const leftArrow = slider.querySelector("#leftArrow");
  const rightArrow = slider.querySelector("#rightArrow");
  const slideLine = slider.querySelector("#slideLine");
  const progressBar = slider.querySelector("#progressBar");
  const progress = slider.querySelector("#progressBar").children[0];


  let scrollDelay;
  let offsetTile;
  let tileCount;
  let tileWidth;

  let slideChildren;
  let visibleTileCount;
  let spaceBetweenPerTile;
  let timerId;

  function __init__() {
    scrollDelay = 4000;
    offsetTile = 0;
    tileCount = slideLine.childElementCount;
    tileWidth =  slideLine.children[0].offsetWidth;
  
    slideChildren = Array.from(document.querySelector("#slideLine").children);
    [visibleTileCount, spaceBetweenPerTile] = calculateSpace();
    timerId = setInterval(() => {slideScroll(visibleTileCount)}, scrollDelay);
    calculateProgressBarValue();
    slideChildren.forEach(tile => setTileMargins(tile, ...calculateMargins()));
  }

  __init__();

  function calculateSpace() {
    let visibleTileCount = Math.floor((slider.offsetWidth / tileWidth) - 0.2);
    let spaceBetween = (slider.offsetWidth - (visibleTileCount * tileWidth));
    let spaceBetweenPerTile = spaceBetween / (visibleTileCount - 1);
    
    if(visibleTileCount - 1 == 0)
      spaceBetweenPerTile = spaceBetween;

    return [visibleTileCount, spaceBetweenPerTile]
  }

  function calculateMargins() {
    let leftMargin = 0;
    let rightMargin = spaceBetweenPerTile;
    if(visibleTileCount == 1) {
       leftMargin = rightMargin = spaceBetweenPerTile/2;
    }

    return [leftMargin, rightMargin]
  }

  function calculateNewOffset(value) {
    if(offsetTile + visibleTileCount == tileCount && value > 0)
      offsetTile = 0;
    else if(offsetTile == 0 && value < 0)
      offsetTile = tileCount - visibleTileCount;
    else if(offsetTile + value < 0)
      offsetTile = 0;
    else if(offsetTile + value > tileCount - visibleTileCount)
      offsetTile = tileCount - visibleTileCount
    else
      offsetTile += value;
  }

  function calculateProgressBarValue() {
    progress.style.width = `${progressBar.offsetWidth / Math.ceil(tileCount/visibleTileCount)}px`
    progress.style.marginLeft = `${progressBar.offsetWidth/Math.ceil(tileCount/visibleTileCount) * Math.ceil(offsetTile/visibleTileCount)}px` 
  }

  function setTileMargins(tile, left, right) {
    tile.style.marginLeft = `${left}px`
    tile.style.marginRight = `${right}px`
  }

  function slideScroll(d) {
    calculateNewOffset(d);
    calculateProgressBarValue();

    let newPosition = offsetTile * (tileWidth + spaceBetweenPerTile);
    scrollTo(newPosition);
  }

  function scrollTo(newPosition) {
    slideLine.style.marginLeft = `${-newPosition}px`
  }

  leftArrow.addEventListener("click", () => slideScroll(-visibleTileCount));
  rightArrow.addEventListener("click", () => slideScroll(visibleTileCount));

  slideLine.onmousedown = function(e) {
    let mouseDownPositionX = e.x;
    clearInterval(timerId);
    
    slideLine.onmousemove = function(e) {
      let margin = +slideLine.style.marginLeft.replace("px", "")
      slideLine.style.marginLeft =  `${margin + e.movementX}px`
    }

    slideLine.ondragstart = function() {
      return false;
    };

    document.onmouseup = function(e) {
      let mouseUpPositionX = e.x;
      let newOffset = Math.ceil((mouseDownPositionX - mouseUpPositionX)/(tileWidth+spaceBetweenPerTile));

      slideScroll(newOffset);

      timerId = setInterval(() => {slideScroll(visibleTileCount)}, scrollDelay);

      slideLine.onmousemove = null;
      slideLine.onmouseup = null;
    }
  }

  window.addEventListener('resize', () => {
    [visibleTileCount, spaceBetweenPerTile] = calculateSpace();
    let [leftMargin, rightMargin] = calculateMargins();
    progress.style.width = `${progressBar.offsetWidth / Math.ceil(tileCount/visibleTileCount)}px`
    
    
    slideChildren.forEach(tile => setTileMargins(tile, leftMargin, rightMargin))
    
    slideScroll(0);
  })
}


slider('#slider-1')