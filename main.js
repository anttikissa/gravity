let log = console.log

let canvas = document.createElement('canvas')

let gravityX = 500
let gravityY = 500

let G = -150

let isDown = false

function mousedown(e) {
	gravityX = e.offsetX * 2
	gravityY = e.offsetY * 2

	isDown = true
}

function mousemove(e) {
	if (isDown) {
		gravityX = e.offsetX * 2
		gravityY = e.offsetY * 2
	}
}

function mouseup() {
	isDown = false
}

canvas.addEventListener('mousedown', mousedown)
canvas.addEventListener('mouseup', mouseup)
canvas.addEventListener('mousemove', mousemove)

document.body.appendChild(canvas)
const cw = 1000
const ch = 1000

canvas.width = cw
canvas.height = ch

let ctx = canvas.getContext('2d')

class Particle {
	constructor(x, y, vx, vy) {
		this.x = x
		this.y = y
		this.vx = vx
		this.vy = vy
	}
}

function particle(x, y, vx, vy) {
	particles.push(new Particle(x, y, vx, vy))
}


function simulate() {
	for (let particle of particles) {
		particle.x += particle.vx
		particle.y += particle.vy

		if (particle.x < 0) {
			particle.x += cw
		}
		if (particle.x > cw) {
			particle.x -= cw
		}
		if (particle.y < 0) {
			particle.y += ch
		}
		if (particle.y > ch) {
			particle.y -= ch
		}

		let dx = gravityX - particle.x
		let dy = gravityY - particle.y
		let d = Math.sqrt(dx * dx + dy * dy)
		let f = G / (d * d)
		let fx = f * dx / d
		let fy = f * dy / d
		particle.vx += fx
		particle.vy += fy

	}
}

const count = 50000

let particles = []

function addParticles(n = newParticlesPerFrame) {
	while (n--) {
		let speed = 5
		let target
		if (particles.length < count) {
			target = new Particle(0,0,0,0)
			particles.push(target)
		} else {
			target = particles[Math.random() * count | 0]
		}
		target.x = 850 + (Math.random() * 20 - 10)
		target.y = 480 + Math.random() * 40
		target.vx = - Math.random() * speed
		target.vy = 0 // Math.random() * speed
	}
}

function draw() {
	ctx.globalCompositeOperation = 'source-over'
	ctx.fillStyle = 'black'
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	ctx.globalCompositeOperation = 'lighter'
	ctx.fillStyle = '#444'

	for (let particle of particles) {
		ctx.fillRect(particle.x, particle.y, 2, 2)
	}

	ctx.fillStyle = '#fff'
	ctx.beginPath()
	ctx.arc(gravityX, gravityY, 10, 0, Math.PI * 2)
	ctx.fill()
}

setInterval(frame, 1000 / 60)
let simulateTime = 0
let drawTime = 0
let frameCount = 0

let newParticlesPerFrame = 250

function frame(t) {
	frameCount++

	addParticles()

	let simulateStart = performance.now()
	simulate()
	let simulateEnd = performance.now()
	simulateTime += simulateEnd - simulateStart

	let drawStart = performance.now()
	draw()
	let drawEnd = performance.now()
	drawTime += drawEnd - drawStart

	if (frameCount % 60 == 0) {
		log(particles.length + ' particles')
		log('simulate time per frame: ' + simulateTime / 60)
		simulateTime = 0
		log('draw time per frame: ' + drawTime / 60)
		drawTime = 0
	}
}

// init()
frame()
