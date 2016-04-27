/**
 * Created by fdimonte on 19/01/16.
 */

var SAViews = (function(){

    /**
     * SAViews Class
     * 
     * @constructor
     */
    function SAViews(eventBus){

        this.eventBus = eventBus;
        
        this.options = {
            IDs : {
                main        : 'SeriesAgenda',
                mask        : 'sa-mask',
                overlay     : 'sa-overlay',
                content     : 'sa-content',
                navigation  : 'sa-navigation',
                parserForm  : 'sa-form-episodes'
            },
            classes : {
                seasonItem  : 'sa-season',
                episodeItem : 'sa-episode'
            }
        };

        setupStyles.call(this);
        this.$baseView = getBaseView.call(this);

        this.switchToView(this.MAIN_VIEW);

    }

    /**
     * SAViews prototype
     *
     * @type {{views: Object, switchToView: Function}}
     */
    SAViews.prototype = {
        
        MAIN_VIEW   : 'MAIN_VIEW',
        PARSER_VIEW : 'PARSER_VIEW',
        AGENDA_VIEW : 'AGENDA_VIEW',

        switchToView: function( view, data ){
            var content,
                displayView = true;
            
            switch(view){
                case this.MAIN_VIEW:
                    content = getMainContent.call(this,data);
                    break;
                case this.PARSER_VIEW:
                    content = getParserContent.call(this,data);
                    break;
                case this.AGENDA_VIEW:
                    content = data;
                    break;
                default:
                    displayView = false;
            }

            if(displayView){
                setupViewContent.call(this,content);
                showOverlay.call(this);
            }
        }

    };

    /********************
     * PRIVATE METHODS
     ********************/

    function setupViewContent(content){
        this.$baseView.find('#'+this.options.IDs.content).html(content);
    }

    function showOverlay(){
        this.$baseView.appendTo('body');
    }

    function hideOverlay(){
        this.$baseView.remove();
    }

    /********************
     * EVENT HANDLERS
     ********************/

    function maskEvent(e){
        e.preventDefault();
        hideOverlay.call(this);
    }

    function episodeToggle(e){
        e.preventDefault();
        var $t = $(e.currentTarget);
        $t.parent().next().find('input').prop('checked',$t.prop('checked'));
    }

    function triggerEvent(event,data,e){
        e.preventDefault();
        this.eventBus.trigger(event,data);
    }

    function refreshEpisodes(e){
        var title = $(e.currentTarget).prev().find('input[type=text]').val();
        var data = {
            title    : title,
            excluded : []
        };
        triggerEvent.call(this,'session:parse',data,e);
    }

    function saveEpisodes(e){
        triggerEvent.call(this,'storage:save');
    }

    /********************
     * DOM METHODS
     ********************/

    // Style tag
    function setupStyles(){
        var $style = $('<style/>').attr('id','SeriesAgenda-styles');

        $style
            .append('#'+this.options.IDs.main+' ul {list-style: outside none none; margin: 0; padding: 0 8px;}')
            .append('.'+this.options.classes.episodeItem+' label {padding: 4px 2px 2px; display: block; margin: 1px 0;}')
            .append('.'+this.options.classes.episodeItem+' input {display: none;}')
            .append('.'+this.options.classes.episodeItem+' input + label {background-color: #dedede;}')
            .append('.'+this.options.classes.episodeItem+' input:checked + label {background-color: #6f9;}');

        $('head').append($style);
    }

    // Base View overlay
    function getBaseView(){
        var $agenda = $('#'+this.options.IDs.main);

        if($agenda.length>0) return $agenda;
        
        var $mask       = $('<div/>').attr('id', this.options.IDs.mask),
            $overlay    = $('<div/>').attr('id', this.options.IDs.overlay),
            $content    = $('<div/>').attr('id', this.options.IDs.content),
            $navigation = $('<div/>').attr('id', this.options.IDs.navigation).append(getNavigation.call(this));

        var overlaySize = '80%';
        var contentSize = '100%';
        var navigationHeight = '30px';
        
        $mask.css({
            background: 'rgba(0,0,0,0.5)',
            height: '100%',
            left: '0',
            position:'fixed',
            top: '0',
            width: '100%',
            zIndex: 1000
        });

        $overlay.css({
            background: '#fff',
            borderRadius: '4px',
            height: overlaySize,
            left: '50%',
            overflow: 'hidden',
            position: 'fixed',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: overlaySize,
            zIndex: 1001
        });

        $content.css({
            boxSizing: 'border-box',
            height: contentSize,
            paddingTop: navigationHeight,
            width: contentSize
        });
        
        $navigation.css({
            height: navigationHeight,
            left: '0',
            position: 'absolute',
            top: '0',
            width: contentSize
        });

        $mask.on('click',maskEvent.bind(this));

        return $('<div/>').attr('id',this.options.IDs.main).append($mask).append($overlay.append($navigation).append($content));
    }
    
    // Navigation buttons
    function getNavigation(){
        var $nav = $('<nav/>')
            .append($('<button/>').attr('type','button').text('my agenda').on('click', triggerEvent.bind(this,'switchview:agenda',null)))
            .append($('<button/>').attr('type','button').text('episodes parser').on('click', triggerEvent.bind(this,'switchview:parser',null)));

        return $nav;
    }
    
    // Main view
    function getMainContent(data){
        var $main = $('<div/>');

        return $main;
    }
    
    // Parser view
    function getParserContent(data){
        var $form     = $('<form/>').attr('id',this.options.IDs.parserForm).on('submit',function(e){e.preventDefault();}),
            $left     = $('<div/>'),
            $right    = $('<div/>'),
            $title    = $('<input/>').attr('type','text').val(data.title),
            $episodes = getEpisodesList.call(this,data);

        $left
            .append($('<label/>').text('title').append($title))
            .append($('<button/>').attr('type','button').text('refresh').on('click', refreshEpisodes.bind(this)))
            .append($('<button/>').attr('type','button').text('save').on('click', saveEpisodes.bind(this)));

        $form.css({
            boxSizing: 'border-box',
            height: '100%',
            padding: '8px 0 8px 8px'
        });
        
        $title.css({
            boxSizing: 'border-box',
            width: '100%'
        });

        $left.css({
            display: 'inline-block',
            verticalAlign: 'top',
            width: '20%'
        });

        $right.css({
            display: 'inline-block',
            height: '100%',
            overflow: 'auto',
            width: '80%'
        });
        
        return $form.append($left).append($right.append($episodes));
    }

    // Episodes list
    function getEpisodesList(episodes){
        var $episodes,
            $seasons = $('<div/>'),
            season = 0;

        for(var e in episodes.list){
            if(episodes.list.hasOwnProperty(e)){
                if(episodes.list[e].season>season) {
                    season = episodes.list[e].season;

                    $('<div/>').addClass(this.options.classes.seasonItem)
                        .append(
                            $('<label/>')
                                .append($('<input/>').attr('type','checkbox').prop('checked',true).on('change',episodeToggle))
                                .append('Season #'+season))
                        .appendTo($seasons);

                    $episodes = $('<ul/>').appendTo($seasons);
                }

                $episodes && $episodes.append(getEpisodeItem.call(this,episodes.list[e]));
            }
        }

        return $seasons.children();
    }

    // Episode item
    function getEpisodeItem(saEpisode){
        var $episode = $('<li/>').addClass(this.options.classes.episodeItem);
        var ID = saEpisode.fullNumber();

        $episode
            .append($('<input/>').attr('id',ID).attr('type','checkbox').prop('checked',true))
            .append($('<label/>').attr('for',ID).text(saEpisode.fullName()));

        return $episode;
    }

    return SAViews;
    
}());
