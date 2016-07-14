/**
 * Created by luor on 2016/1/19.
 */
(function(){
    function Observer(){
        this.fns = [];
    }
    Observer.prototype = {

        subscribe:function(fn){
            this.fns.push(fn);
        },
        unsubscribe:function(fn){
            this.fns = this.fns.filter(function(el){
                if(el!==fn){
                    return el;
                }
            });
        },
        update:function(o,obj){
            var scope = obj||window;
            this.fns.forEach(function(el){
               el.call(scope,o);
            });
        }
    }
})();