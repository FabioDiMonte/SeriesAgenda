/**
 * Created by fdimonte on 19/01/16.
 */

var SAParser = (function(SAEpisode){
    
    function SAParser(){
        
    }
    
    SAParser.prototype = {
        
        parseWiki: function(excludedIndex, titleOverride){
            var title = titleOverride || $('head').find('title').text().replace(/(?:List of |^)([\w\s.]+?)(?: (?:\(.*|episodes))?(?: - Wikipedia, the free encyclopedia)/,get$1);
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
                        epTitle = $(e).text().replace(/\"(.+)\".*/,get$1),
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

    function get$1(a,b){return b;}
    
    return SAParser;
    
}(SAEpisode));
