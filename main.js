let log = console.log

let canvas = document.createElement('canvas')

document.body.appendChild(canvas)
const cw = 1000
const ch = 1000

canvas.width = cw
canvas.height = ch

let ctx = canvas.getContext('2d')

ctx.fillRect(10, 10, 100, 100)


class Particle {
	constructor(x, y, vx, vy) {
		this.x = x
		this.y = y
		this.vx = vx
		this.vy = vy
	}
}

let particles = []

function particle(x, y, vx, vy) {
	particles.push(new Particle(x, y, vx, vy))
}

let gravityX = 500
let gravityY = 500

let G = -100

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

const count = 10000

function init() {
	let speed = 5
	for (let i = 0; i < count; i++) {
		let x = 600 + (Math.random() * (cw - 700))
		let y = 480 + Math.random() * 40
		let vx = - Math.random() * speed
		let vy = 0 // Math.random() * speed

		particle(x, y, vx, vy)
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
}

setInterval(frame, 1000 / 60)
let simulateTime = 0
let drawTime = 0

let frameCount = 0
function frame(t) {
	frameCount++

	let simulateStart = performance.now()
	simulate()
	let simulateEnd = performance.now()

	simulateTime += simulateEnd - simulateStart

	let drawStart = performance.now()
	draw()
	let drawEnd = performance.now()

	simulateTime += simulateEnd - simulateStart
	drawTime += drawEnd - drawStart

	if (frameCount % 60 == 0) {
		log('simulate time per frame: ' + simulateTime / 60)
		simulateTime = 0
	}

	if (frameCount % 60 == 0) {
		log('draw time per frame: ' + drawTime / 60)
		drawTime = 0
	}
}

init()
frame()
