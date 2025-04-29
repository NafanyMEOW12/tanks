const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playButton = document.getElementById('play-button');
const menu = document.getElementById('menu');

let gameRunning = false;
let currentLevel = 1;
let score = 0; 
let purchasedTanks = [];
let currentTankAbility = null;
let enemyShootInterval = null;
let allyShootInterval = null;
let bossShootInterval = null;


const textures = {
    player: new Image(),
    enemy: new Image(),
    ally: new Image(),
    wall: new Image(),
    floor: new Image(),
    boss: new Image() // Текстура босса
};

textures.player.src = 'playerTank.png';
textures.enemy.src = 'enemyTank.png';
textures.ally.src = 'allyTank.png';
textures.wall.src = 'wallTexture.png';
textures.floor.src = 'floorTexture.png';
textures.boss.src = 'bossTank.png'; // Путь к текстуре босса

let imagesLoaded = 0;
const totalImages = 6; // Увеличиваем на 1

function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        startGame();
        score = 1000;
updateScore();

    }
}

textures.player.onload = checkImagesLoaded;
textures.enemy.onload = checkImagesLoaded;
textures.ally.onload = checkImagesLoaded;
textures.wall.onload = checkImagesLoaded;
textures.floor.onload = checkImagesLoaded;
textures.boss.onload = checkImagesLoaded; // Проверяем загрузку текстуры босса

function startGame() {
    score = 0; // Сбрасываем счет при старте игры
    updateScore(); // Обновляем отображение счета
    console.log('Все изображения загружены, игра началась!');
}

const player = {
    x: 100,
    y: 100,
    width: 40,
    height: 40,
    color: 'yellow',
    bullets: [],
    speed: 4,
    direction: 'up',
    health: 1,
    ability: null,
    invincibilityEffect: null
};

let enemies = [];
let walls = [];
let ally = null;

function generateLevel(level) {
    enemies = [];
    walls = [];
    ally = null;

    if (level === 1) {
        walls.push({ x: 200, y: 200, width: 100, height: 40 });
        walls.push({ x: 400, y: 300, width: 40, height: 100 });
        walls.push({ x: 600, y: 200, width: 100, height: 40 });
    } else if (level === 2) {
        walls.push({ x: 200, y: 200, width: 100, height: 40 });
        walls.push({ x: 400, y: 300, width: 40, height: 100 });
        walls.push({ x: 600, y: 200, width: 100, height: 40 });
    } else if (level === 3) {
        walls.push({ x: 200, y: 200, width: 100, height: 40 });
        walls.push({ x: 400, y: 300, width: 40, height: 100 });
        walls.push({ x: 600, y: 200, width: 100, height: 40 });
    } else if (level === 4) {
        // Добавляем босса на 4 уровень
        enemies.push({
            x: canvas.width / 2 - 50, // По центру экрана
            y: canvas.height / 2 - 50,
            width: 80, // Больше обычных танков
            height: 80,
            color: 'red', // Цвет босса
            bullets: [],
            direction: 'up',
            speed: 1, // Медленнее обычных танков
            health: 30, // 30 попаданий для убийства
            isBoss: true // Флаг, что это босс
        });
    }

    const enemyCount = level === 1 ? 2 : level === 2 ? 4 : level === 3 ? 5 : 0; // На 4 уровне только босс
    for (let i = 0; i < enemyCount; i++) {
        enemies.push({
            x: Math.random() * 700 + 50,
            y: Math.random() * 500 + 50,
            width: 40,
            height: 40,
            color: 'blue',
            bullets: [],
            direction: 'up',
            speed: 2,
            health: 1
        });
    }

    if (level === 3) {
        ally = {
            x: 300,
            y: 400,
            width: 40,
            height: 40,
            color: 'green',
            bullets: [],
            speed: 3,
            health: 1,
            direction: 'up'
        };
    }
}

function isColliding(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    );
}

function showRegister() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "block";
}

function showLogin() {
    document.getElementById("login-form").style.display = "block";
    document.getElementById("register-form").style.display = "none";
}

function login() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    if (username && password) {
        alert("Вы вошли как " + username);
        document.getElementById("auth-container").style.display = "none";
        document.getElementById("menu").style.display = "block";
    } else {
        alert("Пожалуйста, заполните все поля.");
    }
}

function register() {
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;

    if (username && password) {
        alert("Регистрация прошла успешно! Добро пожаловать, " + username);
        document.getElementById("auth-container").style.display = "none";
        document.getElementById("menu").style.display = "block";
    } else {
        alert("Пожалуйста, заполните все поля.");
    }
}

const tankImage = document.getElementById('menu-tank');
if (tankImage) {
    tankImage.addEventListener('click', () => {
        console.log('Фотография в меню нажата');
        alert('Ты выбрал танк, красавец!');
    });
} else {
    console.error('Элемент с id="menu-tank" не найден!');
}

function handleBoundaries(obj) {
    if (obj.x < 0) obj.x = 0;
    if (obj.y < 0) obj.y = 0;
    if (obj.x + obj.width > canvas.width) obj.x = canvas.width - obj.width;
    if (obj.y + obj.height > canvas.height) obj.y = canvas.height - obj.height;
}

const keys = {};
window.addEventListener('keydown', (e) => (keys[e.key] = true));
window.addEventListener('keyup', (e) => (keys[e.key] = false));

function movePlayer() {
    const previousPosition = { x: player.x, y: player.y };

    if (keys.ArrowUp) {
        player.y -= player.speed;
        player.direction = 'up';
    }
    if (keys.ArrowDown) {
        player.y += player.speed;
        player.direction = 'down';
    }
    if (keys.ArrowLeft) {
        player.x -= player.speed;
        player.direction = 'left';
    }
    if (keys.ArrowRight) {
        player.x += player.speed;
        player.direction = 'right';
    }

    for (const wall of walls) {
        if (isColliding(player, wall)) {
            player.x = previousPosition.x;
            player.y = previousPosition.y;
        }
    }

    handleBoundaries(player);
}

function moveEnemies() {
    for (const enemy of enemies) {
        if (enemy.isBoss) {
            // Босс двигается медленнее
            if (Math.random() < 0.01) { // Реже меняет направление
                const directions = ['up', 'down', 'left', 'right'];
                enemy.direction = directions[Math.floor(Math.random() * directions.length)];
            }

            const previousPosition = { x: enemy.x, y: enemy.y };

            if (enemy.direction === 'up') enemy.y -= enemy.speed;
            if (enemy.direction === 'down') enemy.y += enemy.speed;
            if (enemy.direction === 'left') enemy.x -= enemy.speed;
            if (enemy.direction === 'right') enemy.x += enemy.speed;

            for (const wall of walls) {
                if (isColliding(enemy, wall)) {
                    enemy.x = previousPosition.x;
                    enemy.y = previousPosition.y;
                }
            }

            handleBoundaries(enemy);
        } else {
            // Обычные враги
            if (Math.random() < 0.02) {
                const directions = ['up', 'down', 'left', 'right'];
                enemy.direction = directions[Math.floor(Math.random() * directions.length)];
            }

            const previousPosition = { x: enemy.x, y: enemy.y };

            if (enemy.direction === 'up') enemy.y -= enemy.speed;
            if (enemy.direction === 'down') enemy.y += enemy.speed;
            if (enemy.direction === 'left') enemy.x -= enemy.speed;
            if (enemy.direction === 'right') enemy.x += enemy.speed;

            for (const wall of walls) {
                if (isColliding(enemy, wall)) {
                    enemy.x = previousPosition.x;
                    enemy.y = previousPosition.y;
                }
            }

            handleBoundaries(enemy);
        }
    }
}

function moveAlly() {
    if (!ally) return;

    if (Math.random() < 0.02) {
        const directions = ['up', 'down', 'left', 'right'];
        ally.direction = directions[Math.floor(Math.random() * directions.length)];
    }

    const previousPosition = { x: ally.x, y: ally.y };

    if (ally.direction === 'up') ally.y -= ally.speed;
    if (ally.direction === 'down') ally.y += ally.speed;
    if (ally.direction === 'left') ally.x -= ally.speed;
    if (ally.direction === 'right') ally.x += ally.speed;

    for (const wall of walls) {
        if (isColliding(ally, wall)) {
            ally.x = previousPosition.x;
            ally.y = previousPosition.y;
        }
    }

    handleBoundaries(ally);
}



function bossShoot(boss) {
    if (boss.health > 0) {
        // Стрельба в 4 стороны
        const directions = ['up', 'down', 'left', 'right'];
        directions.forEach((direction) => {
            boss.bullets.push({
                x: boss.x + boss.width / 2 - 5,
                y: boss.y + boss.height / 2 - 5,
                width: 10,
                height: 10,
                color: 'purple', // Цвет пуль босса
                direction: direction
            });
        });
    }
}

// Стрельба союзника
setInterval(() => {
    if (gameRunning && ally && ally.health > 0) {
        shoot(ally.bullets, ally);
    }
}, 2000);

// Стрельба врагов
// Стрельба врагов
setInterval(() => {
    if (gameRunning) {
        enemies.forEach((enemy) => {
            if (enemy.health > 0) {
                shoot(enemy.bullets, enemy);
            }
        });
    }
}, 1000);

setInterval(() => {
    if (gameRunning && currentLevel === 4) {
        const boss = enemies.find(enemy => enemy.isBoss); // Находим босса
        if (boss) {
            bossShoot(boss); // Босс стреляет
        }
    }
}, 2000); // Каждые 2 секунды

function moveBullets(bullets) {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];

        if (bullet.direction === 'up') bullet.y -= 5;
        if (bullet.direction === 'down') bullet.y += 5;
        if (bullet.direction === 'left') bullet.x -= 5;
        if (bullet.direction === 'right') bullet.x += 5;

        // Проверяем столкновение с границами экрана
        if (
            bullet.x < 0 ||
            bullet.y < 0 ||
            bullet.x > canvas.width ||
            bullet.y > canvas.height
        ) {
            bullets.splice(i, 1);
            continue;
        }

        // Проверяем столкновение пули со стенами
        for (const wall of walls) {
            if (isColliding(bullet, wall)) {
                bullets.splice(i, 1); // Удаляем пулю при попадании в стену
                break;
            }
        }
    }
}


window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ' && gameRunning) {
        shoot(player.bullets, player);
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function moveBulletsForAll() {
    moveBullets(player.bullets);
    enemies.forEach(enemy => moveBullets(enemy.bullets));
    if (ally) moveBullets(ally.bullets);
}

function updateScore() {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = score; // Обновляем текст счета
}

function checkCollisions() {
    for (let i = player.bullets.length - 1; i >= 0; i--) {
        const bullet = player.bullets[i];

        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            if (isColliding(bullet, enemy)) {
                player.bullets.splice(i, 1);
                enemy.health -= 1;
                
                if (enemy.health <= 0) {
                    enemies.splice(j, 1);
                    if (enemy.isBoss) {
                        endGame('win');
                    } else {
                        score += 10;
                        updateScore();
                    }
                }
                break;
            }
        }
    }

    if (ally) {
        for (let i = ally.bullets.length - 1; i >= 0; i--) {
            const bullet = ally.bullets[i];

            for (let j = enemies.length - 1; j >= 0; j--) {
                const enemy = enemies[j];
                if (isColliding(bullet, enemy)) {
                    ally.bullets.splice(i, 1);
                    enemy.health -= 1;
                    
                    if (enemy.health <= 0) {
                        enemies.splice(j, 1);
                        if (enemy.isBoss) {
                            endGame('win');
                        } else {
                            score += 10;
                            updateScore();
                        }
                    }
                    break;
                }
            }
        }
    }

    for (const enemy of enemies) {
        for (let i = enemy.bullets.length - 1; i >= 0; i--) {
            const bullet = enemy.bullets[i];
            if (!player.invincible && isColliding(bullet, player)) { // Проверяем неуязвимость
                enemy.bullets.splice(i, 1);
                player.health -= 1;
                if (player.health <= 0) {
                    endGame('lose');
                }
                return;
            }
        }
    }

    if (ally) {
        for (const enemy of enemies) {
            for (let i = enemy.bullets.length - 1; i >= 0; i--) {
                const bullet = enemy.bullets[i];
                if (isColliding(bullet, ally)) {
                    enemy.bullets.splice(i, 1);
                    ally.health -= 1;
                    if (ally.health <= 0) {
                        ally = null;
                    }
                }
            }
        }
    }
}

function endGame(result) {
    gameRunning = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(result === 'win' ? 'Красавец!' : 'Лузер!', canvas.width / 2, canvas.height / 2);

    if (result === 'win') {
        if (currentLevel < 4) {
            const nextButton = document.createElement('button');
            nextButton.innerText = 'Перейти на супер пупер мега некст уровень';
            nextButton.style.position = 'absolute';
            nextButton.style.top = '50%';
            nextButton.style.left = '50%';
            nextButton.style.transform = 'translate(-50%, -50%)';
            document.body.appendChild(nextButton);
            nextButton.addEventListener('click', () => {
                nextButton.remove();
                nextLevel();
            });
        } else {
            const backToMenuButton = document.createElement('button');
            backToMenuButton.innerText = 'Назад в меню';
            backToMenuButton.style.position = 'absolute';
            backToMenuButton.style.top = '50%';
            backToMenuButton.style.left = '50%';
            backToMenuButton.style.transform = 'translate(-50%, -50%)';
            document.body.appendChild(backToMenuButton);

            backToMenuButton.addEventListener('click', () => {
                backToMenuButton.remove();
                returnToMenu();
            });
        }
    } else if (result === 'lose') {
        const restartButton = document.createElement('button');
        restartButton.innerText = 'Начинаем заново да дон';
        restartButton.style.position = 'absolute';
        restartButton.style.top = '50%';
        restartButton.style.left = '50%';
        restartButton.style.transform = 'translate(-50%, -50%)';
        document.body.appendChild(restartButton);

        restartButton.addEventListener('click', () => {
            restartButton.remove();
            restartLevel();
        });

        const menuButton = document.createElement('button');
        menuButton.innerText = 'Выйти в меню';
        menuButton.style.position = 'absolute';
        menuButton.style.top = '60%';
        menuButton.style.left = '50%';
        menuButton.style.transform = 'translate(-50%, -50%)';
        document.body.appendChild(menuButton);

        menuButton.addEventListener('click', () => {
            menuButton.remove();
            restartButton.remove();
            returnToMenu();
        });
    }
}


function returnToMenu() {
    gameRunning = false;
    menu.style.display = 'block';
    canvas.style.display = 'none';
    updateScore();

    // Удалим все кнопки, которые могли остаться после игры
    document.querySelectorAll('body > button').forEach(btn => btn.remove());
}


function nextLevel() {
    currentLevel++;
    generateLevel(currentLevel);
    gameRunning = true;
    gameLoop();
}
function setupShootingIntervals() {
    clearInterval(enemyShootInterval);
    clearInterval(allyShootInterval);
    clearInterval(bossShootInterval);

    enemyShootInterval = setInterval(() => {
        if (gameRunning) {
            enemies.forEach((enemy) => {
                if (enemy.health > 0) {
                    shoot(enemy.bullets, enemy);
                }
            });
        }
    }, 2000); // Заменили с 1000 на 2000 мс

    allyShootInterval = setInterval(() => {
        if (gameRunning && ally && ally.health > 0) {
            shoot(ally.bullets, ally);
        }
    }, 2000);

    bossShootInterval = setInterval(() => {
        if (gameRunning && currentLevel === 4) {
            const boss = enemies.find(enemy => enemy.isBoss);
            if (boss) bossShoot(boss);
        }
    }, 2000);
}
function restartLevel() {
    gameRunning = true;
    menu.style.display = 'none';
    canvas.style.display = 'block';

  
    player.x = 100;
    player.y = 100;
    player.health = 1;
    player.bullets = [];
    player.invincible = false;
    player.color = 'yellow';
    
    
    if (currentTankAbility) {
        player.ability = currentTankAbility;
        applyTankAbilities();
    }

    generateLevel(currentLevel);
    gameLoop();
    setupShootingIntervals();
    updateScore();
}


function drawFloor() {
    const pattern = ctx.createPattern(textures.floor, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawObject(obj) {
    if (obj === player) {
        ctx.drawImage(textures.player, obj.x, obj.y, obj.width, obj.height);
    } else if (obj === ally) {
        ctx.drawImage(textures.ally, obj.x, obj.y, obj.width, obj.height);
    } else if (enemies.includes(obj)) {
        if (obj.isBoss) {
            // Отрисовка босса с текстурой
            ctx.drawImage(textures.boss, obj.x, obj.y, obj.width, obj.height);
        } else {
            ctx.drawImage(textures.enemy, obj.x, obj.y, obj.width, obj.height);
        }
    } else if (obj === "floor") {
        const pattern = ctx.createPattern(textures.floor, 'repeat');
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (obj === "wall") {
        ctx.drawImage(textures.wall, obj.x, obj.y, obj.width, obj.height);
    } else {
        ctx.fillStyle = obj.color;
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    }
}

function drawBullet(bullet) {
    ctx.fillStyle = bullet.color;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
}

function drawBullets(bullets) {
    bullets.forEach(drawBullet);
}

function drawWall(wall) {
    ctx.drawImage(textures.wall, wall.x, wall.y, wall.width, wall.height);
}

function drawWalls(walls) {
    walls.forEach(drawWall);
}

function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawObject("floor");
    drawWalls(walls);
    drawBullets(player.bullets);
    
    enemies.forEach((enemy) => drawBullets(enemy.bullets));
    
    if (ally) drawBullets(ally.bullets);
    
    // Отрисовка игрока с учетом неуязвимости
    if (player.invincible) {
        player.color = player.color === 'yellow' ? 'white' : 'yellow'; // Мигание цветом
    } else {
        player.color = 'yellow'; // Возвращаем исходный цвет
    }
    drawObject(player);
    
    enemies.forEach(drawObject);
    
    if (ally) drawObject(ally);
    
    movePlayer();
    moveEnemies();
    moveBullets(player.bullets);
    enemies.forEach((enemy) => moveBullets(enemy.bullets));
    if (ally) moveBullets(ally.bullets);
    checkCollisions();

    if (enemies.length === 0) endGame('win');

    requestAnimationFrame(gameLoop);
}



playButton.addEventListener('click', () => {
    menu.style.display = 'none';
    canvas.style.display = 'block';
    gameRunning = true;

    currentLevel = 1;

    

    if (currentTankAbility) {
        player.ability = currentTankAbility;
        applyTankAbilities();
    }
    
    generateLevel(currentLevel);
    setupShootingIntervals();
    gameLoop();
});
const shopButton = document.getElementById('shop-button');
const shop = document.getElementById('shop');
const backToMenuButton = document.getElementById('back-to-menu');

shopButton.addEventListener('click', () => {
    menu.style.display = 'none';
    shop.style.display = 'block';
});

backToMenuButton.addEventListener('click', () => {
    shop.style.display = 'none';
    menu.style.display = 'block';
});
const shopTanks = [
    { name: "Танк 1", price: 100, ability: "doubleShot", texture: "tank1.png", owned: false },
    { name: "Танк 2", price: 250, ability: "invincibility", texture: "tank2.png", owned: false },
    { name: "Танк 3", price: 350, ability: "quadShot", texture: "tank3.png", owned: false }
];

let selectedTank = "playerTank.png";

function renderShop() {
    const shopContainer = document.getElementById("shop");
    shopContainer.innerHTML = "";
    
    shopTanks.forEach((tank, index) => {
        const tankDiv = document.createElement("div");
        tankDiv.classList.add("shop-item");
        
        const img = document.createElement("img");
        img.src = tank.texture;
        img.classList.add("tank-image");
        
        const price = document.createElement("p");
        price.textContent = `Цена: ${tank.price} очков`;
        
        const buyButton = document.createElement("button");
        buyButton.textContent = tank.owned ? "Куплено" : "Купить";
        buyButton.disabled = tank.owned;
        buyButton.onclick = () => buyTank(index);
        
        const applyButton = document.createElement("button");
        applyButton.textContent = "Применить";
        applyButton.onclick = () => applyTank(index);
        
        tankDiv.appendChild(img);
        tankDiv.appendChild(price);
        tankDiv.appendChild(buyButton);
        tankDiv.appendChild(applyButton);
        shopContainer.appendChild(tankDiv);
    });
    
    const backButton = document.createElement("button");
    backButton.textContent = "Назад в меню";
    backButton.onclick = () => {
        document.getElementById("shop").style.display = "none";
        document.getElementById("menu").style.display = "block";
    };
    shopContainer.appendChild(backButton);
}

function buyTank(index) {
    if (score >= shopTanks[index].price) {
        score -= shopTanks[index].price;
        shopTanks[index].owned = true;
        purchasedTanks.push(shopTanks[index].ability); // Сохраняем купленные танки
        renderShop();
        updateScore();
        alert(`Танк "${shopTanks[index].name}" куплен!`);
    } else {
        alert("Недостаточно очков!");
    }
}
function applyTankAbilities() {
    player.invincible = false;
    player.color = 'yellow';
    clearInterval(player.invincibilityEffect);

    // Обработка неуязвимости
    if (player.ability === "invincibility") {
        player.invincible = true;
        player.invincibilityEffect = setInterval(() => {
            player.color = player.color === 'yellow' ? 'white' : 'yellow';
        }, 200);

        setTimeout(() => {
            player.invincible = false;
            clearInterval(player.invincibilityEffect);
            player.color = 'yellow';
        }, 5000);
    }

    // doubleShot и quadShot не требуют действий здесь — главное, чтобы ability был установлен ДО выстрела
}



function applyTank(index) {
    if (shopTanks[index].owned) {
        currentTankAbility = shopTanks[index].ability;
        player.ability = currentTankAbility;
        textures.player.src = shopTanks[index].texture;
        applyTankAbilities();
        alert(`Танк "${shopTanks[index].name}" активирован!`);
    } else {
        alert("Сначала купите этот танк!");
    }
}




function shoot(bullets, shooter, directionOverride = null) {
    if (shooter.health <= 0) return;

    const direction = directionOverride || shooter.direction;
    const baseBullet = {
        x: shooter.x + shooter.width / 2 - 5,
        y: shooter.y + shooter.height / 2 - 5,
        width: 10,
        height: 10,
        color: shooter === player ? 'gold' : shooter.color === 'green' ? 'lime' : 'red',
        direction: direction
    };

    // Всегда создаем хотя бы одну пулю
    bullets.push({...baseBullet});

    // Двойной выстрел
    if (shooter.ability === "doubleShot") {
        setTimeout(() => {
            bullets.push({...baseBullet});
        }, 100);
    }

    // Четверной выстрел (только для игрока)
    if (shooter === player && shooter.ability === "quadShot") {
        ['up', 'down', 'left', 'right'].forEach(dir => {
            if (dir !== direction) {
                bullets.push({
                    ...baseBullet,
                    direction: dir
                });
            }
        });
    }
}


window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ' && gameRunning && player.health > 0) {
        shoot(player.bullets, player);
    }
});

console.log("Выбранная способность:", player.ability);

function showDeathScreen() {
    const deathScreen = document.createElement("div");
    deathScreen.classList.add("death-screen");
    deathScreen.innerHTML = "<h2>Вы проиграли!</h2>";
    
    const restartButton = document.createElement("button");
    restartButton.textContent = "Начать заново";
    restartButton.onclick = () => {
        deathScreen.remove();
        restartGame();
    };
    
    const menuButton = document.createElement("button");
    menuButton.textContent = "Выйти в меню";
    menuButton.onclick = () => {
        deathScreen.remove();
        document.getElementById("menu").style.display = "block";
        document.getElementById("game").style.display = "none";
    };
    
    deathScreen.appendChild(restartButton);
    deathScreen.appendChild(menuButton);
    document.body.appendChild(deathScreen);
}

renderShop();
