/**
 * Created by fdimonte on 10/12/15.
 */

var SAMain = function($, SAViews, SAParser){

    /**
     * SAMain Class
     * 
     * @constructor
     */
    function SAMain(){
        //localStorage.removeItem('SeriesAgenda');
        this.agenda = (localStorage && JSON.parse(localStorage.getItem('SeriesAgenda'))) || {};

        this.parser = new SAParser();
        this.views = new SAViews();
    }

    /**
     * SAMain prototype
     * 
     * @type {{parseEpisodes: Function, saveToMyAgenda: Function, showMyAgenda: Function}}
     */
    SAMain.prototype = {
        
        parseEpisodes: function(excludedIndex, titleOverride){

            this.views.switchToView(this.views.PARSER_VIEW, this.parser.parseWiki(excludedIndex,titleOverride));
            
            //var eps = parseEpisodesWiki();
            //var ovl = showOverlay();
            //
            //var $form = getEpisodesForm(eps);
            //
            //ovl.find('#SAContent')
            //    .append($form)
            //    .append($('<button/>').text('save').on('click',function(e){
            //        this.saveToMyAgenda(eps.title,eps.list);
            //    }.bind(this)));
            
        },

        saveToMyAgenda: function(title,episodes){
            //this.agenda[title] || (this.agenda[title] = []);
            this.agenda.episodes || (this.agenda.episodes = []);

            for(var e in episodes){
                if(episodes.hasOwnProperty(e)){
                    this.agenda.episodes.push(episodes[e]);
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

    //function get$1(a,b){return b;}
    //function parseEpisodesWiki(excludedIndex){
    //    var title = $('head').find('title').text().replace(/(?:List of |^)([\w\s.]+?)(?: (?:\(.*|episodes))?(?: - Wikipedia, the free encyclopedia)/,get$1);
    //    var episodes = {title:title,list:[]};
    //    var season = 0;
    //
    //    $('table').each(function(i,e){
    //        var $summary = $(e).find('.summary');
    //        if($summary.length==0 || (excludedIndex && ~excludedIndex.indexOf(i))) return;
    //
    //        season++;
    //        $summary.each(function(i,e){
    //            if($(e).hasClass('navbox-title')) {
    //                season--;
    //                return;
    //            }
    //
    //            var epNumber = ('00'+(i+1)).substr(-2),
    //                epTitle = $(e).text().replace(/\"(.+)\".*/,get$1),
    //                date = $(e).parent().find('.published').text();
    //
    //            date && episodes.list.push(new SAEpisode(title, season, epNumber, epTitle, date));
    //        });
    //    });
    //    return episodes;
    //}

    //function showOverlay(){
    //    return getOverlay().appendTo('body');
    //}

    //function hideOverlay(){
    //    $('#SeriesAgenda').remove();
    //}

    /********************
     * DOM METHODS
     ********************/

    //function setupStyles(){
    //    var $style = $('<style/>').attr('id','SeriesAgenda-styles');
    //
    //    $style
    //        .append('#SeriesAgenda ul {list-style: outside none none; margin: 0; padding: 0 8px;}')
    //        .append('.sa-episode label {padding: 4px 2px 2px; display: block; margin: 1px 0;}')
    //        .append('.sa-episode input {display: none;}')
    //        .append('.sa-episode input + label {background-color: #dedede;}')
    //        .append('.sa-episode input:checked + label {background-color: #6f9;}');
    //
    //    $('head').append($style);
    //}

    //function getOverlay(){
    //    var $agenda = $('#SeriesAgenda');
    //
    //    if($agenda.length===0){
    //
    //        var $mask    = $('<div/>').attr('id','SAMask'),
    //            $overlay = $('<div/>').attr('id','SAOverlay'),
    //            $content = $('<div/>').attr('id','SAContent');
    //
    //        $agenda = $('<div/>').attr('id','SeriesAgenda').append($mask).append($overlay.append($content));
    //
    //        $mask.css({
    //            position:'fixed',
    //            width: '100%',
    //            height: '100%',
    //            background: 'rgba(0,0,0,0.5)',
    //            top: '0',
    //            left: '0',
    //            zIndex: 1000
    //        });
    //
    //        $overlay.css({
    //            width: '80%',
    //            height: '80%',
    //            background: '#fff',
    //            border: '1px solid #777',
    //            borderRadius: '4px',
    //            top: '50%',
    //            left: '50%',
    //            transform: 'translate(-50%, -50%)',
    //            position: 'fixed',
    //            padding: '8px 0',
    //            overflow: 'hidden',
    //            zIndex: 1001
    //        });
    //
    //        $content.css({
    //            width: '100%',
    //            height: '100%',
    //            overflow: 'auto'
    //        });
    //
    //        $mask.on('click',function(e){
    //            hideOverlay();
    //        });
    //
    //    }
    //
    //    return $agenda;
    //}

    //function getEpisodesForm(episodes){
    //    var $form = $('<form/>').addClass('sa-form').css({
    //        overflow: 'auto'
    //    });
    //
    //    $form.append($('<input/>').attr('type','text').val(episodes.title));
    //
    //    var $list,$lists = $('<div/>');
    //    var season = 0;
    //
    //    for(var e in episodes.list){
    //        if(episodes.list.hasOwnProperty(e)){
    //            if(episodes.list[e].season>season) {
    //                season = episodes.list[e].season;
    //
    //                $('<label/>')
    //                    .append($('<input/>').attr('type','checkbox').prop('checked',true)
    //                        .on('change',function(e){
    //                            var $t = $(e.currentTarget);
    //                            $t.parent().next().find('input').prop('checked',$t.prop('checked'));
    //                        })
    //                    )
    //                    .append('Season #'+season)
    //                    .appendTo($lists);
    //
    //                $list = $('<ul/>').appendTo($lists);
    //            }
    //
    //            $list && $list.append(getEpisodeItem(episodes.list[e]));
    //        }
    //    }
    //
    //    return $form.append($lists);
    //}

    //function getEpisodeItem(episodeInfo){
    //    var $episode = $('<li/>').addClass('sa-episode');
    //    var ID = episodeInfo.fullNumber();
    //
    //    $episode
    //        .append($('<input/>').attr('id',ID).attr('type','checkbox').prop('checked',true))
    //        .append($('<label/>').attr('for',ID).text(episodeInfo.fullName()));
    //
    //    return $episode;
    //}

    return SAMain;

}(jQuery, SAViews, SAParser);
