define('Mobile/SalesLogix/Views/Owner/List', [
    'dojo/_base/declare',
    'dojo/string',
    'argos/List',
    'argos/_SDataListMixin'
], function(
    declare,
    string,
    List,
    _SDataListMixin
) {

    return declare('Mobile.SalesLogix.Views.Owner.List', [List, _SDataListMixin], {
        //Templates
        itemTemplate: new Simplate([
            '<h3>{%: $.OwnerDescription %}</h3>'
        ]),

        //Localization
        titleText: 'Owners',

        //View Properties
        id: 'owner_list',
        security: 'Entities/Owner/View',
        queryOrderBy: 'OwnerDescription',
        querySelect: [
            'OwnerDescription'
        ],
        resourceKind: 'owners',

        formatSearchQuery: function(searchQuery) {
            return string.substitute('upper(OwnerDescription) like "%${0}%"', [this.escapeSearchQuery(searchQuery.toUpperCase())]);
        }
    });
});

