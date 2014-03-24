/*=======================================================================
IconSprite.js

ABS - CBN Entertainment - Promil Nutrissential Game HTML5 
Digital Brand Management
Harold Magbanua
07.19.2012
========================================================================*/
(function (window)
{

    // type = [loading, avatar, icon, piece]
    // itemData = ["spritesheet", ""] if not a spritesheet data, just leave it blank
    // itemCount = amount of item
    // itemImage = image source
    function IconSprite(type, isTarget, itemData, itemCount, itemImage)
    {
        this.initialize(type, isTarget, itemData, itemCount, itemImage);
    }
    IconSprite.prototype = new Container();

    // public properties:
    IconSprite.prototype.iconBody = null;
    IconSprite.prototype.type = null;
    IconSprite.prototype.isEnabled = true;
    // constructor:
    IconSprite.prototype.Container_initialize = IconSprite.prototype.initialize; //unique to avoid overiding base class

    IconSprite.prototype.initialize = function (type, isTarget, itemData, itemCount, itemImage)
    {
        this.Container_initialize();

        this.type = type;
        this.iconBody = new Container();
        IconSprite.prototype.bgBitmap = null;
        this.addChild(this.iconBody);
        this.velX = 0;
        this.velY = 0;
        this.velR = 0;
        this.isTarget = isTarget;
        this.itemData = itemData;
        this.itemCount = itemCount;
        this.itemImage = itemImage;

        this.initGraphics();
    }

    // public methods:
    IconSprite.prototype.initGraphics = function ()
    {
        var bitmap;
        if (this.isTarget)
        {
            // id: itemID  
            // stack: number of items
            // score: score of items when clicked
            // points: x, y - position
            bmp = this.itemSprite;
        }
        
        if (this.type == "initLoadingBitmap")
        {
            var gamePieces = new SpriteSheet(this.itemData);
            var img = SpriteSheetUtils.extractFrame(gamePieces, this.itemCount);
            var bmp = new Bitmap(img);
        }
        else if (this.type == "itemIcon")
        {
            bmp = this.itemSprite;
        }

        this.iconBody.addChild(bmp);

    }

    IconSprite.prototype.explode = function ()
    {
        this.killBonus();
        this.velX = (Math.random() * 120 - 60) * this.scaleX;
        this.velY = (Math.random() * -80 - 40) * this.scaleX;
        this.velR = Math.random() * 30 - 15;
    }

    IconSprite.prototype.updateExplode = function ()
    {
        this.velX *= 0.98;
        this.velY += 8 * this.scaleX;
        this.x += this.velX;
        this.y += this.velY;
        this.rotation += this.velR;
    }

    IconSprite.prototype.killBonus = function ()
    {
        this.bonusType = "";
        if (this.bonusHolder)
        {
            Tween.removeTweens(this.bonusHolder);
            this.bonusHolder.visible = false;
        }
        this.bonusHolder = null;
    }

    IconSprite.prototype.doGoodTween = function (totalTime)
    {
        var cur = this.iconBody.y;
        var dir = Math.random() > 0.5 ? 1 : -1
        Tween.get(this.iconBody).to({ rotation: 45, y: cur + dir * 150, scaleX: 1.2, scaleY: 1.2 }, totalTime * 0.6, Ease.sineOut).to({ rotation: 0, y: cur, scaleX: 0.5, scaleY: 0.5 }, totalTime * 0.4, Ease.sineIn);
    }

    window.IconSprite = IconSprite;
} (window));