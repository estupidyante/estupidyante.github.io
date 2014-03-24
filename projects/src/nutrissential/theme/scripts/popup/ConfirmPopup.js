/*=======================================================================
ConfirmPopup.js

ABS - CBN Entertainment - Promil Nutrissential Game HTML5 
Digital Brand Management
Harold Magbanua
07.23.2012
========================================================================*/
(function (window)
{
    ConfirmPopup.prototype = new Popup();
    function ConfirmPopup(popupState)
    {
        var THIS = this;
        THIS.super_initialize = ConfirmPopup.prototype.initialize; //unique to avoid overiding base class

        // public properties:
        THIS.popupState = null;
        
        //constructor:
        THIS.initialize = function ()
        {
            THIS.super_initialize();
            THIS.createBg();
            THIS.addTitle('confirmTitle');
            
            // proceed
            THIS.confirmYesButton = util.createButton('confirmYesButton');
            util.addChildAtPos(THIS, THIS.confirmYesButton, -80, 60);
            THIS.confirmYesButton.onClick = function (e)
            {
                THIS.popupState = popupState;
                THIS.parent.callbackParams = THIS.popupState;
                THIS.buttonClickHandler(e, this);
            };

            // confirm cancel
            THIS.confirmNoButton = util.createButton('confirmNoButton');
            util.addChildAtPos(THIS, THIS.confirmNoButton, 80, 60);
            THIS.confirmNoButton.onClick = function (e)
            {
                THIS.parent.callbackParams = false;
                THIS.buttonClickHandler(e, this);
            };
            
            THIS.showMe();
        }

        // public methods:
        THIS.initialize();

    }

    // REVEAL CLASS TO WINDOW
    window.ConfirmPopup = ConfirmPopup;
    
} (window));