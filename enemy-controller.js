class EnemyController {
    constructor(game, columns = 10) {
        this.game = game;
        this.enemies = [];
        this.columns = [...Array(columns)].map(u => ([]));
        this.enemyGroup = this.game.physics.add.group();
        this.enemyProjectiles = this.game.physics.add.group();
        // this.xSpaces = (this.game.physics.world.bounds.width / this.enemyDistance) - 2;
        this.padding = 50;
        this.xSpaces = 15;
        this.enemyRadius = 16;
        // distance between enemies
        this.enemyDistance = (this.game.physics.world.bounds.width - (2 * this.padding)) / this.xSpaces;
        
        this.currentXSpace = (this.xSpaces - this.columns.length) / 2;
        this.totalEnemies = 0;

        this.movingDirection = 'right';

        this.moveTimer = this.game.scene.scene.time.addEvent({
            delay: 1000,
            callback: this.moveEnemies,
            callbackScope: this,
            loop: true,
        });

        this.shootTimer = this.game.scene.scene.time.addEvent({
            delay: 1250,
            callback: this.shootFromRandom,
            callbackScope: this,
            loop: true,
        });

    }

    update() {
        this.enemyProjectiles.children.iterate(projectile => {
            if (!projectile) {
                return;
            }
            
            if (checkOutOfBounds(projectile.body, ['bottom'])) {
                this.enemyProjectiles.remove(projectile, true, true);
            }
        })
    }

    addEnemies(amount = 1) {
        let col = 0;
        for (let i = 0; i < amount; i++) {
            let colObj = this.columns[col];
            let row = colObj.length;
            let x = this.padding + this.enemyRadius + col * this.enemyDistance + this.currentXSpace * this.enemyDistance;
            let y = this.padding + row * this.enemyDistance;

            //const enemy = new Enemy(this.scene.scene, x, y, 'enemy');
            const enemy = this.enemyGroup.create(x, y, 'enemy');
            colObj.push(enemy);
            this.enemies.push(enemy);
            enemy.setTintFill(0xff0000);
            //console.log(enemy)
            col++;
            col = col % this.columns.length;
            this.totalEnemies++;
        }
    }

    addEnemiesRow(amount = 1) {
        this.addEnemies(this.columns.length * amount);
        // console.log(this);
        
    }

    moveEnemies() {
        const isAtRightBound = this.currentXSpace >= this.xSpaces - this.columns.length;
        const isAtLeftBound = this.currentXSpace <= 0;
        // console.log(`left: ${isAtLeftBound} right: ${isAtRightBound}`);
        
        if (this.movingDirection === 'right' && !isAtRightBound) {
            // move rigth
            this.moveEnemiesX('right');
        } else if (this.movingDirection === 'right' && isAtRightBound) {
            // move down
            this.moveEnemiesDown();
            this.movingDirection = 'left';
        } else if (this.movingDirection === 'left' && !isAtLeftBound) {
            //move left
            this.moveEnemiesX('left');
        } else if (this.movingDirection === 'left' && isAtLeftBound) {
            //move down
            this.moveEnemiesDown();
            this.movingDirection = 'right';
        }
    }

    moveEnemiesDown() {
        this.enemies.forEach(enemy => {
            const cy = enemy.y;
            enemy.setY(cy + this.enemyDistance);
        });
    }

    moveEnemiesX(direction = 'right') {
        const multipler = direction === 'right' ? 1 : -1;
        this.currentXSpace += multipler;
        this.enemies.forEach(enemy => {
            const cx = enemy.x;
            enemy.setX(cx + (this.enemyDistance * multipler));
        });
    }

    removeEnemy(enemy) {
        const index = this.enemies.indexOf(enemy);
        this.enemies.splice(index, 1);
        for (let i = 0; i < this.columns.length; i++) {
            const col = this.columns[i];
            const index2 = col.indexOf(enemy);
            if (index2 !== -1) {
                col.splice(index2, 1);
                break;
            }
        }
        this.checkColumns();
        this.setMoveLevel();
    }

    setMoveLevel() {
        const l = this.enemies.length;
        const t = this.totalEnemies;
        const mt = this.moveTimer;
        if (l >= t * 3 / 4) {
            // level 1
            mt.timeScale = 1;
        } else if (l >= t / 2) {
            // level 2
            mt.timeScale = 1.75;
        } else if (l >= t / 4) {
            // level 3
            mt.timeScale = 2.5;
        } else if (l > 1) {
            // level 4
            mt.timeScale = 3.25;
        } else if (l === 1) {
            // level 5
            mt.timeScale = 5;
        }
    }

    checkColumns() {
        //check first col
        //check last col

        if (this.columns.length <= 0) {
            return;
        }

        let removed = false;

        if (this.columns[0].length <= 0) {
            //remove col
            // add one to current x space
            this.columns.splice(0, 1);
            this.currentXSpace++;
            removed = true;
        } else if (this.columns[this.columns.length - 1].length <= 0) {
            this.columns.splice(this.columns.length - 1, 1);
            removed = true;
        }

        if (removed) {
            this.checkColumns();
        }
    }

    shootFromRandom() {
        if (this.enemies.length <= 0) {
            return;
        }
        const index = Math.floor(Math.random() * this.enemies.length);
        const enemy = this.enemies[index];

        const circle = this.game.add.circle(enemy.x, enemy.y, 2, 0xff0000);
        this.game.physics.add.existing(circle);
        this.enemyProjectiles.add(circle);
        circle.body.velocity.y = 150;
        // console.log('shooting');
        
    }
}