/// <reference path="../../../../../argos-sdk/libraries/ext/ext-core-debug.js"/>
/// <reference path="../../../../../argos-sdk/libraries/sdata/sdata-client-debug"/>
/// <reference path="../../../../../argos-sdk/libraries/Simplate.js"/>
/// <reference path="../../../../../argos-sdk/src/View.js"/>
/// <reference path="../../../../../argos-sdk/src/Detail.js"/>

Ext.namespace("Mobile.SalesLogix.Ticket");

(function() {
    Mobile.SalesLogix.Ticket.Detail = Ext.extend(Sage.Platform.Mobile.Detail, {
        //Localization
        accountText: 'acct name',
        areaText: 'area',
        assignedDateText: 'assigned date',
        assignedToText: 'assigned to',
        categoryText: 'category',
        contactText: 'contact',
        contractText: 'contract',
        descriptionText: 'desc',
        issueText: 'issue',
        needByText: 'needed date',
        notesText: 'comments',
        phoneText: 'phone',
        actionsText: 'Actions',
        relatedActivitiesText: 'Activities',
        relatedItemsText: 'Related Items',
        resolutionText: 'resolution',
        sourceText: 'source',
        statusText: 'status',
        subjectText: 'subject',
        ticketIdText: 'ticket number',
        titleText: 'Ticket',
        urgencyText: 'urgency',
        scheduleActivityText: 'Schedule activity',        
        moreDetailsText: 'More Details',

        //View Properties
        id: 'ticket_detail',
        editView: 'ticket_edit',

        querySelect: [
            'Account/AccountName',
            'Area',
            'AssignedDate',
            'AssignedTo/OwnerDescription',
            'Category',
            'Contact/NameLF',
            'Contract/ReferenceNumber',
            'Issue',
            'NeededByDate',
            'Notes',
            'ViaCode',
            'StatusCode',
            'Subject',
            'TicketNumber',
            'TicketProblem/Notes',
            'TicketSolution/Notes',
            'UrgencyCode'
        ],
        resourceKind: 'tickets',

        requestPickList: function(predicate) {
            var request = new Sage.SData.Client.SDataResourceCollectionRequest(App.getService())
                            .setResourceKind('picklists')
                            .setContractName('system');
            var uri = request.getUri();

            uri.setPathSegment(Sage.SData.Client.SDataUri.ResourcePropertyIndex, 'items');
            uri.setCollectionPredicate(predicate);

            request.allowCacheUse = true;

            return request;
        },
        processResponse: function(list, value, options) {
            var keyProperty = options.keyProperty ? options.keyProperty : '$key';
            var textProperty = options.textProperty ? options.textProperty : 'text';
            
            for (var i = 0; i < list.$resources.length; i++)
            {
                if (list.$resources[i][keyProperty] === value)
                {
                    var rowEl = this.el.child(options.dataProperty),
                    contentEl = rowEl && rowEl.child('span');

                    if (rowEl)
                        rowEl.removeClass('content-loading');

                    if (contentEl)
                        contentEl.update(list.$resources[i][textProperty]);

                    return list.$resources[i][textProperty];
                }
            }
        },
        requestSource: function(viaCode) {
            var request = this.requestPickList('name eq "Source"');

            request.read({
                success: function(data) {this.processSource(data, viaCode);},
                failure: this.requestSourceFailure,
                scope: this
            });
        },
        requestStatus: function(statusCode) {
            var request = this.requestPickList('name eq "Ticket Status"');

            request.read({
                success: function(data) {this.processStatus(data, statusCode);},
                failure: this.requestStatusFailure,
                scope: this
            });
        },
        requestUrgency: function(urgencyCode)
        {
            var request = new Sage.SData.Client.SDataResourceCollectionRequest(this.getService())
                .setResourceKind('urgencies')
                .setQueryArg('select', [
                    'Description',
                    'UrgencyCode'
                ].join(','));

            request.allowCacheUse = true;
            request.read({
                success: function(data) {this.processUrgency(data, urgencyCode);},
                failure: this.requestUrgencyFailure,
                scope: this
            });
        },
        requestUrgencyFailure: function(xhr, o) {
        },
        requestSourceFailure: function(xhr, o) {
        },
        requestStatusFailure: function(xhr, o) {
        },
        processStatus: function(statuses, statusCode) {
            var statusText = this.processResponse(statuses, statusCode, {dataProperty: '[data-property="StatusCode"]'});

            if (statusText) this.entry['StatusText'] = statusText;
        },
        processSource: function(sources, viaCode) {
            var sourceText = this.processResponse(sources, viaCode, {dataProperty: '[data-property="ViaCode"]'});

            if (sourceText) this.entry['SourceText'] = sourceText;
        },
        processUrgency: function(urgencies, urgencyCode) {
            var urgencyText = this.processResponse(urgencies, urgencyCode, {
                dataProperty: '[data-property="UrgencyCode"]',
                keyProperty: 'UrgencyCode',
                textProperty: 'Description'
            });

            if (urgencyText) this.entry['UrgencyText'] = urgencyText;
        },
        processEntry: function(entry) {
            Mobile.SalesLogix.Ticket.Detail.superclass.processEntry.apply(this, arguments);

            if (entry && entry['ViaCode']) this.requestSource(entry['ViaCode']);
            if (entry && entry['StatusCode']) this.requestStatus(entry['StatusCode']);
            if (entry && entry['UrgencyCode']) this.requestUrgency(entry['UrgencyCode']);
        },
        scheduleActivity: function() {
            App.navigateToActivityInsertView();
        },
        createLayout: function() {
            return this.layout || (this.layout = [{
                options: {
                    list: true,
                    title: this.actionsText,
                    cls: 'action-list'
                },
                as: [{
                    name: 'TicketNumber',
                    label: this.scheduleActivityText,
                    icon: 'content/images/icons/Scheduling_24x24.png',
                    action: 'scheduleActivity'
                }]
            },{
                options: {
                    title: this.detailsText
                },
                as: [{
                    label: this.accountText,
                    name: 'Account.AccountName'
                },{
                    label: this.contactText,
                    name: 'Contact.NameLF'
                },{
                    label: this.areaText,
                    name: 'Area'
                },{
                    label: this.categoryText,
                    name: 'Category'
                },{
                    label: this.issueText,
                    name: 'Issue'
                },{
                    label: this.subjectText,
                    name: 'Subject'
                },{
                    label: this.descriptionText,
                    name: 'TicketProblem.Notes'
                },{
                    cls: 'content-loading',
                    label: this.statusText,
                    name: 'StatusCode',
                    value: 'loading...'
                },{
                    cls: 'content-loading',
                    label: this.urgencyText,
                    name: 'UrgencyCode',
                    value: 'loading...'
                },{
                    label: this.needByText,
                    name: 'NeededByDate',
                    renderer: Mobile.SalesLogix.Format.date
                },{
                    label: this.assignedToText,
                    name: 'AssignedTo.OwnerDescription'
                }]
            },{
                options: {
                    title: this.moreDetailsText,
                    collapsed: true
                },
                as: [{
                    label: this.contractText,
                    name: 'Contract.ReferenceNumber'
                },{
                    cls: 'content-loading',
                    label: this.sourceText,
                    name: 'ViaCode',
                    value: 'loading...'
                },{
                    label: this.assignedDateText,
                    name: 'AssignedDate',
                    renderer: Mobile.SalesLogix.Format.date
                },{
                    label: this.resolutionText,
                    name: 'TicketSolution.Notes'
                },{
                    label: this.notesText,
                    name: 'Notes'
                }]
            },{
                options: {
                    list: true,
                    title: this.relatedItemsText
                },
                as: [{
                    icon: 'content/images/icons/Scheduling_24x24.png',
                    label: this.relatedActivitiesText,
                    view: 'activity_related',
                    where: this.formatRelatedQuery.createDelegate(
                        this, ['TicketId eq "{0}"'], true
                    )
                }]
            }]);
        }
    });
})();