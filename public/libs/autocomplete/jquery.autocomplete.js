
(function ($) {

$.fn.autocomplete = function(settings) 
{
	return this.each( function()//do it for each matched element
	{
		var textInput = $(this);
		//create a new hidden input that will be used for holding the return value when posting the form, then swap names with the original input
		textInput.after('<input type=hidden name="' + textInput.attr("name") + '"/>').attr("name", textInput.attr("name") + "_text");
		var valueInput = $(this).next();
		//create the ul that will hold the text and values
		valueInput.after('<ul class="autocomplete"></ul>');
		var list = valueInput.next();
		
		var oldText = '';
		var typingTimeout;
		var size = 0;
		var selected = -1;

		settings = $.extend(//provide default settings
		{
			minChars : 1,
			timeout: 1000,
			after : null,
			before : null,
			validSelection : true,
			parameters : {'inputName' : valueInput.attr('name'), 'inputId' : textInput.attr('id')}
		} , settings);

		function getData(text)
		{
			window.clearInterval(typingTimeout);
			if (text != oldText && (settings.minChars != null && text.length >= settings.minChars))
			{
				clear();
				if (settings.before == "function") 
				{
					settings.before(textInput,text);
				}
				textInput.addClass('autocomplete-loading');
				settings.parameters.text = text;
				
				$.getJSON(settings.url, settings.parameters, function(data)
				{
					var items = '';
					if (data)
					{
						size = 0;

						  for ( key in data )//get key => value
						  {	
								items += '<li value="' + key + '">' + data[key].replace(new RegExp("(" + text + ")","i"),"<strong>$1</strong>") + '</li>';
								size++;
						  }
						
						list.css({/*top: textInput.offset().top + textInput.outerHeight(), left: textInput.offset().left,*/ width: Math.max(100, textInput.outerWidth())}).html(items);
						//on mouse hover over elements set selected class and on click set the selected value and close list
						list.show().children().
						hover(function() { $(this).addClass("selected").siblings().removeClass("selected");}, function() { $(this).removeClass("selected") } ).
						  click(function () { value = $(this).attr('value'); text = $(this).text();valueInput.val( value ); textInput.val( text ); textInput.trigger("autocomplete.change", [ value, text ]);clear(); });

						if (settings.after == "function") 
						{
							settings.after(textInput,text);
						}
						
					}
					textInput.removeClass('autocomplete-loading');
				});
				oldText = text;
			}
		}
		
		function clear()
		{
			list.hide();
			size = 0;
			selected = -1;
		}	
		
		textInput.keydown(function(e) 
		{
			window.clearInterval(typingTimeout);
			if(e.which == 27)//escape
			{
				clear();
			} else if (e.which == 46 || e.which == 8)//delete and backspace
			{
				clear();
				//invalidate previous selection
				if (settings.validSelection) valueInput.val('');
			}
			else if(e.which == 13)//enter 
			{ 
				if ( list.css("display") == "none")//if the list is not visible then make a new request, otherwise hide the list
				{ 
					getData(textInput.val());
				} else
				{
					clear();
				}
				e.preventDefault();
				return false;
			}
			else if(e.which == 40 || e.which == 9 || e.which == 38)//move up, down 
			{
			  switch(e.which) 
			  {
				case 40: //down
				case 9:
				  selected = (selected >= size - 1) ? 0 : selected + 1; break;
				case 38://up
				  selected = (selected < 0) ? size -1 : selected - 1; break;
				default: break;
			  }
			  //set selected item and input values
			  textInput.val( list.children().removeClass('selected').eq(selected).addClass('selected').text() );	        
			  valueInput.val( list.children().eq(selected).attr('value') );
			} else 
			{ 
				//invalidate previous selection
				if (settings.validSelection) valueInput.val('');
				typingTimeout = window.setTimeout(function() { getData(textInput.val()) },settings.timeout);
			}
		});
	});
};

$.autocompleteList = function(el, settings) 
{
		var autocomplete = $(el).autocomplete(settings);
		
		var list = $('<div class="form-control autocomplete-list" style="min-height: 100px;height: 100px; overflow: auto;"></div>');
		
		var autocomplete_hidden = autocomplete.next();
		
		var name =  autocomplete_hidden.attr("name");
		
		autocomplete_hidden.next().after(list);
		
		var autocomplete_list_hidden = $('<input type=hidden name="' + name + '_list"/>');
		
		list.after(autocomplete_list_hidden);

		function addItem(value, text)
		{
			list.append($('<div><a href=""class="close-btn text-dark">X</a>&ensp;<span>' + text + '</span>\
				<input name="list[]" value="' + value + '" type="hidden">\
			 </div>'));
		};
	
		function setList()
		{
			values = {};
			$("input", list).each(function(i, el)
			{
				values[this.value] = $("span", this.parentNode).text();
			});

			autocomplete_list_hidden.val( JSON.stringify(values) );
		};

		
		function setValue(value) { 
			if (value == "" || value == undefined) return false;
			
			values = JSON.parse(value);
			
			for (key in values)
			{
				addItem(key, values[key]);
			}
			
			setList();
		};

		autocomplete.on("autocomplete.change", function(event, value, text) { 
				var autolist = $(this).data("autocompleteList");

				autolist.addItem(value, text);
				autolist.setList();
				autolist.trigger("autocompletelist.change", [ JSON.stringify(values) ]);
		 });

		list.on("click", ".close-btn", function (event, value, text) 
		{
			this.parentNode.remove();
			setList();
			autocomplete.trigger("autocompletelist.change", [ JSON.stringify(values) ]);

			event.preventDefault();
			return false;
		});		 

		autocomplete.setValue = setValue;
		autocomplete.addItem = addItem;
		autocomplete.setList = setList;

		$.data(el, "autocompleteList", autocomplete);
		
		return autocomplete;
}

$.fn.autocompleteList = function(options) 
{
	if (options) 
	return this.each( function()//do it for each matched element
	{
		autocomplete = $.autocompleteList(this, options);
	});
};

})(jQuery);
