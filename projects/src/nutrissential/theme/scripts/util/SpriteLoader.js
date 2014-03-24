/*===============================================================
SpriteLoader.js

ABS - CBN Entertainment - Promil Nutrissential Game HTML5 
Digital Brand Management
Harold Magbanua
07.18.2012
===============================================================*/
(function (window){

    var instance;
    var spriteImage;
    var spriteSheet;
    var atlasData = {};
    var imageURL = null;
    var bmp = null;

    // TOP LEVEL CLASS
    var SpriteLoader = function(data)
    {
        this.initialize(data);
    }

    // PROTOTYPE INHERITANCE // REQUIRED
    SpriteLoader.prototype = new Container();
    SpriteLoader.prototype.Container_initialize = SpriteLoader.prototype.initialize;
    SpriteLoader.prototype.Container_tick = SpriteLoader.prototype._tick;

    // REGISTER EVENT CALLBACKS
    //-- ex. SpriteLoader.prototype.onLoad = null;--

    // PUBLIC METHODS
    SpriteLoader.prototype.initialize = function(data)
    {
        instance = this;
        
        // REQUIRED
        this.Container_initialize();

    }

    SpriteLoader.prototype.onLoadSpriteData = function(data)
    {
        // trace('JSON loaded..');
        var spriteFrames = [];
        var spriteAnims = {};

        for (var frame in data.frames)
        {
            var frameName = frame.slice(0, frame.indexOf(".png"));
            var frameNumber = spriteFrames.length;
            var frameData = [];

            frameData.push(data.frames[frame].frame.x);
            frameData.push(data.frames[frame].frame.y);
            frameData.push(data.frames[frame].frame.w);
            frameData.push(data.frames[frame].frame.h);

            spriteFrames.push(frameData);
            spriteAnims[frameName] = [frameNumber];
        }

        atlasData.frames = spriteFrames;
        atlasData.animations = spriteAnims;
    }

    SpriteLoader.prototype.loadSpriteImage = function(imageUrl)
    {
        spriteImage = new Image();
        spriteImage.onload = onLoadSpriteImage;
        spriteImage.src = imageUrl;
    }

    var onLoadSpriteImage = function()
    {
        // trace('image loaded..');
        atlasData.images = [spriteImage];
        spriteSheet = new SpriteSheet(atlasData);
        return spriteSheet;
    }

    SpriteLoader.prototype.frame = function(frameName)
    {
        var bmp = new Bitmap(SpriteSheetUtils.extractFrame(spriteSheet, frameName));
        return bmp;
    }
    
    SpriteLoader.prototype._tick = function()
    {
        this.Container_tick();
    }

    // REVEAL CLASS TO WINDOW
    window.SpriteLoader = SpriteLoader;

})(window);