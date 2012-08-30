define('Mobile/SalesLogix/Fields/RecurrencesField', [
    'dojo/_base/declare',
    'Sage/Platform/Mobile/Fields/EditorField',
    'Sage/Platform/Mobile/Fields/FieldRegistry'
], function(
    declare,
    EditorField,
    FieldRegistry
) {
    var RecurrencesField = declare('Mobile.SalesLogix.Fields.RecurrencesField', [EditorField], {
        // Localization
        titleText: 'Recurring',
        emptyText: '',
        attributeMap: {
            noteText: {
                node: 'inputNode',
                type: 'innerHTML'
            }
        },

        widgetTemplate: new Simplate([
            '<label for="{%= $.name %}">{%: $.label %}</label>',
            '<button class="button simpleSubHeaderButton" aria-label="{%: $.lookupLabelText %}"><span>{%: $.lookupText %}</span></button>',
            '<div data-dojo-attach-point="inputNode" class="note-text"></div>'
        ]),

        setText: function(text) {
            this.set('noteText', text);
        }
    });

    FieldRegistry.register('recurrences', RecurrencesField);

    return RecurrencesField;
});