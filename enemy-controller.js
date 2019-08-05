class EnemyController {
    constructor(game, columns = 10) {
        this.game = game;
        this.enemies = [];
        this.columns = [...Array(columns)].map(u => ([]));
        this.enemyGroup = this.game.physics.add.group();

    }

    addEnemies(amount = 1) {
        let col = 0;
        for (let i = 0; i < amount; i++) {
            let colObj = this.columns[col];
            let row = colObj.length;
            let x = 50 + col * 50;
            let y = 50 + row * 50;

            //const enemy = new Enemy(this.scene.scene, x, y, 'enemy');
            const enemy = this.enemyGroup.create(x, y, 'enemy');
            colObj.push(enemy);
            this.enemies.push(enemy);
            enemy.setTintFill(0xff0000);
            console.log(enemy)
            col++;
            col = col % this.columns.length;
            
        }
        
    }

    addEnemiesRow(amount = 1) {
        this.addEnemies(this.columns.length * amount);
        console.log(this);
        
    }
}