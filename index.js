let playerPos;
let projectiles;
let player;
let cursors;
let enemyController;

function preload() {
    this.load.image('rocket', 'img/rocket.png');
    this.load.image('enemy', 'img/enemy.png');
}

function create() {
    this.physics.world.setBoundsCollision(true, true, true, true);
    const playerX = this.physics.world.bounds.width / 2;
    console.log(playerX);
    playerPos = {
        x: playerX,
        y: 550,
    }
    projectiles = this.add.group();
    
    player = this.physics.add.image(playerPos.x, playerPos.y, 'rocket');
    player.setCollideWorldBounds(true);
    const spaceKey = this.input.keyboard.addKey('space');
    spaceKey.on('down', (evt) => {
        shoot.call(this);
    });
    cursors = this.input.keyboard.createCursorKeys();

    enemyController = new EnemyController(this, 10);
    enemyController.addEnemiesRow(4);

    this.physics.add.collider(projectiles, enemyController.enemyGroup, killEnemy, null, this);

    //this.cameras.main.setBackgroundColor('#ff00ff');
}

function killEnemy(projectile, enemy) {
    // console.log('kill enemy', projectile, enemy);

    enemyController.removeEnemy(enemy);
    
    projectiles.remove(projectile, true, true);
    enemyController.enemyGroup.remove(enemy, true, true);
}

function shoot() {
    // console.log(this);
    
    const circle = this.add.circle(playerPos.x, playerPos.y, 2, 0x00ff00);
    circle.setStrokeStyle(0);

    this.physics.add.existing(circle);
    projectiles.add(circle);
    circle.body.velocity.y = -400;
}

function update() {
    // console.log(projectiles.children);
    projectiles.children.iterate(projectile => {
        if (!projectile) {
            return;
        }
        
        if (projectile.body.bottom < 0 || projectile.body.right < 0||
            projectile.body.left > this.physics.world.bounds.width || projectile.body.top > this.physics.world.bounds.height) {
            // console.log('destroying projectile');
            // projectile.destroy();
            projectiles.remove(projectile, true, true);
        }
    });

    playerPos.x = player.x;
    playerPos.y = player.y;


    if (cursors.left.isDown) {
        player.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
    } else {
        player.setVelocityX(0);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: 0
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

const game = new Phaser.Game(config);