document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const startBtn = document.getElementById('startBtn');
    const gameOverDiv = document.getElementById('gameOver');
    const restartBtn = document.getElementById('restartBtn');
    
    // 移动端控制按钮
    const upBtn = document.getElementById('upBtn');
    const downBtn = document.getElementById('downBtn');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    
    // 游戏设置
    const gridSize = 20;
    const tileCount = 20;
    canvas.width = gridSize * tileCount;
    canvas.height = gridSize * tileCount;
    
    let snake = [];
    let food = {};
    let direction = 'right';
    let nextDirection = 'right';
    let gameRunning = false;
    let score = 0;
    let gameSpeed = 150;
    let gameLoop;
    
    // 初始化游戏
    function initGame() {
        snake = [
            {x: 10, y: 10},
            {x: 9, y: 10},
            {x: 8, y: 10}
        ];
        
        generateFood();
        direction = 'right';
        nextDirection = 'right';
        score = 0;
        scoreDisplay.textContent = score;
        gameOverDiv.classList.add('hidden');
    }
    
    // 生成食物
    function generateFood() {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        // 确保食物不会出现在蛇身上
        for (let segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                return generateFood();
            }
        }
    }
    
    // 游戏主循环
    function gameUpdate() {
        // 更新蛇的方向
        direction = nextDirection;
        
        // 移动蛇
        const head = {x: snake[0].x, y: snake[0].y};
        
        switch (direction) {
            case 'up':
                head.y--;
                break;
            case 'down':
                head.y++;
                break;
            case 'left':
                head.x--;
                break;
            case 'right':
                head.x++;
                break;
        }
        
        // 检查碰撞
        if (checkCollision(head)) {
            gameOver();
            return;
        }
        
        // 添加新头部
        snake.unshift(head);
        
        // 检查是否吃到食物
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreDisplay.textContent = score;
            
            // 检查是否通关
            if (score >= 100) {
                gamePass();
                return;
            }
            
            generateFood();
            
            // 随着分数增加加快游戏速度
            if (score % 30 === 0 && gameSpeed > 50) {
                gameSpeed -= 10;
                clearInterval(gameLoop);
                gameLoop = setInterval(gameUpdate, gameSpeed);
            }
        } else {
            // 如果没有吃到食物，移除尾部
            snake.pop();
        }
        
        // 绘制游戏
        drawGame();
    }
    
    // 检查碰撞
    function checkCollision(head) {
        // 检查墙壁碰撞
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            return true;
        }
        
        // 检查自身碰撞
        for (let i = 0; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        
        return false;
    }
    
    // 绘制游戏
    function drawGame() {
        // 清空画布
        ctx.fillStyle = '#ecf0f1';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制蛇
        ctx.fillStyle = '#2ecc71';
        for (let segment of snake) {
            ctx.fillRect(
                segment.x * gridSize, 
                segment.y * gridSize, 
                gridSize - 1, 
                gridSize - 1
            );
        }
        
        // 绘制头部（不同颜色）
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(
            snake[0].x * gridSize, 
            snake[0].y * gridSize, 
            gridSize - 1, 
            gridSize - 1
        );
        
        // 绘制食物
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(
            food.x * gridSize, 
            food.y * gridSize, 
            gridSize - 1, 
            gridSize - 1
        );
    }
    
    // 游戏结束
    function gameOver() {
        clearInterval(gameLoop);
        gameRunning = false;
        document.querySelector('#gameOver h2').textContent = '游戏结束！';
        gameOverDiv.classList.remove('hidden');
    }
    
    // 游戏通关
    function gamePass() {
        clearInterval(gameLoop);
        gameRunning = false;
        document.querySelector('#gameOver h2').textContent = '恭喜通过，老婆最棒！';
        gameOverDiv.classList.remove('hidden');
    }
    
    // 开始游戏
    function startGame() {
        initGame();
        drawGame();
        gameRunning = true;
        gameSpeed = 150;
        gameLoop = setInterval(gameUpdate, gameSpeed);
    }
    
    // 事件监听
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
    
    // 键盘控制
    document.addEventListener('keydown', (e) => {
        if (!gameRunning) return;
        
        switch (e.key) {
            case 'ArrowUp':
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') nextDirection = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') nextDirection = 'right';
                break;
        }
    });
    
    // 移动端控制
    upBtn.addEventListener('click', () => {
        if (gameRunning && direction !== 'down') nextDirection = 'up';
    });
    
    downBtn.addEventListener('click', () => {
        if (gameRunning && direction !== 'up') nextDirection = 'down';
    });
    
    leftBtn.addEventListener('click', () => {
        if (gameRunning && direction !== 'right') nextDirection = 'left';
    });
    
    rightBtn.addEventListener('click', () => {
        if (gameRunning && direction !== 'left') nextDirection = 'right';
    });
    
    // 初始化绘制
    initGame();
    drawGame();
});
