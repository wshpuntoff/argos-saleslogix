define('Mobile/SalesLogix/Views/_MetricListMixin', [
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/aspect',
    './MetricWidget'
], function(
    declare,
    array,
    lang,
    aspect,
    MetricWidget
) {
    return declare('Mobile.SalesLogix.Views._MetricListMixin', null, {
        // Metrics
        metricNode: null,
        metricWidgets: null,
        configurationView: 'metric_configure',

        postMixInProperties: function() {
            this.widgetTemplate =  new Simplate([
                '<div id="{%= $.id %}" title="{%= $.titleText %}" class="list {%= $.cls %}" {% if ($.resourceKind) { %}data-resource-kind="{%= $.resourceKind %}"{% } %}>',
                '<div data-dojo-attach-point="searchNode"></div>',
                '<ul data-dojo-attach-point="metricNode" class="metric-list"></ul>',
                '<a href="#" class="android-6059-fix">fix for android issue #6059</a>',
                '{%! $.emptySelectionTemplate %}',
                '<ul class="list-content" data-dojo-attach-point="contentNode"></ul>',
                '{%! $.moreTemplate %}',
                '{%! $.listActionTemplate %}',
                '</div>'
            ]);
        },
        createMetricWidgetsLayout: function() {
            return App.preferences && App.preferences.metrics[this.resourceKind];
        },
        createToolLayout: function() {
            return this.tools || (this.tools = {
                tbar: [{
                    id: 'configure',
                    action: 'navigateToConfigurationView'
                }]
            });
        },
        navigateToConfigurationView: function() {
            var view = App.getView(this.configurationView);
            if (view) {
                view.resourceKind = this.resourceKind;
                view.show({ returnTo: -1 });
            }
        },
        postCreate: function() {
            this.inherited(arguments);
        },
        destroyWidgets: function() {
            array.forEach(this.metricWidgets, function(widget) {
                widget.destroy();
            }, this);
        },
        // TODO: Be smart about a refresh required (when prefs change)
        onShow: function() {
            this.inherited(arguments);
            this._rebuildWidgets();
        },
        onActivate: function() {
            this.inherited(arguments);
            this._rebuildWidgets();
        },
        _rebuildWidgets: function() {
            this.destroyWidgets();
            this.metricWidgets = [];

            var widgetOptions;
            // Create metrics widgets and place them in the metricNode
            widgetOptions = this.createMetricWidgetsLayout() || [];
            array.forEach(widgetOptions, function(options) {
                if (this._hasValidOptions(options)) {
                    var widget = new MetricWidget(options);
                    widget.placeAt(this.metricNode, 'last');
                    widget.requestData();
                    this.metricWidgets.push(widget);
                }
            }, this);
        },
        _hasValidOptions: function(options) {
            return options 
                && options.queryArgs 
                && options.queryArgs._filterName 
                && options.queryArgs._metricName
        }
    });
});
