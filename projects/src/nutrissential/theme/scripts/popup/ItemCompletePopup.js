/*=======================================================================
ItemCompletePopup.js

ABS - CBN Entertainment - Promil Nutrissential Game HTML5 
Digital Brand Management
Harold Magbanua
07.24.2012
========================================================================*/
(function (window)
{
    ItemCompletePopup.prototype = new Popup();
    function ItemCompletePopup(name, avatar, desc)
    {
        var THIS = this;
        THIS.super_initialize = ItemCompletePopup.prototype.initialize; //unique to avoid overiding base class

        // public properties:
        THIS.sprite = new SpriteLoader();
        THIS.avatar = null;

        //constructor:
        THIS.initialize = function ()
        {
            THIS.super_initialize();
            THIS.createDescBg();
            THIS.createCloseButton();
            
            // item avatar
            THIS.avatar = THIS.sprite.frame(avatar);
            THIS.avatar.x = -250;
            THIS.avatar.y = -60;
            THIS.addChild(THIS.avatar);

            // item name:
            if ( name == "wheatbread") name = "wheat bread";
            var strokes = [{ color: "#ffd706" }, { color: "#de4400", lineWidth: 5 }, { color: "#ffffff", lineWidth: 10}];
            THIS.scoreText = new TextStroke(name, "42px Bowlby One SC", strokes, "center");
            THIS.scoreText.x = 30;
            THIS.scoreText.y = -68;
            THIS.addChild(THIS.scoreText);

            // item description
            THIS.itemDesc = new Text("", "10px Bowlby One SC", "#000");
            THIS.itemDesc.text = desc;
            THIS.itemDesc.lineWidth = 210;
            THIS.itemDesc.x = -45;
            THIS.itemDesc.y = 32;
            THIS.addChild(THIS.itemDesc);
            
            THIS.showMe();
        }

        // public methods:
        THIS.initialize();
    }

    // REVEAL CLASS TO WINDOW
    window.ItemCompletePopup = ItemCompletePopup;

} (window));