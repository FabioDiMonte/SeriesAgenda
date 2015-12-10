/**
 * Created by fdimonte on 10/12/15.
 */

function get$1(a,b){return b;}
function getEpisodes(excludedIndex){
    var title = $('head').find('title').text().replace(/(?:List of |^)([\w\s.]+?)(?: (?:\(.*|episodes))?(?: - Wikipedia, the free encyclopedia)/,get$1);
    var episodes = [];
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
            
            var epNum = ('00'+(i+1)).substr(-2),
                epTit = $(e).text().replace(/\"(.+)\".*/,get$1),
                episode = [title, season+'x'+epNum, epTit].join(' - '),
                date = $(e).parent().find('.published').text();
            
            date && episodes.push( [date, episode].join(': ') );
        });
    });
    return episodes;
}
