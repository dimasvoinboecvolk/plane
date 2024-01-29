class Main extends Phaser.Scene {

    // This function essentially loads things into our game
    preload() {
        this.load.spritesheet('plane', 'assets/planesheet.png', { frameWidth: 98, frameHeight: 83 });
        this.load.image('pipe', 'assets/pipe.png');
        this.load.audio('jump', 'assets/jump.wav');


    }

    //  it runs once at the beginning of the game and
    //  allows the user to place the things that they’ve preloaded with preload() and
    //  create objects within our game such as animations, collision detectors, text, groups, and much more
    create() {//Додаємо літак на сцену
        this.plane = this.physics.add.sprite(0, 0, 'plane')
        //Масштабуємо літак
        this.plane.setScale(0.65, 0.65);
        //Встановлюємо опорну точку літака
        this.plane.setOrigin(0, 0.1);
        //Створимо анімацію літака та налаштуємо для нього гравітацію:

        this.anims.create({
            key: "planeAnimation",
            frames: this.anims.generateFrameNumbers('plane', { frames: [0, 1, 3, 2] }),
            frameRate: 10,
            repeat: -1
        });
        this.plane.play("planeAnimation");

        this.plane.body.gravity.y = 500;
        // Обробка натискання клавіші “Пробіл”. Спочатку в методі create() створимо об’єкт даної кнопки:
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Створимо текстовий напис для рахунку (функція create()):
        this.score = 0;
        this.labelScore = this.add.text(20, 20, "0", { fontSize: 24, color: "green" });
        this.Author = this.add.text(5, 5, "DIMA KRUTOI SOZDATEL IGR", { fontSize: 20, color: "green" });
        //Створимо труби. Ідея полягає в тому, що кожна труба буде створюватись циклічно через кожні 1.5 секунди. Додаємо групу фізичних об’єктів та обробляємо циклічну подію:
        this.pipes = this.physics.add.group();
        //Обробимо зіткнення літака та труби. Спочатку в методі create() створимо зіткнення:
        this.physics.add.overlap(this.plane, this.pipes, this.hitPipe, null, this);

        this.timedEvent = this.time.addEvent({
            delay: 1500,
            callback: this.addRowOfPipes, //Цю функцію реалізуємо на наступному кроці
            callbackScope: this,
            loop: true
        });



    }

    // While preload() and create() run only once at the start of the game, update() runs constantly.
    update() {
        //В функції update() зробимо нахил літака на кут 20, а також перезапустимо гру, якщо літак вилетить за межі сцени:
        if (this.plane.angle < 20) {
            this.plane.angle += 1;
        }

        if (this.plane.y < 0 || this.plane.y > 800) {
            this.scene.restart();
        }
        //В методі update() зробимо перевірку “якщо натиснули на пробіл”:
        if (this.spaceBar.isDown) {
            this.jump();
        }

    }

    //І додамо окрему функцію-метод jump() до класу Main:
    jump() {
        this.tweens.add({
            targets: this.plane,
            angle: -20,
            duration: 100,
            repeat: 1
        });
        this.plane.body.velocity.y = -350;
    }
    //Додамо окремі функції-методи для створення труб:
    //Функція для створення блоку труби
    addOnePipe(x, y) {
        var pipe = this.physics.add.sprite(x, y, 'pipe');
        pipe.setOrigin(0, 0);
        this.pipes.add(pipe);
        pipe.body.velocity.x = -300;

        pipe.collideWorldBounds = true;
        pipe.outOfBoundsKill = true;
    }
    //Функція створення труби (стовпчик блоків)
    addRowOfPipes() {
        var hole = Math.floor(Math.random() * 5) + 1;
        this.score += 1;
        this.labelScore.text = this.score;
        for (var i = 0; i < 13; i++) {
            if (!(i >= hole && i <= hole + 2))
                this.addOnePipe(800, i * 60 + 10);
        }
    }

    hitPipe() {
        if (this.plane.alive == false) return;

        this.timedEvent.remove(false);
        this.plane.alive = false;

        this.pipes.children.each(function (pipe) {
            pipe.body.velocity.x = 0;
        });
    }

}






//Створимо файл game.js, задамо для нашої гри конфігурацію та створимо новий об’єкт Гри з конфігурацією нашої сцени:
const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 800,
    scene: Main, // Цю сцену ми створимо на 4-му кроці
    backgroundColor: '#ff1657',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    }
};

const game = new Phaser.Game(config);