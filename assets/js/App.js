var AppView = 

SkeletonView.extend({
		el: '#container #content',
		loading_el:'#container #loader',
		initialize: function(){
			this.initLoader();
			this.render();
		},
		initLoader: function(){
			var that = this;
			var updateLoader = function(){
				var element = $(that.loading_el);
				if(element.is(":visible")){
					var text = element.text();
					var firstDot = text.indexOf(".");
					var dots = "";
					if(firstDot > 0) dots = text.substring(firstDot);
					var repeat = 0;
					if(dots.length < 3) repeat = dots.length + 1;
					element.text("Loading" + ".".repeat(repeat));
				}
			};
			setInterval(updateLoader,1000);
			updateLoader();
		},
		render: function(){
			var that = this;
			require({
						'paths':
							{
								'require':[
									{
										'type':"template",
										'path':"layout.tpl",
										'name':'layout'
									}
								],
								'lazy':[
										{
											'type':"script",
											'path':"Views.js",
										}
								   ]
							 },
						'onLazyLoaded':function(){
							$(that.loading_el).hide();
							that.addChild(new BView());
							$(that.el).show();
						},
						'onRequireLoaded':function(templates){
							$(that.el).html(templates.layout);
						}
					});
		}
});
var appView = new AppView();