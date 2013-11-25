    ;(function($,window,document,undefined){
      var pluginName = 'colorPicker';
      var defaults = {
        label:'',
        size:20,
        count:6,
        hide:false
      };

      function Plugin(element,options){
        this.element   = element;
        this.settings  = $.extend({},defaults,options);
        this._defaults = defaults;
        this._name     = pluginName;
        this.init(); 
      }

      Plugin.prototype = {
        warp:    $('<div class="colorpicker-wrap"></div>'),
        label:   $('<div class="colorpicker-label"></div>'),
        trigger: $('<div class="colorpicker-trigger"></div>'),
        picker:  $('<div class="colorpicker-picker"></div>'),
        infos:   $('<div class="colorpicker-picker-info"></div>'),
        clear:   $('<div style="clear:both;"></div>'),

        init:function(){
          this.create_html();
          this.create_event();
        },
        create_html:function(){

          // step 1 hide or show the select color dropdown 
          if(this.settings.hide){
            $(this.element).hide();
          }else{
            $(this.element).show();
          }
          
          // step 2 show or hide the content
          if(this.settings.label){
            this.label.text(this.settings.label);
          }
          this.warp.append(this.label);

          // step 3 set the color of the trigger
          var selected_color = $(this.element).children(":selected").val();
          var selected_text  = $(this.element).children(":selected").text();
          this.trigger.css({"background":"#" + selected_color});
          this.warp.append(this.trigger);

          // step 4 set the info
          this.infos.css({"background":"#" + selected_color}).text(selected_text); 
          this.picker.append(this.infos);

          //step 5 set the picker style
          var width = (this.settings.size + 4) * this.settings.count;
          this.picker.css({"width":  + width + "px"});

          // step 6 set the color span
          $obj = this;

          $(this.element).children('option').each(function(k,v){
            var act = $(this).attr('selected') == 'selected' ? 'active' : '' ;
            var color = $(this).val();
            $obj.picker.append('<span class="colorpicker-picker-span ' + act + '" value="' + color + '" style="background:#' + color + ';width:' + $obj.settings.size + 'px;height:' + $obj.settings.size + 'px"></span> ' );            
          })

          this.warp.append(this.picker);
          this.warp.append(this.clear);

          $(this.element).after(this.warp);
        },
        create_event:function(){
          var $obj = this;
          // step 1 set up the warp mouseleave event
          this.warp.mouseleave($.proxy(function(){
            this.picker.fadeOut('slow');
          },this))
          
          // step 2 set up the label click event;
          this.label.click($.proxy(function(){
            this.picker.fadeIn('slow');
          },this))

          // step 3 step up the trigger click event;
          this.trigger.click($.proxy(function(){
            var offset = $(this.element).position();
            var left   = offset.left + $(this.element).width() + 5;
            var top    = offset.top;
            this.picker.css({
              "left":left,
              "top" : top
            }).fadeIn('slow');            
          },this))

          //step 4 set up the color box event 
          this.picker.children(".colorpicker-picker-span").hover(function(){
            $obj.infos.text($(this).attr('value')).css({"background":"#" + $(this).attr('value')});
          },function(){
            $obj.infos.text($obj.picker.children(".active").attr("value")).css({"background":"#" + $obj.picker.children(".active").attr("value")}).text($obj.picker.children(".active").attr("value"));
          })

          this.picker.children(".colorpicker-picker-span").click(function(){
            var color = $(this).attr('value');
            $(this).siblings().removeClass('active').end().addClass('active');
            $obj.infos.text(color).css({"background":"#" + color});
            $obj.trigger.css({"background":"#" + color});
            $($obj.element).val($(this).attr('value'));
          })

        }
      }

      $.fn[pluginName] = function(options){
        return this.each(function(){
          if(!$.data(this,'plugin_' + pluginName)){
            $.data(this,'plugin_' + pluginName,new Plugin(this,options))
          }
        })
      }
    })(jQuery,window,document)