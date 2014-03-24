/*=======================================================================
CreditScene.js

ABS - CBN Entertainment - Promil Nutrissential Game HTML5 
Digital Brand Management
Harold Magbanua
07.17.2012
========================================================================*/
(function (window)
{
    CreditScene.prototype = new Container();
    function CreditScene()
    {
        var THIS = this;
        THIS.super_initialize = CreditScene.prototype.initialize; //unique to avoid overiding base class

        // public properties:
        THIS.bg = null;
        THIS.logo = null;
        THIS.contentText = null;
        THIS.backButton = null;
        THIS.creditContent = new Container();

        //constructor:
        THIS.initialize = function ()
        {
            // trace("CreditScene.initialize..");
            THIS.super_initialize();
            THIS.placeGraphics();
        }

        // public methods:
        THIS.placeGraphics = function ()
        {
            util.toggleUI(false);
            bg = util.getAssetBitmap("gameBg");
            THIS.addChild(bg);

            THIS.creditContent.x = 0;
            THIS.creditContent.y = 0;
            THIS.addChild(THIS.creditContent);
            THIS.showCredit();
            
            backButton = util.createButton('backButton', true);
            util.addChildAtPos(THIS, backButton, -60, 420);
            backButton.onClick = function (e) { THIS.backButtonClicked() };
            Tween.get(backButton).wait(100).to({ x: 40 + 10, y: 420, scaleX: 1, scaleY: 1 }, 800, Ease.backOut);

        }

        THIS.showCredit = function ()
        {
            THIS.logo = util.getAssetBitmap('gameCreditLogo');
            THIS.logo.x = 250;
            THIS.logo.y = 550;
            THIS.creditContent.addChild(THIS.logo);

            THIS.contentText = new Text("", "12px Bowlby One SC", "#FFF");
            THIS.contentText.text = "This game is made possible by:\n\n\n";
            THIS.contentText.text += "Wyeth Philippines Inc.\n\n\n";
            THIS.contentText.text += "GAME DEVELOPMENT TEAM\n\n";
            THIS.contentText.text += "Digital Brand Management, ABS-CBN Corporation\n";
            THIS.contentText.text += "ABS-CBN Animation\n";
            THIS.contentText.text += "ABS-CBN Customer Development Group\n";
            THIS.contentText.text += "ABS-CBN Interactive\n\n\n";
            THIS.contentText.text += "MUSIC\n\n";
            THIS.contentText.text += "“Arriving at the Magic Glade”\n";
            THIS.contentText.text += "Music Composed by: Alstair Cameron\n";
            THIS.contentText.text += "www.cameronmusic.co.uk\n";
            THIS.contentText.text += "The music is licensed under a\n";
            THIS.contentText.text += "Creative Commons Attribution License.\n\n\n\n";
            THIS.contentText.text += "All the illustrations and interface designs\n";
            THIS.contentText.text += "shown in this game are the Intellectual property of\n";
            THIS.contentText.text += "ABS-CBN Corporation.\n\n\n";
            THIS.contentText.text += "Nutrissentials is copyrighted under Wyeth Philippines, Inc.\n\n\n";
            THIS.contentText.text += "Copyright © 2012 ABS-CBN Corporation All rights reserved.";

            THIS.contentText.lineWidth = 800;
            THIS.contentText.textBaseLine = "top";
            THIS.contentText.textAlign = "center";
            THIS.contentText.x = 400;
            THIS.contentText.y = 1000;

            THIS.creditContent.addChild(THIS.contentText);

            THIS.animateCredit();
            THIS.addChild(THIS.creditContent);
        }

        THIS.animateCredit = function ()
        {
            Tween.get(THIS.creditContent, {loop: true})
                .to({ y: -1500 }, 25000, Ease.linear)
                .wait(1000);
        }

        THIS.backButtonClicked = function ()
        {
            // trace('backButtonClicked...');
            $(document).trigger(util.GOTO_MENU);
            $('#viewporter').removeClass('ctrPointer').addClass('ctrCursor');
            Tween.removeTweens(THIS);
        
        }

        THIS.initialize();
    }

    // REVEAL CLASS TO WINDOW
    window.CreditScene = CreditScene;
    
} (window));