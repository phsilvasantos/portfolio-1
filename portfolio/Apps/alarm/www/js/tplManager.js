// Render html templates with template7 as standard F7.
// 2015-06-08(Alex T)
define(['text!AlarmTpl'],function(AlarmTpl){
    var t7 = Template7;
    window.$$ = Dom7;
    var tplManager = {
        init: function(){
            $$('body').append(AlarmTpl);
        },
        loadTpl: function(id){
            var tpl = $$('#' + id).html();
            return tpl;
        },
        renderTpl: function(markup,renderData){
            var compiledTemplate = t7.compile(markup);
            var output = compiledTemplate(renderData);
            return output;
        },
        renderTplById: function(tplId,renderData){
            var markup = this.loadTpl(tplId);
            var compiledTemplate = t7.compile(markup);
            var output = compiledTemplate(renderData);
            return output;
        }
    };
    tplManager.init();
    return tplManager;
});