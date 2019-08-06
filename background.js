class Background {
    constructor(game) {
        this.game = game;
        this.stars = [];
        this.starsGroup = this.game.add.group();
        // add som random stars

        this.bgTimer = this.game.scene.scene.time.addEvent({
            delay: 500,
            callback: this.update,
            callbackScope: this,
            loop: true,
        });

        
        for (let i = 0; i < 20; i++) {
            this.spawnRandomStar(false);
        }
    }

    update() {
        //check stars if outof bounds y
        //randomly summon star

        this.stars.forEach(star => {
            star.update();
            if(checkOutOfBounds(star.body, ['bottom'])) {
                this.removeStar(star);
                // console.log('star removed');
                
            }
        });

        if (true) {
            //spawn star
            this.spawnRandomStar();
        }
    }

    removeStar(star) {
        const index = this.stars.indexOf(star);
        this.stars.splice(index, 1);
        this.starsGroup.remove(star.circle.body, true, true);
    }

    spawnRandomStar(fromStart = true) {
        const bounds = this.game.physics.world.bounds;
        const x = Math.random() * bounds.width;
        let y;
        if (fromStart) {
            y = 0;
        } else {
            y = Math.random() * bounds.height;
            
        }

        const z = Math.random() * 3 + 1;
        const star = new BackgroundStar(this.game, x, y, z);
        this.stars.push(star);
        this.starsGroup.add(star.circle);
    }
}

class BackgroundStar {
    constructor(game, x, y, z) {
        this.game = game;
        const r = 1.6 / z;
        const circle = this.game.add.circle(x, y - r / 2, r, 0xffffff);
        this.game.physics.add.existing(circle);
        this.circle = circle;
        circle.body.velocity.y = r * 50;
        // console.log(circle);
        
    }

    update() {
        const b = this.circle.body;
        if (checkOutOfBounds(b, ['bottom'])) {
            // remove star
        }
    }

}