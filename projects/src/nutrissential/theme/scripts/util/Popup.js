/*==============================================================================
Popup.js

ABS - CBN Entertainment - Promil Nutrissential Game HTML5 
Digital Brand Management
Harold Magbanua
07.17.2012
==============================================================================*/
(function (window) 
{
    // method for popup windows
    function Popup()
    {
        this.initialize();
    }

    Popup.prototype = new Container();

    // public properties:
    Popup.prototype.xButton = null;
    Popup.prototype.shareButton = null;
    Popup.prototype.okButton = null;
    Popup.prototype.gotoMenuButton = null;
    Popup.prototype.restartGameButton = null;
    Popup.prototype.gotoTutorialButton = null;
    Popup.prototype.lowButtons = null;

    Popup.prototype.worldId = null;
    Popup.prototype.popupState = null;
    Popup.prototype.resume = true;

    Popup.prototype.menuGameButton = null;
    Popup.prototype.restartGameButton = null;
    Popup.prototype.gotoTutorialButton = null;

    // constructor:
    Popup.prototype.Container_initialize = Popup.prototype.initialize; //unique to avoid overiding base class

    Popup.prototype.initialize = function ()
    {
        this.Container_initialize();
        this.lowButtons = [];
        this.scaleX = 0.1;
        this.scaleY = 0.1;
    }

    // public methods:
    Popup.prototype.showMe = function ()
    {
        $('#viewporter').removeClass().addClass('ctrCursor');
        Tween.get(this).to({ scaleX: 1, scaleY: 1 }, 600, Ease.backOut).wait(150).call(this.showTweenComplete);
    }

    Popup.prototype.showTweenComplete = function ()
    {
        //to be overriden
    }

    Popup.prototype.createBg = function ()
    {
        this.x = util.pW(50);
        this.y = util.pH(50);
        var bg = util.getAssetBitmap('popupBase', true);
        this.addChildAt(bg, 0);
    }

    Popup.prototype.createPlainBg = function ()
    {
        this.x = util.pW(50);
        this.y = util.pH(50);
        var bg = util.getAssetBitmap('popupPlainBase', true);
        this.addChildAt(bg, 0);
    }

    Popup.prototype.createDescBg = function ()
    {
        this.x = util.pW(50);
        this.y = util.pH(50);
        var bg = util.getAssetBitmap('popupDescBase', true);
        this.addChildAt(bg, 0);
    }

    Popup.prototype.addTitle = function (assetType)
    {
        var title = util.getAssetBitmap(assetType, true);
        util.addChildAtPos(this, title, 40, -30);
    }

    Popup.prototype.addAllTitle = function (assetType)
    {
        var title = util.getAssetBitmap(assetType, true);
        util.addChildAtPos(this, title, 0, -60);
    }

    Popup.prototype.addGOTitle = function (assetType)
    {
        var title = util.getAssetBitmap(assetType, true);
        util.addChildAtPos(this, title, 40, -55);
    }

    Popup.prototype.addEndTitle = function (assetType)
    {
        var title = util.getAssetBitmap(assetType, true);
        util.addChildAtPos(this, title, 0, -120);
    }


    Popup.prototype.createCloseButton = function ()
    {
        var THIS = this;
        THIS.xButton = util.createButton('xButton', true);
        util.addChildAtPos(this, this.xButton, 155, -95);
        this.xButton.onClick = function (e) { THIS.buttonClickHandler(e, this) };
    }

    Popup.prototype.createShareButton = function ()
    {
        var THIS = this;
        this.shareButton = util.createButton("shareButton", true);
        this.shareButton.name = 'shareButton';
        this.shareButton.visible = false;
        this.lowButtons.push(this.shareButton);
    }

    Popup.prototype.createOkButton = function (assetType)
    {
        this.okButton = util.createButton(assetType, true);
        this.okButton.name = assetType;
        this.lowButtons.push(this.okButton);
    }

    Popup.prototype.createGotoMenuButton = function ()
    {
        this.gotoWorldButton = util.createButton('gotoMenuButton', true);
        this.gotoWorldButton.name = 'gotoMenuButton';
        this.lowButtons.push(this.gotoWorldButton);
    }

    Popup.prototype.placeButtons = function ()
    {
        var THIS = this;
        var btn;
        var xCounter = 0;
        for (var i = 0; i < this.lowButtons.length; i++)
        {
            btn = this.lowButtons[i];
            btn.y = 170;
            btn.x = 340 - xCounter - util.getAssetW(btn.name) / 2
            xCounter += 10 + util.getAssetW(btn.name);
            btn.onClick = function (e) { THIS.buttonClickHandler(e, this) };
            this.addChild(btn);
        }
    }

    Popup.prototype.buttonClickHandler = function (e, target)
    {
        switch (target)
        {
            case this.xButton:
            case this.okButton:
                this.parent.callbackParams = false;
                this.closeMe();
                break;
            case this.shareButton:
                // trace('share button clicked');
                break;
            case this.menuGameButton:
            case this.restartGameButton:
            case this.gotoTutorialButton:
                this.parent.callbackParams = this.popupState;
                this.parent.viewPopupCallback = ngMain.statePopupCallback;
                this.closeMe();
                break;
            case this.confirmNoButton:
                this.parent.callbackParams = false;
                this.parent.viewPopupCallback = ngMain.confirmClosedCallback;
                this.closeMe();
                break;
            case this.restartOverButton:
                this.parent.callbackParams = this.worldId;
                this.parent.viewPopupCallback = ngMain.gotoGamePopupCallback;
                this.closeMe();
                break;
            case this.tutorialOverButton:
                this.parent.callbackParams = this.worldId;
                this.parent.viewPopupCallback = ngMain.gotoTutorialHandler;
                this.closeMe();
                break;
            case this.confirmYesButton:
                this.parent.callbackParams = this.popupState;
                this.parent.viewPopupCallback = ngMain.confirmYesPopupCallback;
                this.closeMe();
                break;
            case this.returnToGameButton:
                this.parent.callbackParams = this.resume;
                this.parent.viewPopupCallback = ngMain.resumeGamePopupCallback;
                this.closeMe();
                break;

        }
    }

    Popup.prototype.closeMe = function ()
    {
        $('#viewporter').removeClass().addClass('ctrCursor');
        this.parent.closePopup();
    }

    // enable buttons
    Popup.prototype.enableButtons = function (isEnabled)
    {
        for (var i = 0; i < this.lowButtons.length; i++)
        {
            this.lowButtons[i].setEnabled(isEnabled);
        }
        this.xButton.setEnabled(isEnabled);
    }

    // REVEAL CLASS TO WINDOW
    window.Popup = Popup;
    
} (window));