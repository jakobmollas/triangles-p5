'use strict'

class Settings {
  constructor() {
    this.animate = true;
    this.showDiagnostics = false;
    this.quadTreeSize = 8;
    this.count = 1000;
  }
}

let particles = [];
let quadTree = null;
let frame = 0;
let gui = null;
let settings = new Settings();
let colors = [];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.style('display', 'block');

  textFont('monospace');

  initializeColors();
  initializeParticles();
  initializeGuiControls();
}

function initializeColors() {
  colors = [];

  // Pre-calculate colors using arrays (HSB), 
  // stroke() with dynamic colors are slooow, arrays seems to be much faster
  for (let i = 15; i <= 45; i += 3)
    colors.push([i, 100, 100, 50]);
}

function initializeGuiControls() {
  gui = new dat.GUI()
  gui.add(settings, 'animate');
  gui.add(settings, 'showDiagnostics');
  gui.add(settings, 'quadTreeSize', 1, 64);
  gui.add(settings, 'count', 1, 1000).onFinishChange(n => initializeParticles());
  gui.close();
}

function initializeParticles() {
  particles = [];

  for (let i = 0; i < settings.count; i++)
    particles.push(new Particle(random(windowWidth), random(windowHeight)));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Main update loop
function draw() {
  background(0, 15);

  if (settings.showDiagnostics)
    drawDiagnostics();

  if (!settings.animate)
    return;

  for (let particle of particles)
    particle.update();

  colorMode(HSB, 100);

  let quadTree = createQuadTree(particles);
  for (let particle of particles)
    particle.draw(quadTree, colors);
}

function createQuadTree(particles) {
  let qtBoundary = new Rectangle(windowWidth / 2, windowHeight / 2, windowWidth / 2, windowHeight / 2);
  let qt = new QuadTree(qtBoundary, settings.quadTreeSize);

  for (let particle of particles)
    qt.insert(particle.position.x, particle.position.y, particle);

  return qt;
}

function drawDiagnostics() {
  // Clear background
  fill(0);
  stroke(0);
  rectMode(CORNER)
  rect(5, 5, 80, 40);

  textSize(12);
  fill(255);
  stroke(0);

  let fps = frameRate();
  text("FPS:   " + fps.toFixed(), 10, 20);
  text("Count: " + particles.length.toFixed(), 10, 40);
}