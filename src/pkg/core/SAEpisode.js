/**
 * Created by fdimonte on 19/01/16.
 */

var SAEpisode = (function(){

    /**
     * SAEpisode Class
     * 
     * @param series {String}
     * @param season {Number}
     * @param number {Number}
     * @param title {String}
     * @param date {String}
     * @constructor
     */
    function SAEpisode(series, season, number, title, date){
        this.seriesTitle = series;
        this.season = season;
        this.number = number;
        this.title = title;
        this.date = date;
    }

    /**
     * SAEpisode prototype
     * 
     * @type {{fullNumber: Function, fullName: Function}}
     */
    SAEpisode.prototype = {
        fullNumber: function(){
            return [this.season,this.number].join('x');
        },
        fullName: function(){
            return [this.seriesTitle, this.fullNumber(), this.title].join(' - ');
        }
    };
    
    return SAEpisode;

}());
