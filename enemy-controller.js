class EnemyController {
    constructor(game, columns = 10) {
        this.game = game;
        this.enemies = [];
        this.columns = [...Array(columns)].map(u => ([]));
        this.enemyGroup = this.game.physics.add.group();
        // distance between enemies
        this.enemyDistance = 50;
        this.xSpaces = (this.game.physics.world.bounds.width / this.enemyDistance) - 2;
        this.currentXSpace = 0;
        this.totalEnemies = 0;

        this.movingDirection = 'right';

        this.moveTimer = this.game.scene.scene.time.addEvent({
            delay: 1000,
            callback: this.moveEnemies,
            callbackScope: this,
            loop: true,
        });

    }

    addEnemies(amount = 1) {
        let col = 0;
        for (let i = 0; i < amount; i++) {
            let colObj = this.columns[col];
            let row = colObj.length;
            let x = this.enemyDistance + col * this.enemyDistance;
            let y = this.enemyDistance + row * this.enemyDistance;

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
        const index = Math.floor(Math.random() * this.enemies.length);
        const enemy = this.enemies[index];
        
    }
}