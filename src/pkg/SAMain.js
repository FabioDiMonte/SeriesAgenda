/**
 * Created by fdimonte on 10/12/15.
 */

var SAMain = function($, EventBus, SAViews, SAParser){

    /**
     * SAMain Class
     * 
     * @constructor
     */
    function SAMain(){
        //localStorage.removeItem('SeriesAgenda');
        this.agenda = (localStorage && JSON.parse(localStorage.getItem('SeriesAgenda'))) || {};

        this.eventBus = new EventBus();
        this.parser = new SAParser(this.eventBus);
        this.views = new SAViews(this.eventBus);

        this.eventBus.toggleLog(true);
        
        this.init();
    }

    /**
     * SAMain prototype
     * 
     * @type {{parseEpisodes: Function, saveToMyAgenda: Function, showMyAgenda: Function}}
     */
    SAMain.prototype = {
        
        init: function(){

            addEvent.call(this , 'switchview:agenda' , this.displayAgenda);
            addEvent.call(this , 'switchview:parser' , this.displayParser);
            addEvent.call(this , 'session:parse'     , this.parseEpisodes);
            addEvent.call(this , 'storage:save'      , this.saveToMyAgenda);
            addEvent.call(this , 'storage:load'      , this.showMyAgenda);

        },

        displayAgenda: function(){
            this.views.switchToView(this.views.AGENDA_VIEW, this.agenda);
        },

        displayParser: function(){
            this.views.switchToView(this.views.PARSER_VIEW, this.parser.parseWiki());
        },

        parseEpisodes: function(data){
            this.views.switchToView(this.views.PARSER_VIEW, this.parser.parseWiki(data.excluded,data.title));
        },

        saveToMyAgenda: function(title,episodes){
            var pathname = window.location.pathname;
            this.agenda[pathname] || (this.agenda[pathname] = {});
            
            this.agenda[pathname].title = title;
            this.agenda[pathname].episodes = [];
            
            for(var e in episodes){
                if(episodes.hasOwnProperty(e)){
                    this.agenda[pathname].episodes.push(episodes[e]);
                }
            }
            localStorage.setItem('SeriesAgenda',JSON.stringify(this.agenda));
            
            this.showMyAgenda();
        },
        
        showMyAgenda: function(){
            var dateOrderedAgenda = this.agenda.episodes.sort(sortEpisodes);
            this.views.switchToView(this.views.AGENDA_VIEW, dateOrderedAgenda);
        }

    };

    /********************
     * PRIVATE METHODS
     ********************/
    
    function sortEpisodes(a,b){
        var msA = (new Date(a.date)).getTime(),
            msB = (new Date(b.date)).getTime();

        var compared = msA>msB ? -1 : msA<msB ? 1 : 0;

        if(compared===0) {
            compared = a.season > b.season ? -1 : a.season < b.season ? 1 : 0;
        }
        if(compared===0) {
            compared = a.number > b.number ? -1 : a.number < b.number ? 1 : 0;
        }

        return compared;
    }
    
    function addEvent(event, callback){
        this.eventBus.on(event, callback.bind(this));
    }
    function removeEvent(event){
        this.eventBus.off(event);
    }

    return SAMain;

}(jQuery, EventBus, SAViews, SAParser);
