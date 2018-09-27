// source: https://gist.github.com/harrytallbelt/9c1ccea9465cfcb524af765591087759

const LINE_WIDTH = 80 // 150
const CONTINUATION_PROBABILITY = 0.9
const FRAMERATE = 100

console.log('\x1b[32m') // green text
console.log('\x1b[40m') // black bg

let line = []
for (let i = 0; i < LINE_WIDTH / 2; ++i) {
  line.push(false)
}
while (true) {
  render(line)
  line = generateNewLine(line)
  wait(FRAMERATE)
}

function render(line) {
  console.log(line
    .map(c => c ? randomChar() : ' ')
    .join(' '))
}

function randomChar() {
  return String.fromCharCode(33 + Math.floor(Math.random() * 94))
}

function generateNewLine(oldLine) {
  return oldLine
    .map(c => Math.random() < CONTINUATION_PROBABILITY ? c : !c)
}

function wait(ms) {
  const time = new Date().getTime()
  while (new Date().getTime() < time + ms) {}
}
