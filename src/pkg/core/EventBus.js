/**
 * Created by fdimonte on 26/01/16.
 */

var EventBus = (function(){

    /**
     * SAEventBus Class
     * 
     * @constructor
     */
    function EventBus(){
        this.listeners = {};
        this.eventLogger = false;
        this.eventLogged = 0;
    }

    /**
     * SAEventBus prototype
     *
     * @type {{toggleLog: Function, on: Function, off: Function, trigger: Function}}
     */
    EventBus.prototype = {

        toggleLog: function(toggle){
            this.eventLogger = toggle!=null ? toggle : !this.eventLogger;
        },

        on: function(event,callback) {
            if(!callback) return;
            this.listeners[event] || (this.listeners[event]=[]);
            this.listeners[event].push(callback);
        },

        off: function(event) {
            this.listeners[event] = null;
        },

        trigger: function(event,data) {
            this.eventLogged++;
            
            this.eventLogger && console.log('(%d) TRIGGERED: %s - %o', this.eventLogged, event, data);
            
            if(!this.listeners[event]) return;
            for(var c=0; c<this.listeners[event].length; c++){
                this.listeners[event][c](data,event);
            }
        }

    };
    
    return EventBus;
    
}());
