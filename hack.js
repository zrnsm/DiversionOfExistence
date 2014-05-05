var main = {};
main.state = [];
main.tick = 0;
main.off_color = 224;
main.on_color = 0;
main.cell_width = 10;
main.canvas_width = 1000;
main.paused = false;
main.background_normal = 224;
main.background_paused = 100;
main.toggle_cell = function(x, y) {
    var color = main.state[x][y] ? main.off_color : main.on_color;
    main.processing.fill(main.processing.color(color));
    main.processing.rect(x * main.cell_width, y * main.cell_width, main.cell_width, main.cell_width);
    main.state[x][y] = !main.state[x][y];
};

main.paint_cell = function(x, y, state) {
    if(state) {
//        var color = state ? main.on_color : main.off_color;
        var color = main.on_color;
        main.processing.fill(main.processing.color(color));
        main.processing.rect(x * main.cell_width, y * main.cell_width, main.cell_width, main.cell_width);
        main.state[x][y] = state;
    }
};

main.paint = function() {
    for(x = 0; x < main.grid_width; x++) {
        for(y = 0; y < main.grid_width; y++) {
            main.paint_cell(x, y, main.state[x][y]);
        }
    }    
};

main.sketch = function(processing) {
  main.processing = processing;
  main.grid_width = main.canvas_width / main.cell_width;

  var next = function() {
      var state = [],
        i = 0,
        x = 0,
        y = 0;

      for(i = 0; i < main.grid_width; i++) {
          state.push([]);
      }
      for(x = 0; x < main.grid_width; x++) {
        for(y = 0; y < main.grid_width; y++) {
          state[x][y] = main.lives(x, y);
        }
      }
    return state;
  }

  var seed = function(n) {
    var i = 0,
      x,
      y;
    for(i = 0; i < n; i++) {
      main.toggle_cell(Math.floor(Math.random() * main.grid_width), Math.floor(Math.random() * main.grid_width));
    }
  };

  processing.setup = function() {
    processing.background(main.background_normal);
    var i = 0,
        j = 0;
    processing.noStroke();
    processing.size(main.canvas_width, main.canvas_width);
    for(i = 0; i < main.grid_width; i++) {
      main.state.push([]);
    }
    for(i = 0; i < main.grid_width; i++) {
      for(j = 0; j < main.grid_width; j++) {
        main.state[i][j] = false;
      }
    }
    processing.frameRate(10);    
//    seed(100000);
  }

  processing.draw = function() {
    main.state = next();
    main.paint();
  };
}

main.lives = function(x, y) {
  var l;
  function live_neighbors(x, y) {
    var i = -1,
        j = -1,
        live = 0;
    for(i = -1; i <= 1; i++) {
      for(j = -1; j <= 1; j++) {
        if((i == 0 && j == 0)
           || ((x + i) < 0)
           || ((x + i) >= 100) 
           || ((y + j) < 0) 
           || ((y + j) >= 100)) continue;
        live += main.state[x + i][ y + j] ? 1 : 0;
      }
    }
    return live;
  }
  
  l = live_neighbors(x, y);
  if(main.state[x][y]) {
      if(l < 2) {
          return false;
      }
      if(l == 2 || l == 3) {
          return true;
      }
      if(l > 3) {
          return false;
      }
  }
  if(l === 3) {
    return true;
  }
  return false;
};

var canvas = document.getElementById("canvas1");
canvas.onclick = function(event) {
  console.log('x: ' + event.screenX);
  console.log('y: ' + event.screenY);
  console.log(event);
  main.toggle_cell(Math.floor(event.layerX / main.cell_width), Math.floor(event.layerY / main.cell_width));
  
};

window.onkeydown = function(event) {
  if(main.paused) {
    main.processing.loop();
    main.processing.background(main.background_normal);
  }
  else {
    main.processing.noLoop();
    main.processing.background(main.background_paused);
  }
  main.paused = !main.paused;
//  main.paint();
};

var processingInstance = new Processing(canvas, main.sketch);
