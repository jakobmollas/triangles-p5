'use strict'

class Particle {
    constructor(x, y) {
        this.velocity = createVector(random(-1, 1), random(-1, 1));
        this.position = createVector(x, y);
    }

    update() {
        this.position.add(this.velocity);
        this.wraparoundIfNeeded();
    }

    draw(qtParticles) {
        push();

        colorMode(HSB, 100);

        let hue =  map(this.velocity.heading(), -1, 1, 25, 35);
        stroke(hue, 100, 100, 50);

        let perceptionRadius = 50;
        let matchedPoints = this.getReducedAreaMatch(qtParticles, perceptionRadius, 2);

        if (matchedPoints.length == 2) {
            line(this.position.x, this.position.y, matchedPoints[0].userData.position.x, matchedPoints[0].userData.position.y);
            line(matchedPoints[0].userData.position.x, matchedPoints[0].userData.position.y, matchedPoints[1].userData.position.x, matchedPoints[1].userData.position.y);
            line(matchedPoints[1].userData.position.x, matchedPoints[1].userData.position.y, this.position.x, this.position.y);
        }

        pop();
    }

    wraparoundIfNeeded() {
        if (this.position.x < 0)
            this.position.x = width;
        else if (this.position.x > width)
            this.position.x = 0;

        if (this.position.y < 0)
            this.position.y = height;
        else if (this.position.y > height)
            this.position.y = 0;
    }

    getReducedAreaMatch(qtParticles, searchRadius, maxCount) {
        let searchArea = new CircleArea(this.position.x, this.position.y, searchRadius);
        let matchedPoints = qtParticles.query(searchArea).filter(n => n.userData !== this);
        let sortedPoints = matchedPoints.sort((a, b) => p5.Vector.dist(this.position, a.userData.position) - p5.Vector.dist(this.position, b.userData.position));
        
        return sortedPoints.slice(0, maxCount);
    }
}