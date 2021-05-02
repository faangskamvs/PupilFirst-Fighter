var c = document.getElementById("myCanvas");
var can_ctx = c.getContext("2d");

let loadFighter = (src, callback) => {
  let img = document.createElement("img");
  img.onload = () => callback(img);
  img.src = src;
};
let imagePath = (fr_No, animation) => {
  return "images/" + animation + "/" + fr_No + ".png";
};
let frames = {
  idle: [1, 2, 3, 4, 5, 6, 7, 8],
  kick: [1, 2, 3, 4, 5, 6, 7],
  punch: [1, 2, 3, 4, 5, 6, 7]//,
  //left: [1, 2, 3, 4, 5, 6],
  //right: [1, 2, 3, 4, 5, 6]
};

let loadFighters = (callback) => {
  let images = { idle: [], kick: [], punch: [] };
  let imagesToLoad = 0;

  ["idle", "kick", "punch"].forEach((animation) => {
    let animationFrames = frames[animation];
    imagesToLoad = imagesToLoad + animationFrames.length;
    animationFrames.forEach((fr_No) => {
      let path = imagePath(fr_No, animation);

      loadFighter(path, (image) => {
        images[animation][fr_No - 1] = image;
        imagesToLoad = imagesToLoad - 1;
        if (imagesToLoad === 0) {
          callback(images);
        }
      });
    });
  });
};
let animate = (ctx, images, animation, callback) => {
  images[animation].forEach((image, index) => {
    setTimeout(() => {
      ctx.clearRect(0, 0, 500, 500);
      ctx.drawImage(image, 0, 0, 500, 500);
    }, index * 100);
  });
  setTimeout(callback, images[animation].length * 100);
};

loadFighters((images) => {
  let queued = [];

  let aux = () => {
    let selected;

    if (queued.length === 0) {
      selected = "idle";
    } else {
      selected = queued.shift();
    }
    animate(can_ctx, images, selected, aux);
  };

  aux();
  document.getElementById("kick").onclick = () => {
    queued.push("kick");
  };

  document.getElementById("punch").onclick = () => {
    queued.push("punch");
  };

  document.addEventListener("keyup", (event) => {
    const key = event.key;

    if (key === "ArrowDown") {
      queued.push("kick");
    } else if (key === "ArrowUp") {
      queued.push("punch");
    }
  });
});