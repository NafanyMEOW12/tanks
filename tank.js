
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playButton = document.getElementById('play-button');
const menu = document.getElementById('menu');

let gameRunning = false;
let currentLevel = 1;
let currentChapter = 1;
let score = 5000; 
let purchasedTanks = [];
let currentTankAbility = null;
let enemyShootInterval = null;
let allyShootInterval = null;
let bossShootInterval = null;
let canShoot = true;
const reloadTime = 500; 
const fruits = ['🍎', '🍌', '🍇', '🍊', '🍉'];
const fruitTextures = {
    '🍎': new Image(),
    '🍌': new Image(),
    '🍇': new Image(),
    '🍊': new Image(),
    '🍉': new Image()
};


const textures = {
    player: new Image(),
    enemy: new Image(),
    ally: new Image(),
    wall: new Image(),
    floor: new Image(),
    boss: new Image(),
    enemy2: new Image(),
    enemy3: new Image(),
    boss2: new Image(),
    boss3: new Image(),
    floor2: new Image(),
    wall2: new Image(),
    floor3:new Image(),
    wall3: new Image(),
    shopTank1: new Image(),
    shopTank2: new Image(),
    shopTank3: new Image(),
    shopTank4: new Image(),
    shopTank5: new Image(),
    shopTank6: new Image(),
    shopTank7: new Image()
};


textures.player.src = 'playerTank.png';
textures.enemy.src = 'enemyTank.png';
textures.ally.src = 'allyTank.png';
textures.wall.src = 'wallTexture.png';
textures.floor.src = 'floorTexture.png';
textures.boss.src = 'bossTank.png';
textures.enemy2.src = 'enemyTank2.png';
textures.enemy3.src = 'enemyTank3.png';
textures.boss2.src = 'bossTank2.png';
textures.boss3.src = 'bossTank3.png';
textures.floor2.src = 'floorTexture2.png';
textures.wall2.src = 'wallTexture2.png';
textures.floor3.src = 'floorTexture3.png';
textures.wall3.src = 'wallTexture3.png';
textures.shopTank1.src = 'tank1.png';
textures.shopTank2.src = 'tank2.png';
textures.shopTank3.src = 'tank3.png';
textures.shopTank4.src = 'tank4.png';
textures.shopTank5.src = 'tank5.png';
textures.shopTank6.src = 'tank6.png';
textures.shopTank7.src = 'tank7.png';
fruitTextures['🍎'].src = 'Apple.png';
fruitTextures['🍌'].src = 'banana.png';
fruitTextures['🍇'].src = 'grape.png';
fruitTextures['🍊'].src = 'Orange.png';
fruitTextures['🍉'].src = 'Watermelon.png';




let imagesLoaded = 0;
const totalImages = 14; 

function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        startGame();
        
updateScore();

    }
}

textures.player.onload = checkImagesLoaded;
textures.enemy.onload = checkImagesLoaded;
textures.ally.onload = checkImagesLoaded;
textures.wall.onload = checkImagesLoaded;
textures.floor.onload = checkImagesLoaded;
textures.boss.onload = checkImagesLoaded;
textures.enemy2.onload = checkImagesLoaded;
textures.boss2.onload = checkImagesLoaded;
textures.floor2.onload = checkImagesLoaded;
textures.wall2.onload = checkImagesLoaded;
textures.wall3.onload = checkImagesLoaded;
textures.floor3.onload = checkImagesLoaded;
textures.boss3.onload = checkImagesLoaded;
textures.enemy3.onload = checkImagesLoaded;


function startGame() {
    score = 10000; 
    updateScore(); 
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

    const levelInfo = document.getElementById("level-info");
    const chapter = Math.ceil(level / 4);
    const levelInChapter = level - (chapter - 1) * 4;
    levelInfo.textContent = `Глава ${chapter}, Уровень ${levelInChapter}`;

    currentChapter = chapter; 

    // Стены — Глава 1
    if (level === 1 || level === 2 || level === 3) {
        walls.push({ x: 200, y: 200, width: 100, height: 40 });
        walls.push({ x: 400, y: 300, width: 40, height: 100 });
        walls.push({ x: 600, y: 200, width: 100, height: 40 });
    }

    // Стены — Глава 2
    else if (level >= 5 && level <= 7) {
        walls.push({ x: 100, y: 100, width: 100, height: 40 });
        walls.push({ x: 600, y: 100, width: 100, height: 40 });
        walls.push({ x: 100, y: 400, width: 100, height: 40 });
        walls.push({ x: 600, y: 400, width: 100, height: 40 });
    }

    // Стены — Глава 3
    else if (level === 9) {
        walls.push({ x: 150, y: 150, width: 100, height: 40 });
        walls.push({ x: 350, y: 250, width: 40, height: 100 });
        walls.push({ x: 550, y: 150, width: 100, height: 40 });
    } else if (level === 10) {
        walls.push({ x: 200, y: 100, width: 100, height: 40 });
        walls.push({ x: 400, y: 350, width: 40, height: 100 });
        walls.push({ x: 600, y: 250, width: 100, height: 40 });
    } else if (level === 11) {
        walls.push({ x: 100, y: 300, width: 100, height: 40 });
        walls.push({ x: 300, y: 150, width: 40, height: 100 });
        walls.push({ x: 500, y: 300, width: 100, height: 40 });
    }

    function createEnemySafe(extraProps = {}) {
        let tries = 0;
        let enemy;
        do {
            enemy = {
                x: Math.random() * 700 + 50,
                y: Math.random() * 500 + 50,
                width: 40,
                height: 40,
                color: 'blue',
                bullets: [],
                direction: 'up',
                speed: 2,
                health: 1,
                ...extraProps
            };
            tries++;
        } while (walls.some(wall => isColliding(enemy, wall)) && tries < 100);
        return enemy;
    }

    // Враги — Глава 1
    const enemyCount = level === 1 ? 2 : level === 2 ? 4 : level === 3 ? 5 : 0;
    for (let i = 0; i < enemyCount; i++) {
        enemies.push(createEnemySafe());
    }

    // Враги — Глава 2
    if (level >= 5 && level <= 7) {
        for (let i = 0; i < 4; i++) {
            enemies.push(createEnemySafe({ secondChapter: true }));
        }
    }

    // Враги — Глава 3
    if (level >= 9 && level <= 11) {
        for (let i = 0; i < 5; i++) {
            enemies.push(createEnemySafe({ thirdChapter: true }));
        }
    }

    // Босс — Глава 1
    if (level === 4) {
        enemies.push({
            x: canvas.width / 2 - 50,
            y: canvas.height / 2 - 50,
            width: 80,
            height: 80,
            color: 'red',
            bullets: [],
            direction: 'up',
            speed: 1,
            health: 30,
            isBoss: true
        });
    }

    // Босс — Глава 2
    if (level === 8) {
        const superBoss = {
            x: canvas.width / 2 - 50,
            y: canvas.height / 2 - 50,
            width: 80,
            height: 80,
            color: 'red',
            bullets: [],
            direction: 'up',
            speed: 3,
            health: 50,
            isBoss: true,
            superBoss: true,
            secondChapter: true
        };
        if (walls.some(wall => isColliding(superBoss, wall))) {
            superBoss.x = 100;
            superBoss.y = 100;
        }
        enemies.push(superBoss);
    }

    // Босс — Глава 3 (двойной)
    if (level === 12) {
        const boss1 = {
            x: 200,
            y: canvas.height / 2 - 50,
            width: 80,
            height: 80,
            color: 'red',
            bullets: [],
            direction: 'down',
            speed: 4,
            health: 30,
            isBoss: true,
            thirdChapter: true,
            shootPattern: 'quad'
        };

        const boss2 = {
            x: canvas.width - 280,
            y: canvas.height / 2 - 50,
            width: 80,
            height: 80,
            color: 'red',
            bullets: [],
            direction: 'down',
            speed: 4,
            health: 30,
            isBoss: true,
            thirdChapter: true,
            shootPattern: 'circle'
        };

        enemies.push(boss1, boss2);
    }

    // Союзник — Уровень 3
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
    if (boss.health <= 0) return;

    // Босс 1 главы (уровень 4) - стреляет в 4 стороны
    if (currentChapter === 1) {
        const directions = ['up', 'down', 'left', 'right'];
        directions.forEach((direction) => {
            boss.bullets.push({
                x: boss.x + boss.width / 2 - 5,
                y: boss.y + boss.height / 2 - 5,
                width: 10,
                height: 10,
                color: 'purple',
                direction: direction,
                speed: 5
            });
        });
    }
    // Босс 2 главы (уровень 8) - усиленная версия (стреляет чаще + случайные направления)
    else if (currentChapter === 2) {
        // Основной выстрел в 4 стороны
        const directions = ['up', 'down', 'left', 'right'];
        directions.forEach((direction) => {
            boss.bullets.push({
                x: boss.x + boss.width / 2 - 5,
                y: boss.y + boss.height / 2 - 5,
                width: 10,
                height: 10,
                color: 'red',
                direction: direction,
                speed: 6
            });
        });

        // Дополнительный случайный выстрел
        if (Math.random() > 0.7) {
            const randomDir = directions[Math.floor(Math.random() * directions.length)];
            boss.bullets.push({
                x: boss.x + boss.width / 2 - 5,
                y: boss.y + boss.height / 2 - 5,
                width: 15,
                height: 15,
                color: 'orange',
                direction: randomDir,
                speed: 4,
                power: 2
            });
        }
    }
    // Боссы 3 главы (уровень 12) - новая механика
    else if (currentChapter === 3) {
        if (boss.shootPattern === 'quad') {
            // Стрельба в 4 стороны
            const directions = ['up', 'down', 'left', 'right'];
            directions.forEach((direction) => {
                boss.bullets.push({
                    x: boss.x + boss.width / 2 - 5,
                    y: boss.y + boss.height / 2 - 5,
                    width: 10,
                    height: 10,
                    color: 'purple',
                    direction: direction,
                    speed: 5
                });
            });
        } 
        else if (boss.shootPattern === 'circle') {
            // Круговые выстрелы (8 направлений)
            const angles = [0, 45, 90, 135, 180, 225, 270, 315];
            angles.forEach((angle) => {
                const rad = angle * Math.PI / 180;
                const speed = 3;
                
                boss.bullets.push({
                    x: boss.x + boss.width / 2 - 5,
                    y: boss.y + boss.height / 2 - 5,
                    width: 10,
                    height: 10,
                    color: 'orange',
                    angle: angle,
                    speedX: Math.cos(rad) * speed,
                    speedY: Math.sin(rad) * speed,
                    isCircular: true
                });
            });
        }
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

        // Движение пуль в зависимости от типа
        if (bullet.isCircular) {
            // Движение круговых пуль (по углу)
            bullet.x += bullet.speedX;
            bullet.y += bullet.speedY;
        } else {
            // Движение обычных пуль
            const speed = bullet.speed || 5;
            switch (bullet.direction) {
                case 'up': bullet.y -= speed; break;
                case 'down': bullet.y += speed; break;
                case 'left': bullet.x -= speed; break;
                case 'right': bullet.x += speed; break;
            }
        }

        // Удаление пуль за границами canvas
        if (bullet.x < -20 || bullet.y < -20 || 
            bullet.x > canvas.width + 20 || bullet.y > canvas.height + 20) {
            bullets.splice(i, 1);
            continue;
        }

        // Проверка столкновений со стенами
        let collided = false;
        for (const wall of walls) {
            if (isColliding(bullet, wall)) {
                collided = true;
                
                if (bullet.ricochet) {
                    // Рикошет пуль
                    if (bullet.direction === "up" || bullet.direction === "down") {
                        bullet.direction = bullet.direction === "up" ? "down" : "up";
                        bullet.y += bullet.direction === "down" ? 5 : -5;
                    } else {
                        bullet.direction = bullet.direction === "left" ? "right" : "left";
                        bullet.x += bullet.direction === "right" ? 5 : -5;
                    }
                } else {
                    // Обычные пули исчезают
                    bullets.splice(i, 1);
                }
                break;
            }
        }
        
        // Проверка столкновений с другими пулями (если нужно)
        if (bullet.owner === 'player') {
            for (const enemy of enemies) {
                for (let j = enemy.bullets.length - 1; j >= 0; j--) {
                    const enemyBullet = enemy.bullets[j];
                    if (isColliding(bullet, enemyBullet)) {
                        enemy.bullets.splice(j, 1);
                        bullets.splice(i, 1);
                        break;
                    }
                }
            }
        }
    }
}



function shootBullet() {
    if (!canShoot) return;

    canShoot = false;
    setTimeout(() => canShoot = true, player.ability === 'chargeShot' ? 1200 : 500);

    const directions = [];
    if (player.ability === 'quadShot') {
        directions.push('up', 'down', 'left', 'right');
    } else {
        directions.push(player.direction);
    }

    directions.forEach((dir) => {
        player.bullets.push({
            x: player.x + player.width / 2 - 2.5,
            y: player.y + player.height / 2 - 2.5,
            width: 5,
            height: 5,
            direction: dir,
            owner: 'player',
            charge: player.ability === 'chargeShot' // спец. для нанесения повышенного урона
        });
    });

    if (player.ability === "mineTrap") {
        player.mines = player.mines || [];
        player.mines.push({
            x: player.x + player.width / 2 - 10,
            y: player.y + player.height / 2 - 10,
            width: 20,
            height: 20,
            timer: 3000,
        });
    }
}



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
function showLevelInfo(show) {
    const info = document.getElementById("level-info");
    info.style.display = show ? "block" : "none";
}


function checkCollisions() {
    // ➤ Пули игрока
    for (let i = player.bullets.length - 1; i >= 0; i--) {
        const bullet = player.bullets[i];

        // Столкновение с врагами
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            if (isColliding(bullet, enemy)) {
                player.bullets.splice(i, 1);
                enemy.health -= bullet.power || 1;

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

        // ➤ Рикошет от стен
        if (bullet.ricochet) {
            for (const wall of walls) {
                if (isColliding(bullet, wall)) {
                    // Меняем направление
                    if (bullet.direction === "up") bullet.direction = "down";
                    else if (bullet.direction === "down") bullet.direction = "up";
                    else if (bullet.direction === "left") bullet.direction = "right";
                    else if (bullet.direction === "right") bullet.direction = "left";

                    // Отодвигаем пулю, чтобы не застряла в стене
                    if (bullet.direction === "up") bullet.y -= 6;
                    else if (bullet.direction === "down") bullet.y += 6;
                    else if (bullet.direction === "left") bullet.x -= 6;
                    else if (bullet.direction === "right") bullet.x += 6;

                    break; // один рикошет за проверку
                }
            }
        } else {
            // Если нет рикошета, уничтожаем пулю при попадании в стену
            for (const wall of walls) {
                if (isColliding(bullet, wall)) {
                    player.bullets.splice(i, 1);
                    break;
                }
            }
        }
    }

    // ➤ Пули союзника
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
                        score += 10;
                        updateScore();
                    }
                    break;
                }
            }
        }
    }

    // ➤ Пули врагов попадают в игрока
    for (const enemy of enemies) {
        for (let i = enemy.bullets.length - 1; i >= 0; i--) {
            const bullet = enemy.bullets[i];
            if (!player.invincible && isColliding(bullet, player)) {
                enemy.bullets.splice(i, 1);

                if (player.ability === "doubleArmor") {
                    if (player.shieldHealth > 0) {
                        player.shieldHealth -= 1;
                        player.hasShield = true;
                        setTimeout(() => player.hasShield = false, 500);
                    } else {
                        player.health -= 1;
                    }
                } else {
                    player.health -= 1;
                }

                if (player.health <= 0) {
                    endGame('lose');
                }
                return;
            }
        }
    }

    // ➤ Пули врагов попадают в союзника
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

    // ➤ Столкновения игрока с врагами
    for (const enemy of enemies) {
        if (isColliding(player, enemy)) {
            if (player.ability === "doubleArmor") {
                if (player.shieldHealth > 0) {
                    player.shieldHealth -= 1;
                    player.hasShield = true;
                    setTimeout(() => player.hasShield = false, 500);
                } else {
                    player.health -= 1;
                }
            } else {
                player.health -= 1;
            }

            if (player.health <= 0) {
                endGame('lose');
            }
            return;
        }
    }
}



function endGame(result) {
    gameRunning = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.querySelectorAll('body > button').forEach(btn => btn.remove());

    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(result === 'win' ? 'Красавец!' : 'Лузер!', canvas.width / 2, canvas.height / 2);

    if (result === 'win') {
        if (currentLevel < 12) {
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
    // Очищаем предыдущие интервалы
    clearInterval(enemyShootInterval);
    clearInterval(allyShootInterval);
    clearInterval(bossShootInterval);

    // Интервал стрельбы обычных врагов
    enemyShootInterval = setInterval(() => {
        if (gameRunning) {
            enemies.forEach((enemy) => {
                if (enemy.health > 0 && !enemy.isBoss) { // Только обычные враги
                    shoot(enemy.bullets, enemy);
                }
            });
        }
    }, 2000);

    // Интервал стрельбы союзника
    allyShootInterval = setInterval(() => {
        if (gameRunning && ally && ally.health > 0) {
            shoot(ally.bullets, ally);
        }
    }, 2000);

    // Новый интервал стрельбы боссов (добавляем ваш код сюда)
    bossShootInterval = setInterval(() => {
        if (gameRunning) {
            const bosses = enemies.filter(enemy => enemy.isBoss);
            bosses.forEach(boss => {
                if (boss) {
                    bossShoot(boss);
                    // Для кругового босса делаем дополнительный выстрел
                    if (boss.shootPattern === 'circle') {
                        setTimeout(() => bossShoot(boss), 500);
                    }
                }
            });
        }
    }, 1500); // Интервал между залпами
}
function restartLevel() { 
    gameRunning = true;
    menu.style.display = 'none';
    canvas.style.display = 'block';
    document.querySelectorAll('body > button').forEach(btn => btn.remove());
    showLevelInfo(true);

    // Сброс состояния игрока
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

    // Генерация уровня
    generateLevel(currentLevel);

    // Проверка, не появился ли игрок в стене
    let spawnSafe = false;
    let attempts = 0;
    while (!spawnSafe && attempts < 50) {
        spawnSafe = true;
        for (const wall of walls) {
            if (isColliding(player, wall)) {
                player.x = Math.random() * (canvas.width - player.width);
                player.y = Math.random() * (canvas.height - player.height);
                spawnSafe = false;
                attempts++;
                break;
            }
        }
    }

    setupShootingIntervals();
    updateScore();
    gameLoop();
}



function drawFloor() {
    let texture;
    if (currentChapter === 1) {
        texture = textures.floor;
    } else if (currentChapter === 2) {
        texture = textures.floor2;
    } else if (currentChapter === 3) {
        texture = textures.floor3;
    }

    const pattern = ctx.createPattern(texture, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}





function drawObject(obj) {
    // Эффекты для боссов при низком здоровье
    if (obj.isBoss && obj.health <= obj.maxHealth * 0.5) {
        ctx.save();
        const pulse = 0.7 + 0.3 * Math.sin(Date.now() / 200);
        ctx.globalAlpha = pulse;
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.fillRect(obj.x - 5, obj.y - 5, obj.width + 10, obj.height + 10);
        ctx.restore();
    }

    // Отрисовка текстуры или цветного прямоугольника
    if (obj.texture) {
        ctx.drawImage(obj.texture, obj.x, obj.y, obj.width, obj.height);
    } else if (obj === player) {
        ctx.drawImage(textures.player, obj.x, obj.y, obj.width, obj.height);
    } else if (obj === ally) {
        ctx.drawImage(textures.ally, obj.x, obj.y, obj.width, obj.height);
    } else if (enemies.includes(obj)) {
        if (obj.isBoss) {
            // Отрисовка боссов
            let bossTexture;
            if (obj.secondChapter) bossTexture = textures.boss2;
            else if (obj.thirdChapter) bossTexture = textures.boss3;
            else bossTexture = textures.boss;
            
            ctx.drawImage(bossTexture, obj.x, obj.y, obj.width, obj.height);
        } else {
            // Отрисовка обычных врагов
            let enemyTexture;
            if (obj.secondChapter) enemyTexture = textures.enemy2;
            else if (obj.thirdChapter) enemyTexture = textures.enemy3;
            else enemyTexture = textures.enemy;
            
            ctx.drawImage(enemyTexture, obj.x, obj.y, obj.width, obj.height);
        }
    } else if (obj === "floor") {
        // Отрисовка пола
        const pattern = ctx.createPattern(textures.floor, 'repeat');
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (obj === "wall") {
        // Отрисовка стен
        let wallTexture;
        if (currentChapter === 2) wallTexture = textures.wall2;
        else if (currentChapter === 3) wallTexture = textures.wall3;
        else wallTexture = textures.wall;
        
        ctx.drawImage(wallTexture, obj.x, obj.y, obj.width, obj.height);
    } else {
        // Отрисовка цветных объектов (по умолчанию)
        ctx.fillStyle = obj.color || "gray";
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    }

    // Дополнительные эффекты
    if (obj === player) {
        // Эффект неуязвимости
        if (player.invincible) {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
            ctx.lineWidth = 3;
            ctx.strokeRect(obj.x - 5, obj.y - 5, obj.width + 10, obj.height + 10);
        }
        
        // Эффект щита
        if (player.hasShield) {
            ctx.strokeStyle = "rgba(0, 255, 0, 0.7)";
            ctx.lineWidth = 3;
            ctx.strokeRect(obj.x - 5, obj.y - 5, obj.width + 10, obj.height + 10);
        }
    }

    // Отображение здоровья боссов
    if (obj.isBoss) {
        // Полоска здоровья (фон)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(obj.x, obj.y - 15, obj.width, 10);
        
        // Полоска здоровья (текущий уровень)
        const healthPercent = obj.health / (obj.maxHealth || obj.health);
        ctx.fillStyle = healthPercent > 0.6 ? '#2ecc71' : 
                        healthPercent > 0.3 ? '#f1c40f' : '#e74c3c';
        ctx.fillRect(obj.x, obj.y - 15, obj.width * healthPercent, 10);
        
        // Рамка полоски
        ctx.strokeStyle = 'white';
        ctx.strokeRect(obj.x, obj.y - 15, obj.width, 10);
        
        // Текст с количеством HP (только текущее здоровье)
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${obj.health}`, obj.x + obj.width/2, obj.y - 5);
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
    const wallTexture = currentChapter === 2 ? textures.wall2 : textures.wall;
    ctx.drawImage(wallTexture, wall.x, wall.y, wall.width, wall.height);
}


function drawWalls(walls) {
    walls.forEach(drawWall);
}

function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    drawFloor();
    drawWalls(walls);

    
    drawBullets(player.bullets);
    enemies.forEach((enemy) => drawBullets(enemy.bullets));
    if (ally) drawBullets(ally.bullets);

    
    if (player.ability === "mineTrap" && player.mines) {
        for (let i = player.mines.length - 1; i >= 0; i--) {
            const mine = player.mines[i];
            
            
            ctx.fillStyle = "red";
            ctx.fillRect(mine.x, mine.y, mine.width, mine.height);
            
            
            mine.timer -= 16;
            
            
            ctx.fillStyle = "white";
            ctx.font = "10px Arial";
            ctx.fillText(Math.ceil(mine.timer/1000), mine.x + 5, mine.y + 15);
            
            
            
if (mine.timer <= 0) {
    const blastRadius = 100; 

    // Эффект взрыва
    ctx.fillStyle = "rgba(255, 165, 0, 0.7)";
    ctx.beginPath();
    ctx.arc(
        mine.x + mine.width/2, 
        mine.y + mine.height/2, 
        blastRadius, 0, Math.PI * 2
    );
    ctx.fill();

    
    enemies.forEach(enemy => {
        const dist = Math.sqrt(
            Math.pow(enemy.x + enemy.width/2 - (mine.x + mine.width/2), 2) +
            Math.pow(enemy.y + enemy.height/2 - (mine.y + mine.height/2), 2)
        );
        if (dist < blastRadius) {
            enemy.health -= 2;
            if (enemy.health <= 0) {
                enemies.splice(enemies.indexOf(enemy), 1);
                score += 15;
                updateScore();
            }
        }
    });

    player.mines.splice(i, 1);
}

        }
    }

    
    if (player.ability === "invincibility" && player.invincible) {
        player.color = player.color === 'yellow' ? 'white' : 'yellow';
        ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
        ctx.lineWidth = 3;
        ctx.strokeRect(player.x - 5, player.y - 5, player.width + 10, player.height + 10);
    } else {
        player.color = 'yellow';
    }

    
    if (player.ability === "doubleArmor" && player.hasShield) {
        ctx.strokeStyle = "rgba(0, 255, 0, 0.7)";
        ctx.lineWidth = 3;
        ctx.strokeRect(player.x - 5, player.y - 5, player.width + 10, player.height + 10);
    }

    
    if (player.ability === "chargeShot" && keys[' '] && canShoot) {
        ctx.fillStyle = "rgba(255, 165, 0, 0.3)";
        ctx.beginPath();
        ctx.arc(
            player.x + player.width/2,
            player.y + player.height/2,
            30, 0, Math.PI * 2
        );
        ctx.fill();
    }

    
    drawObject(player);

    
    enemies.forEach(drawObject);
    if (ally) drawObject(ally);

    // Движение объектов
    movePlayer();
    moveEnemies();
    //if (ally) moveAlly();//
    
    // Движение пуль
    moveBullets(player.bullets);
    enemies.forEach((enemy) => moveBullets(enemy.bullets));
    if (ally) moveBullets(ally.bullets);

    // Проверка столкновений
    checkCollisions();

    // Проверка на победу
    if (enemies.length === 0) {
        endGame('win');
    }

    // Отображение дополнительной информации
    if (player.ability === "doubleArmor") {
        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        ctx.fillText(`Броня: ${player.health.toFixed(1)}`, player.x, player.y - 10);
    }

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
    { 
        id: 1, 
        name: "Двойной выстрел", 
        cost: 100, 
        texture: textures.shopTank1,  // Используем текстуру из объекта
        ability: "doubleShot",
        health: 1
    },
    { 
        id: 2, 
        name: "Неуязвимость", 
        cost: 250, 
        texture: textures.shopTank2,
        ability: "invincibility",
        health: 1
    },
    { 
        id: 3, 
        name: "Квадро-выстрел", 
        cost: 350, 
        texture: textures.shopTank3,
        ability: "quadShot",
        health: 1
    },
    { 
        id: 4, 
        name: "Рикошет", 
        cost: 400, 
        texture: textures.shopTank4,
        ability: "ricochet",
        health: 1
    },
    { 
        id: 5, 
        name: "Мины", 
        cost: 500, 
        texture: textures.shopTank5,
        ability: "mineTrap",
        health: 1
    },
    { 
        id: 6, 
        name: "Двойная броня", 
        cost: 550, 
        texture: textures.shopTank6,
        ability: "doubleArmor",
        health: 2  // У этого танка 2 HP
    },
    { 
        id: 7, 
        name: "Заряженный выстрел", 
        cost: 600, 
        texture: textures.shopTank7,
        ability: "chargeShot",
        health: 1
    }
];


let selectedTank = "playerTank.png";

function renderShop() {
    const shopContainer = document.getElementById("shop-container");
    shopContainer.innerHTML = "";

    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.flexWrap = "wrap";
    row.style.justifyContent = "center";
    row.style.gap = "20px";

    shopTanks.forEach((tank) => {
        const tankDiv = document.createElement("div");
        tankDiv.className = "shop-item";
        tankDiv.style.width = "220px";

        // Canvas для изображения танка
        const canvas = document.createElement("canvas");
        canvas.width = 150;
        canvas.height = 150;
        canvas.style.margin = "0 auto";
        canvas.style.display = "block";
        canvas.style.border = "2px solid #444";
        canvas.style.borderRadius = "8px";

        const ctx = canvas.getContext("2d");
        if (tank.texture.complete && tank.texture.naturalWidth > 0) {
            ctx.drawImage(tank.texture, 0, 0, 150, 150);
        } else {
            ctx.fillStyle = "#333";
            ctx.fillRect(0, 0, 150, 150);
            ctx.fillStyle = "#fff";
            ctx.font = "16px Arial";
            ctx.textAlign = "center";
            ctx.fillText(tank.name, 75, 75);

            tank.texture.onload = () => {
                ctx.clearRect(0, 0, 150, 150);
                ctx.drawImage(tank.texture, 0, 0, 150, 150);
            };
            tank.texture.onerror = () => {
                ctx.fillStyle = "#555";
                ctx.fillRect(0, 0, 150, 150);
                ctx.fillStyle = "#fff";
                ctx.fillText("No Image", 75, 75);
            };
        }

        // Название и цена
        const name = document.createElement("h3");
        name.textContent = tank.name;
        name.style.textAlign = "center";
        name.style.margin = "10px 0 5px";

        const cost = document.createElement("p");
        cost.textContent = `Цена: ${tank.cost} очков`;
        cost.style.textAlign = "center";
        cost.style.margin = "5px 0";

        // Статус покупки
        const status = document.createElement("p");
        status.textContent = purchasedTanks.includes(tank.id) ? "✓ Куплено" : "";
        status.style.color = "#2ecc71";
        status.style.fontWeight = "bold";
        status.style.textAlign = "center";
        status.style.margin = "5px 0";

        // Кнопки
        const buttonsDiv = document.createElement("div");
        buttonsDiv.className = "shop-buttons";
        buttonsDiv.style.display = "flex";
        buttonsDiv.style.justifyContent = "center";
        buttonsDiv.style.gap = "10px";
        buttonsDiv.style.marginTop = "10px";

        const buyBtn = document.createElement("button");
        buyBtn.textContent = "Купить";
        buyBtn.disabled = purchasedTanks.includes(tank.id) || score < tank.cost;
        buyBtn.onclick = () => {
            buyTank(tank.id);
        };
        buyBtn.style.padding = "8px 15px";

        const selectBtn = document.createElement("button");
        selectBtn.textContent = "Выбрать";
        selectBtn.disabled = !purchasedTanks.includes(tank.id);
        selectBtn.onclick = () => {
            applyTank(tank.id);
            alert(`Танк "${tank.name}" выбран!`);
        };
        selectBtn.style.padding = "8px 15px";

        buttonsDiv.appendChild(buyBtn);
        buttonsDiv.appendChild(selectBtn);

        tankDiv.appendChild(canvas);
        tankDiv.appendChild(name);
        tankDiv.appendChild(cost);
        tankDiv.appendChild(status);
        tankDiv.appendChild(buttonsDiv);

        row.appendChild(tankDiv);
    });

    shopContainer.appendChild(row);
}


function buyTank(id) {
    const tank = shopTanks.find(t => t.id === id);
    if (!tank) {
        console.error("Танк не найден!");
        return;
    }
    
    // Проверяем, не куплен ли уже танк
    if (purchasedTanks.includes(id)) {
        alert("Этот танк уже куплен!");
        return;
    }
    
    // Проверяем хватает ли очков
    if (score >= tank.cost) {
        score -= tank.cost;
        purchasedTanks.push(id);
        updateScore();
        renderShop();
        alert(`Танк "${tank.name}" успешно куплен!`);
    } else {
        alert(`Не хватает ${tank.cost - score} очков для покупки!`);
    }
}


function applyTankAbilities() {
    // Сброс всех способностей
    player.invincible = false;
    player.color = 'yellow';
    clearInterval(player.invincibilityEffect);
    player.mines = [];
    player.hp = 1;

    // Применяем выбранную способность
    switch(player.ability) {
        case "invincibility":
            player.invincible = true;
            player.invincibilityEffect = setInterval(() => {
                player.color = player.color === 'yellow' ? 'white' : 'yellow';
            }, 200);
            setTimeout(() => {
                player.invincible = false;
                clearInterval(player.invincibilityEffect);
                player.color = 'yellow';
            }, 5000);
            break;
            
        case "mineTrap":
            player.mines = [];
            break;
            
        case "doubleArmor":
            player.hp = 2;
            break;
            
        case "chargeShot":
            // Логика в функции shoot
            break;
            
        case "ricochet":
            // Логика в moveBullets
            break;
    }
}

// ====== ЛУДИКИ ====== //
const ludikiButton = document.getElementById('ludiki-button');
const ludikiMode = document.getElementById('ludiki-mode');
const backFromLudiki = document.getElementById('back-from-ludiki');
const spinButton = document.getElementById('spin-button');
const betAmount = document.getElementById('bet-amount');
const resultDisplay = document.getElementById('result');

// Обработчики кнопок
ludikiButton.addEventListener('click', () => {
    menu.style.display = 'none';
    ludikiMode.style.display = 'block';
    resultDisplay.textContent = '';
});

backFromLudiki.addEventListener('click', () => {
    ludikiMode.style.display = 'none';
    menu.style.display = 'block';
});

spinButton.addEventListener('click', spinSlotMachine);

// Функция вращения автомата
function spinSlotMachine() {
    const bet = parseInt(betAmount.value);
    
    if (isNaN(bet)) {
        resultDisplay.textContent = "Введите число!";
        return;
    }
    
    if (bet < 10) {
        resultDisplay.textContent = "Минимальная ставка - 10 очков!";
        return;
    }
    
    if (bet > score) {
        resultDisplay.textContent = "Недостаточно очков!";
        return;
    }
    
    // Снимаем ставку
    score -= bet;
    updateScore();
    spinButton.disabled = true;
    resultDisplay.textContent = "Крутим...";
    
    // Анимация вращения
    const reels = document.querySelectorAll('.reel');
    const spins = [5, 8, 6]; // Количество оборотов для каждого барабана
    const spinDuration = 2000; // 2 секунды
    
    reels.forEach((reel, index) => {
        let spinsLeft = spins[index];
        const spinInterval = setInterval(() => {
            reel.textContent = fruits[Math.floor(Math.random() * fruits.length)];
            spinsLeft--;
            
            if (spinsLeft <= 0) {
                clearInterval(spinInterval);
                const finalFruit = fruits[Math.floor(Math.random() * fruits.length)];
                reel.textContent = finalFruit;
                
                if (index === reels.length - 1) {
                    setTimeout(() => checkResult(bet, reels), 500);
                }
            }
        }, spinDuration / spins[index]);
    });
}

// Проверка результата
function checkResult(bet, reels) {
    const values = Array.from(reels).map(reel => reel.textContent);
    let winAmount = 0;
    let message = "";
    
    // Очищаем canvas перед новым эффектом
    const fruitCanvas = document.getElementById('fruit-canvas');
    if (fruitCanvas) {
        const ctx = fruitCanvas.getContext('2d');
        ctx.clearRect(0, 0, fruitCanvas.width, fruitCanvas.height);
    }
    
    if (values[0] === values[1] && values[1] === values[2]) {
        switch(values[0]) {
            case '🍎': winAmount = bet * 2; break;
            case '🍌': winAmount = bet * 3; break;
            case '🍇': winAmount = bet * 5; break;
            case '🍊': winAmount = bet * 10; break;
            case '🍉': winAmount = bet * 20; break;
        }
        message = `ДЖЕКПОТ! ${values[0]} x3 = ${winAmount} очков!`;
        createFallingFruits();
    } else if (values[0] === values[1] || values[1] === values[2] || values[0] === values[2]) {
        winAmount = Math.floor(bet * 1.5);
        message = `Выигрыш! 2 одинаковых = ${winAmount} очков!`;
        createFallingFruits();
    } else {
        message = "Повезёт в следующий раз!";
    }
    
    if (winAmount > 0) {
      score += winAmount;
      updateScore();
      reels.forEach(reel => {
        reel.style.boxShadow = '0 0 20px gold';
        setTimeout(() => reel.style.boxShadow = 'none', 2000);
      });
    }
    
    resultDisplay.textContent = message;
    spinButton.disabled = false;
  }


// ====== Эффект падающих фруктов ====== //
let fallingFruits = [];
const fruitEmojis = ['🍎', '🍌', '🍇', '🍊', '🍉'];

function createFallingFruits() {
    // Очищаем предыдущие фрукты
    fallingFruits = [];
    
    // Получаем canvas и настраиваем его размер
    const fruitCanvas = document.getElementById('fruit-canvas');
    fruitCanvas.width = fruitCanvas.parentElement.clientWidth;
    fruitCanvas.height = fruitCanvas.parentElement.clientHeight;
    
    // Создаем 50 падающих фруктов
    for (let i = 0; i < 50; i++) {
        fallingFruits.push({
            x: Math.random() * fruitCanvas.width,
            y: -50 - Math.random() * 500, // Начинают выше экрана
            emoji: fruitEmojis[Math.floor(Math.random() * fruitEmojis.length)],
            speed: 2 + Math.random() * 5,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            size: 20 + Math.random() * 30
        });
    }
    
    // Запускаем анимацию
    animateFallingFruits();
}

function animateFallingFruits() {
    const fruitCanvas = document.getElementById('fruit-canvas');
    const ctx = fruitCanvas.getContext('2d');
    
    // Очищаем canvas
    ctx.clearRect(0, 0, fruitCanvas.width, fruitCanvas.height);
    
    // Обновляем и рисуем фрукты
    for (let i = fallingFruits.length - 1; i >= 0; i--) {
        const fruit = fallingFruits[i];
        
        // Обновляем позицию
        fruit.y += fruit.speed;
        fruit.rotation += fruit.rotationSpeed;
        
        // Если фрукт упал за пределы экрана, удаляем его
        if (fruit.y > fruitCanvas.height + 50) {
            fallingFruits.splice(i, 1);
            continue;
        }
        
        // Рисуем фрукт
        ctx.save();
        ctx.translate(fruit.x, fruit.y);
        ctx.rotate(fruit.rotation * Math.PI / 180);
        ctx.font = `${fruit.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(fruit.emoji, 0, 0);
        ctx.restore();
    }
    
    // Продолжаем анимацию, если есть фрукты
    if (fallingFruits.length > 0) {
        requestAnimationFrame(animateFallingFruits);
    } else {
        // Очищаем canvas, когда анимация завершена
        ctx.clearRect(0, 0, fruitCanvas.width, fruitCanvas.height);
    }
}
// ====== КОНЕЦ ЛУДИКИ ====== //


function applyTank(id) {
    const tank = shopTanks.find((t) => t.id === id);
    if (!tank || !purchasedTanks.includes(id)) return;

    currentTankAbility = tank.ability;
    player.ability = tank.ability;
    player.texture = tank.texture; // 👉 подменяем текстуру танка
    player.health = tank.health || 1; // 👉 обновляем здоровье танка (если нужно)

    // 👉 Настройка параметров для брони
    if (tank.ability === "doubleArmor") {
        player.shieldHealth = 2;
        player.hasShield = false;
    }

    applyTankAbilities();
    renderShop();

    alert(`Танк "${tank.name}" выбран! Применены способности: ${tank.ability || 'нет'}`);
}







function shoot(bullets, shooter, directionOverride = null) {
    if (shooter.health <= 0) return;
    if (shooter === player && !canShoot) return;

    const direction = directionOverride || shooter.direction;
    const isCharged = shooter === player && shooter.ability === "chargeShot" && keys[' '];

    const isPlayer = shooter === player;
    const isAlly = shooter === ally;

    const bulletConfig = {
        x: shooter.x + shooter.width / 2 - (isCharged ? 8 : 5),
        y: shooter.y + shooter.height / 2 - (isCharged ? 8 : 5),
        width: isCharged ? 16 : 10,
        height: isCharged ? 16 : 10,
        color: isCharged ? 'orange' : isPlayer ? 'gold' : isAlly ? 'green' : 'red',
        direction: direction,
        owner: isPlayer ? 'player' : isAlly ? 'ally' : 'enemy',
        ricochet: shooter.ability === "ricochet",
        speed: isCharged ? 3 : 5,
        power: isCharged ? 3 : 1,
        isCharged: isCharged
    };

    bullets.push({ ...bulletConfig });

    // Перезарядка и особые выстрелы только для игрока
    if (isPlayer) {
        canShoot = false;
        const reloadTime = isCharged ? 100 :
                           shooter.ability === "doubleShot" ? 300 :
                           shooter.ability === "quadShot" ? 50 : 50;

        setTimeout(() => canShoot = true, reloadTime);

        // Дополнительный выстрел для doubleShot
        if (shooter.ability === "doubleShot") {
            setTimeout(() => {
                bullets.push({ ...bulletConfig });
            }, 100);
        }

        // Выстрел во все стороны для quadShot
        if (shooter.ability === "quadShot") {
            ['up', 'down', 'left', 'right']
                .filter(dir => dir !== direction)
                .forEach(dir => {
                    bullets.push({
                        ...bulletConfig,
                        direction: dir
                    });
                });
        }
    }
}







window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ' && gameRunning && player.health > 0 && canShoot) {
        if (player.ability === "mineTrap") {
            // Ставим мину вместо выстрела
            player.mines = player.mines || [];
            player.mines.push({
                x: player.x + player.width/2 - 10,
                y: player.y + player.height/2 - 10,
                width: 20,
                height: 20,
                timer: 3000, // 3 секунды до взрыва
                damage: 2
            });
            canShoot = false;
            setTimeout(() => canShoot = true, 1000); // Перезарядка мин
        } else {
            // Обычный выстрел
            shoot(player.bullets, player);
        }
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
createFallingFruits 