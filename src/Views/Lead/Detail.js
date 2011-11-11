/// <reference path="../../../../../argos-sdk/libraries/ext/ext-core-debug.js"/>
/// <reference path="../../../../../argos-sdk/libraries/sdata/sdata-client-debug"/>
/// <reference path="../../../../../argos-sdk/libraries/Simplate.js"/>
/// <reference path="../../../../../argos-sdk/src/View.js"/>
/// <reference path="../../../../../argos-sdk/src/Detail.js"/>

define('Mobile/SalesLogix/Views/Lead/Detail', ['Sage/Platform/Mobile/Detail'], function() {

    return dojo.declare('Mobile.SalesLogix.Views.Lead.Detail', [Sage.Platform.Mobile.Detail], {
        //Localization
        activityTypeText: {
            'atPhoneCall': 'Phone Call',
            'atEMail': 'E-mail'
        },
        accountText: 'company',
        addressText: 'address',
        businessDescriptionText: 'bus desc',
        createDateText: 'create date',
        createUserText: 'create user',
        eMailText: 'email',
        leadSourceText: 'lead source',
        industryText: 'industry',
        interestsText: 'interests',
        leadTitleText: 'title',
        nameText: 'name',
        notesText: 'comments',
        ownerText: 'owner',
        relatedActivitiesText: 'Activities',
        relatedHistoriesText: 'Notes/History',
        relatedItemsText: 'Related Items',
        relatedNotesText: 'Notes',
        sicCodeText: 'sic code',
        titleText: 'Lead',
        tollFreeText: 'toll free',
        webText: 'web',
        workText: 'phone',
        actionsText: 'Quick Actions',
        callWorkNumberText: 'Call main number',
        scheduleActivityText: 'Schedule activity',
        addNoteText: 'Add note',
        sendEmailText: 'Send email',
        viewAddressText: 'View address',
        moreDetailsText: 'More Details',
        calledText: 'Called ${0}',
        emailedText: 'Emailed ${0}',

        //View Properties
        id: 'lead_detail',
        editView: 'lead_edit',
        historyEditView: 'history_edit',
        noteEditView: 'history_edit',
        security: 'Entities/Lead/View',
        querySelect: [
            'Address/*',
            'BusinessDescription',
            'Company',
            'CreateDate',
            'CreateUser',
            'Email',
            'FirstName',
            'FullAddress',
            'Industry',
            'Interests',
            'LastName',
            'LeadNameLastFirst',
            'LeadSource/Description',
            'MiddleName',
            'Notes',
            'Owner/OwnerDescription',
            'Prefix',
            'SICCode',
            'Suffix',
            'Title',
            'TollFree',
            'WebAddress',
            'WorkPhone'
        ],
        resourceKind: 'leads',
        
        navigateToHistoryInsert: function(type, entry, complete) {
            var view = App.getView(this.historyEditView);
            if (view)
            {
                this.refreshRequired = true;
                
                view.show({
                    title: this.activityTypeText[type],
                    template: {},
                    entry: entry,
                    insert: true
                }, {
                    complete: complete
                });
            }
        },
        recordCallToHistory: function(complete) {
            var entry = {
                '$name': 'History',
                'Type': 'atPhoneCall',
                'AccountName': this.entry['Company'],
                'LeadId': this.entry['$key'],
                'LeadName': this.entry['LeadNameLastFirst'],
                'Description': dojo.string.substitute(this.calledText, [this.entry['LeadNameLastFirst']]),
                'UserId': App.context && App.context.user['$key'],
                'UserName': App.context && App.context.user['UserName'],
                'Duration': 15,
                'CompletedDate': (new Date())
            };

            this.navigateToHistoryInsert('atPhoneCall', entry, complete);
        },
        recordEmailToHistory: function(complete) {
            var entry = {
                '$name': 'History',
                'Type': 'atEMail',
                'AccountName': this.entry['Company'],
                'LeadId': this.entry['$key'],
                'LeadName': this.entry['LeadNameLastFirst'],
                'Description': dojo.string.substitute(this.emailedText, [this.entry['LeadNameLastFirst']]),
                'UserId': App.context && App.context.user['$key'],
                'UserName': App.context && App.context.user['UserName'],
                'Duration': 15,
                'CompletedDate': (new Date())
            };

            this.navigateToHistoryInsert('atEMail', entry, complete);
        },
        callWorkPhone: function() {
            this.recordCallToHistory(function() {
                App.initiateCall(this.entry['WorkPhone']);
            }.bindDelegate(this));
        },
        checkWorkPhone: function(entry, value) {
            return !value;
        },
        sendEmail: function() {
            this.recordEmailToHistory(function() {
                App.initiateEmail(this.entry['Email']);
            }.bindDelegate(this));
        },
        checkEmail: function(entry, value) {
            return !value;
        },
        viewAddress: function() {
            App.showMapForAddress(Mobile.SalesLogix.Format.address(this.entry['Address'], true, ' '));
        },
        checkAddress: function(entry, value) {
            return !Mobile.SalesLogix.Format.address(value, true, '');
        },
        scheduleActivity: function() {
            App.navigateToActivityInsertView();
        },
        addNote: function() {
            var view = App.getView(this.noteEditView);
            if (view)
            {
                view.show({
                    template: {},
                    insert: true
                });
            }
        },
        createLayout: function() {
            return this.layout || (this.layout = [{
                list: true,
                title: this.actionsText,
                cls: 'action-list',
                children: [{
                    property: 'WorkPhone',
                    label: this.callWorkNumberText,
                    icon: 'content/images/icons/Dial_24x24.png',
                    action: 'callWorkPhone',
                    disabled: this.checkWorkPhone,
                    renderer: Mobile.SalesLogix.Format.phone.bindDelegate(this, false)
                },{
                    property: 'Email',
                    label: this.sendEmailText,
                    icon: 'content/images/icons/Send_Write_email_24x24.png',
                    action: 'sendEmail',
                    disabled: this.checkEmail
                },{
                    name: '',
                    label: this.scheduleActivityText,
                    icon: 'content/images/icons/Schedule_ToDo_24x24.png',
                    action: 'scheduleActivity',
                    tpl: new Simplate([
                        '{%: $.Company %} / {%: $.LeadNameLastFirst %}'
                    ])
                },{
                    property: 'LeadNameLastFirst',
                    label: this.addNoteText,
                    icon: 'content/images/icons/New_Note_24x24.png',
                    action: 'addNote'
                },{
                    property: 'Address',
                    label: this.viewAddressText,
                    icon: 'content/images/icons/Map_24.png',
                    action: 'viewAddress',
                    disabled: this.checkAddress,
                    renderer: Mobile.SalesLogix.Format.address.bindDelegate(this, [true, ' '])
                }]
            },{
                title: this.detailsText,
                children: [{
                    label: this.nameText,
                    property: 'LeadNameLastFirst'
                },{
                    label: this.accountText,
                    property: 'Company'
                },{
                    label: this.webText,
                    property: 'WebAddress',
                    renderer: Mobile.SalesLogix.Format.link
                },{
                    label: this.leadTitleText,
                    property: 'Title'
                },{
                    label: this.tollFreeText,
                    property: 'TollFree',
                    renderer: Mobile.SalesLogix.Format.phone
                },{
                    label: this.leadSourceText,
                    property: 'LeadSource.Description'
                }]
            },{
                title: this.moreDetailsText,
                collapsed: true,
                children: [{
                    label: this.interestsText,
                    property: 'Interests'
                },{
                    label: this.industryText,
                    property: 'Industry'
                },{
                    label: this.sicCodeText,
                    property: 'SICCode'
                },{
                    label: this.businessDescriptionText,
                    property: 'BusinessDescription'
                },{
                    label: this.notesText,
                    property: 'Notes'
                },{
                    label: this.ownerText,
                    property: 'Owner.OwnerDescription'
                }]
            },{
                list: true,
                title: this.relatedItemsText,
                children: [{
                    icon: 'content/images/icons/To_Do_24x24.png',
                    label: this.relatedActivitiesText,
                    view: 'activity_related',
                    where: this.formatRelatedQuery.bindDelegate(this, 'LeadId eq "${0}"')
                },
                {
                    icon: 'content/images/icons/journal_24.png',
                    label: this.relatedHistoriesText,
                    where: this.formatRelatedQuery.bindDelegate(this, 'LeadId eq "${0}" and Type ne "atDatabaseChange"'),
                    view: 'history_related'
                }]
            }]);
        }
    });
});