/**
 * Created by fdimonte on 19/01/16.
 */

var SAViews = (function(){

    /**
     * SAViews Class
     * 
     * @constructor
     */
    function SAViews(){

        this.options = {
            IDs : {
                main        : 'SeriesAgenda',
                mask        : 'sa-mask',
                overlay     : 'sa-overlay',
                content     : 'sa-content'
            },
            classes : {
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
        
        MAIN_VIEW: 'MAIN_VIEW',
        PARSER_VIEW: 'PARSER_VIEW',
        AGENDA_VIEW: 'AGENDA_VIEW',

        switchToView: function( view, data ){
            var content,
                displayView = true;
            
            switch(view){
                case this.MAIN_VIEW:
                    content = getMainContent(data);
                    break;
                case this.PARSER_VIEW:
                    content = getEpisodesForm(data);
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
        hideOverlay.call(this);
    }

    function episodeToggle(e){
        var $t = $(e.currentTarget);
        $t.parent().next().find('input').prop('checked',$t.prop('checked'));
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
        
        var $mask    = $('<div/>').attr('id', this.options.IDs.mask),
            $overlay = $('<div/>').attr('id', this.options.IDs.overlay),
            $content = $('<div/>').attr('id', this.options.IDs.content);

        $mask.css({
            position:'fixed',
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            top: '0',
            left: '0',
            zIndex: 1000
        });

        $overlay.css({
            width: '80%',
            height: '80%',
            background: '#fff',
            border: '1px solid #777',
            borderRadius: '4px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            position: 'fixed',
            padding: '8px 0',
            overflow: 'hidden',
            zIndex: 1001
        });

        $content.css({
            width: '100%',
            height: '100%',
            overflow: 'auto'
        });

        $mask.on('click',maskEvent.bind(this));

        return $('<div/>').attr('id',this.options.IDs.main).append($mask).append($overlay.append($content));
    }
    
    // Main view
    function getMainContent(data){
        return $('<div/>').html('ciao');
    }

    // Episodes list
    function getEpisodesForm(episodes){
        var $form = $('<form/>').addClass('sa-form').css({
            overflow: 'auto'
        });

        $form.append($('<input/>').attr('type','text').val(episodes.title));

        var $list,$lists = $('<div/>');
        var season = 0;

        for(var e in episodes.list){
            if(episodes.list.hasOwnProperty(e)){
                if(episodes.list[e].season>season) {
                    season = episodes.list[e].season;

                    $('<label/>')
                        .append($('<input/>').attr('type','checkbox').prop('checked',true)
                            .on('change',episodeToggle)
                        )
                        .append('Season #'+season)
                        .appendTo($lists);

                    $list = $('<ul/>').appendTo($lists);
                }

                $list && $list.append(getEpisodeItem(episodes.list[e]));
            }
        }

        return $form.append($lists);
    }

    // Episode item
    function getEpisodeItem(saEpisode){
        var $episode = $('<li/>').addClass('sa-episode');
        var ID = saEpisode.fullNumber();

        $episode
            .append($('<input/>').attr('id',ID).attr('type','checkbox').prop('checked',true))
            .append($('<label/>').attr('for',ID).text(saEpisode.fullName()));

        return $episode;
    }

    return SAViews;
    
}());
