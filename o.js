const cv = require('opencv4nodejs');

(async () => {
  const image = await cv.imreadAsync('image.jpg');
  const template = await cv.imreadAsync('template.jpg');

  const matched = image.matchTemplate(template, 5); // Use appropriate match method

  const minMax = matched.minMaxLoc();
  const topLeft = minMax.maxLoc;

  const color = new cv.Vec(0, 255, 0); // Green color
  image.drawRectangle(topLeft, new cv.Point(topLeft.x + template.cols, topLeft.y + template.rows), color, 2);

  cv.imshow('Matched Image', image);
  cv.waitKey();
})();
