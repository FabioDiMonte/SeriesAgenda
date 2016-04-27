/**
 * Created by fdimonte on 19/01/16.
 */

var SAParser = (function(SAEpisode){
    
    function SAParser(eventBus){

        this.eventBus = eventBus;

    }
    
    SAParser.prototype = {
        
        parseWiki: function(excludedIndex, titleOverride){
            //var title = titleOverride || $('head').find('title').text().replace(/(?:List of |^)([\w\s.]+?)(?: (?:\(.*|episodes))?(?: - Wikipedia, the free encyclopedia)/,getGroup(1));
            var title = titleOverride || /(?:List of |^)([\w\s.]+?)(?: (?:\(.*|episodes))?(?: - Wikipedia, the free encyclopedia)/.exec($('head').find('title').text())[1];
            var episodes = {title:title,list:[]};
            var season = 0;

            $('table').each(function(i,e){
                var $summary = $(e).find('.summary');
                if($summary.length==0 || (excludedIndex && ~excludedIndex.indexOf(i))) return;

                season++;
                $summary.each(function(i,e){
                    if($(e).hasClass('navbox-title')) {
                        season--;
                        return;
                    }

                    var epNumber = ('00'+(i+1)).substr(-2),
                        epTitle = /("|')?(.+)\1/.exec($(e).text())[2],
                        date = $(e).parent().find('.published').text();

                    date && episodes.list.push(new SAEpisode(title, season, epNumber, epTitle, date));
                });
            });
            return episodes;
        }
        
    };

    /********************
     * PRIVATE METHODS
     ********************/
    
    return SAParser;
    
}(SAEpisode));
