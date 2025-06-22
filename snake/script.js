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
    
    // 游戏状态
    let snake = [];
    let food = { x: 0, y: 0 };
    let direction = 'right';
    let nextDirection = 'right';
    let gameRunning = false;
    let score = 0;
    let gameSpeed = 250;
    let gameLoop = null;
    
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
    
    // 生成食物（确保不在蛇身上）
    function generateFood() {
        let validPosition = false;
        while (!validPosition) {
            food = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
            validPosition = true;
            for (let segment of snake) {
                if (segment.x === food.x && segment.y === food.y) {
                    validPosition = false;
                    break;
                }
            }
        }
    }
    
    // 游戏主循环
    function gameUpdate() {
        if (!gameRunning) return;
        
        // 更新方向
        direction = nextDirection;
        
        // 计算新头部位置
        const head = { ...snake[0] };
        switch (direction) {
            case 'up':    head.y--; break;
            case 'down':  head.y++; break;
            case 'left':  head.x--; break;
            case 'right': head.x++; break;
        }
        
        // 碰撞检测
        if (
            head.x < 0 || head.x >= tileCount || 
            head.y < 0 || head.y >= tileCount ||
            snake.some(segment => segment.x === head.x && segment.y === head.y)
        ) {
            gameOver();
            return;
        }
        
        // 移动蛇
        snake.unshift(head);
        
        // 吃食物检测
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreDisplay.textContent = score;
            
            // 通关检测
            if (score >= 200) {
                gamePass();
                return;
            }
            
            generateFood();
            
            // 加速逻辑（每30分加速一次）
            if (score % 30 === 0 && gameSpeed > 50) {
                gameSpeed -= 10;
                clearInterval(gameLoop);
                gameLoop = setInterval(gameUpdate, gameSpeed);
            }
        } else {
            snake.pop(); // 没吃到食物时移除尾部
        }
        
        drawGame();
    }
    
    // 绘制游戏
    function drawGame() {
        // 清空画布
        ctx.fillStyle = '#ecf0f1';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制蛇身
        ctx.fillStyle = '#2ecc71';
        snake.forEach(segment => {
            ctx.fillRect(
                segment.x * gridSize, 
                segment.y * gridSize, 
                gridSize - 1, 
                gridSize - 1
            );
        });
        
        // 绘制蛇头（不同颜色）
        ctx.fillStyle = '#27ae60';
        const head = snake[0];
        ctx.fillRect(
            head.x * gridSize, 
            head.y * gridSize, 
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
    
    // 开始/重启游戏
    function startGame() {
        if (gameLoop) clearInterval(gameLoop);
        initGame();
        gameRunning = true;
        gameSpeed = 250;
        gameLoop = setInterval(gameUpdate, gameSpeed);
    }
    
    // 事件监听
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
    
    // 键盘控制
    document.addEventListener('keydown', (e) => {
        if (!gameRunning) return;
        
        switch (e.key) {
            case 'ArrowUp':    if (direction !== 'down')  nextDirection = 'up';    break;
            case 'ArrowDown':  if (direction !== 'up')    nextDirection = 'down';  break;
            case 'ArrowLeft':  if (direction !== 'right') nextDirection = 'left';  break;
            case 'ArrowRight': if (direction !== 'left')  nextDirection = 'right'; break;
        }
    });
    
    // 移动端触控按钮
    upBtn.addEventListener('click',    () => { if (gameRunning && direction !== 'down')  nextDirection = 'up';    });
    downBtn.addEventListener('click',  () => { if (gameRunning && direction !== 'up')    nextDirection = 'down';  });
    leftBtn.addEventListener('click',  () => { if (gameRunning && direction !== 'right') nextDirection = 'left';  });
    rightBtn.addEventListener('click', () => { if (gameRunning && direction !== 'left')  nextDirection = 'right'; });
    
    // 初始化绘制
    initGame();
    drawGame();
});
