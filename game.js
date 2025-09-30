class Snake {
    constructor() {
        this.reset();
    }

    reset() {
        this.position = [{ x: 10, y: 10 }];
        this.direction = { x: 0, y: 0 };
        this.nextDirection = { x: 0, y: 0 };
        this.gridSize = 20;
        this.expanded = false;
    }

    update() {
        this.direction = this.nextDirection;
        const head = { ...this.position[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;
        this.position.unshift(head);
        if (!this.expanded) {
            this.position.pop();
        }
        this.expanded = false;
    }

    expand() {
        this.expanded = true;
    }

    setDirection(direction) {
        const oppositeDirection = (
            (direction.x !== 0 && direction.x === -this.direction.x) ||
            (direction.y !== 0 && direction.y === -this.direction.y)
        );
        if (!oppositeDirection) {
            this.nextDirection = direction;
        }
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.snake = new Snake();
        this.score = 0;
        this.food = { x: 15, y: 15 };
        this.gameLoop = null;
        this.gridSize = 20;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    startGame() {
        if (this.gameLoop) return;
        this.snake.reset();
        this.score = 0;
        this.updateScore();
        this.generateFood();
        this.gameLoop = setInterval(() => this.update(), 150);
        document.getElementById('startBtn').textContent = 'Restart Game';
    }

    handleKeyPress(event) {
        const directions = {
            'ArrowUp': { x: 0, y: -1 },
            'ArrowDown': { x: 0, y: 1 },
            'ArrowLeft': { x: -1, y: 0 },
            'ArrowRight': { x: 1, y: 0 }
        };
        if (directions[event.key]) {
            event.preventDefault();
            this.snake.setDirection(directions[event.key]);
        }
    }

    update() {
        this.snake.update();
        if (this.checkCollision()) {
            this.endGame();
            return;
        }
        if (this.checkFoodCollision()) {
            this.snake.expand();
            this.score += 10;
            this.updateScore();
            this.generateFood();
        }
        this.draw();
    }

    checkCollision() {
        const head = this.snake.position[0];
        // Wall collision
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
            return true;
        }
        // Self collision
        return this.snake.position.slice(1).some(segment =>
            segment.x === head.x && segment.y === head.y
        );
    }

    checkFoodCollision() {
        const head = this.snake.position[0];
        return head.x === this.food.x && head.y === this.food.y;
    }

    generateFood() {
        const maxPos = this.canvas.width / this.gridSize;
        do {
            this.food.x = Math.floor(Math.random() * maxPos);
            this.food.y = Math.floor(Math.random() * maxPos);
        } while (this.snake.position.some(segment =>
            segment.x === this.food.x && segment.y === this.food.y
        ));
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#e8e8e8';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        this.snake.position.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? '#2ecc71' : '#27ae60';
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 1,
                this.gridSize - 1
            );
        });

        // Draw food
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillRect(
            this.food.x * this.gridSize,
            this.food.y * this.gridSize,
            this.gridSize - 1,
            this.gridSize - 1
        );
    }

    endGame() {
        clearInterval(this.gameLoop);
        this.gameLoop = null;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2);
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
    }
}

// Initialize the game
const game = new Game();
