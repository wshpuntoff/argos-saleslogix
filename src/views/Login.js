/// <reference path="../../../../argos-sdk/libraries/ext/ext-core-debug.js"/>
/// <reference path="../../../../argos-sdk/libraries/sdata/sdata-client-debug"/>
/// <reference path="../../../../argos-sdk/libraries/Simplate.js"/>
/// <reference path="../../../../argos-sdk/src/View.js"/>
/// <reference path="../../../../argos-sdk/src/Edit.js"/>

Ext.namespace("Mobile.SalesLogix.Login");

Mobile.SalesLogix.Login = Ext.extend(Sage.Platform.Mobile.Edit, {
    //Templates
    viewTemplate: new Simplate([
        '<div id="{%= $.id %}" title="{%: $.title %}" class="panel {%= $.cls %}" hideBackButton="true">',        
        '<div class="panel-content"></div>',
        '<button class="button actionButton" data-action="authenticate"><span>{%: $.logOnText %}</span></button>',
        '</div>'
    ]),

    //Localization
    id: 'login',
    busy: false,
    logOnText: 'Log On',
    passText: 'pass',
    rememberText: 'remember',
    titleText: 'Login',
    userText: 'user',
    invalidUserText: 'The user name or password is invalid.',
    missingUserText: 'The user record was not found.',
    serverProblemText: 'A problem occured on the server.',
    requestAbortedText: 'The request was aborted.',

    init: function() {
        Mobile.SalesLogix.Login.superclass.init.apply(this, arguments);

        this.tools = {
            bbar: false,
            tbar: false
        };
    },
    getContext: function() {
        return {id: this.id};
    },
    createLayout: function() {
        return this.layout || (this.layout = [
            {
                name: 'username',
                label: this.userText,
                type: 'text'
            },
            {
                name: 'password',
                label: this.passText,
                type: 'text',
                mask: true
            },
            {
                name: 'remember',
                label: this.rememberText,
                type: 'boolean'
            }
        ]);
    },
    authenticate: function () {        
        if (this.busy) return;

        var credentials = this.getValues();

        this.validateCredentials(credentials);
    },           
    validateCredentials: function (credentials) {
        this.disable();

        App.authenticateUser(credentials, {
            success: function(result) {
                this.enable();
                
                App.navigateToInitialView();
            },
            failure: function(result) {
                this.enable();

                if (result.response)
                {
                    if (result.response.status == 403)
                        alert(this.invalidUserText);
                    else
                        alert(this.serverProblemText);
                }
                else
                {
                    alert(this.missingUserText);
                }
            },
            aborted: function(result) {
                this.enable();
                
                alert(this.requestAbortedText);
            },
            scope: this
        });
    }
});