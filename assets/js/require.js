if(typeof jQuery === "undefined") throw "Require Plugin: jQuery library is required.";
(function($){
	$.ajaxPrefilter('script', function(options) {
		options.cache = true;
	});
	var _construct = function(_config,defaults){
		this.config = $.extend({},defaults,_config);
		return _require.load(this.config);
	}
	var _require = function(config){
		if((config instanceof Object && !(config instanceof Array)))
			return new _construct(config,this.defaults);
		else if(typeof config == "string"){
			var parts = config.split("|",2);
			if(parts.length != 2) throw "Malformatted require path";
			var def  = $.Deferred();
			var config = $.extend(true,
												{'paths':
													{'require':[
														{
															'type':	"template",
															'name': parts[0],
															'path': parts[1]
														}
													  ]
													},
												 'onRequireLoaded':function(templates){
													 def.resolve(templates[parts[0]]);
												 },
												 'onFail':function(){
													 def.reject();
												 }
												},this.defaults);
			var req = new _construct(config,this.defaults);
			return def.promise();
		}
	};
	$ = $.extend(true,$,{
		d2h: function(d) {
			return d.toString(16);
		},
		h2d: function (h) {
			return parseInt(h, 16);
		},
		stringToHex: function(tmp) {
			var str = '',
				i = 0,
				tmp_len = tmp.length,
				c;
		 
			for (; i < tmp_len; i += 1) {
				c = tmp.charCodeAt(i);
				str += $.d2h(c) + '';
			}
			return str;
		}
		
	});
	_require.defaults = {'path':"js/","paths":{"require":[],"lazy":[]},'onFail':false,'onLazyLoaded':false,'onRequireLoaded':false,'cache':true,'waitTime':1000};
	_require.cache = {};
	_require._defaults = $.extend(true,{},_require.defaults);
	$.extend(_require,{
		'config':function(new_config){
			this.defaults = $.extend(true,{},this.defaults,new_config);
		},
		'load':function(config){
			var conf = $.extend(true,{},this.defaults);
			if(config !== undefined){
				conf = $.extend(true,{},this.defaults,config);
			}
			var templates = {};
			if(conf.paths !== undefined && conf.paths.require !== undefined && $.isArray(conf.paths.require) && conf.paths.require.length > 0){
				var loadAsset = function(p,aux){
						if(conf.cache == true){
							if(_require.cache[$.stringToHex(p.path)] !== undefined){
								templates[p.name] = _require.cache[$.stringToHex(p.path)];
								lastCallback(aux);
								return;
							}
						}
						var fullpath = p.path;
						if(typeof conf.path  == "string")
							fullpath = conf.path + p.path;
						else if(typeof conf.path == "object" ){
							switch(p.type){
								case "template":
									if(conf.path.template)
										fullpath = conf.path.template + p.path;
								break;
								case "script":
									if(conf.path.script)
										fullpath = conf.path.script + p.path;
								break;
								case "css":
									if(conf.path.css)
										fullpath = conf.path.css + p.path;
								break;
							}
						}
						if(p.path.substring(0,1) == "//" || p.path.indexOf("://") > 0)
							fullpath = p.path;
						switch(p.type){
							case "script":
									$.getScript(fullpath)
									.done(function(){
										if(!!(p.success && p.success.constructor && p.success.call && p.success.apply))
											p.success();
										lastCallback(aux);
									})
									.fail(function(){
										if(!!(p.error && p.error.constructor && p.error.call && p.error.apply))
											p.error();
										lastCallback(aux);
									});
								
							break;
							case "css":
								if (document.createStyleSheet)
								{
									document.createStyleSheet(fullpath);
								}
								else
								{
									$("head")
									   .append('<link rel="stylesheet" type="text/css" href="'+(fullpath)+'" />'); 
								}
								lastCallback(aux);
							break;
							case "template":
								if(p.name == undefined){
									console.error("Require Plugin: You must define a name for the template. Path "+i);
									break;
								}
								$.ajax({'url':fullpath,
									method:"GET",
									dataType:'html',
									success:function(data){
										if(!!(p.success && p.success.constructor && p.success.call && p.success.apply))
											p.success(data);
										templates[p.name] = data;
										_require.cache[$.stringToHex(p.path)] = data;
										lastCallback(aux);
									},
									fail:function(){
										if(!!(p.error && p.error.constructor && p.error.call && p.error.apply))
											p.error(data);
										lastCallback(aux);
									}
								});
							break;
						}
					};
				var lastCallback = function(aux){
						if(aux == conf.paths.require.length - 1){
							if(!!(conf.onRequireLoaded && conf.onRequireLoaded.constructor && conf.onRequireLoaded.call && conf.onRequireLoaded.apply))
								conf.onRequireLoaded(templates);
						}
						return;
					}
				var templates = {};
				for(var i = 0; i < conf.paths.require.length;i++){
					var path = conf.paths.require[i];
					if(typeof path !== "object") continue;
					if(path.path == undefined){
						console.error("Require Plugin: You must define a path. Path "+i);
						continue;
					}
					if(path.type == undefined || $.inArray(path.type,["script","template","css"]) == -1){
						console.error("Require Plugin: You must define a type [script,template,css]. Path "+i);
						continue;
					}
					loadAsset(path,i);
					
				}
			}
			else {
				if(!!(conf.onRequireLoaded && conf.onRequireLoaded.constructor && conf.onRequireLoaded.call && conf.onRequireLoaded.apply))
					conf.onRequireLoaded({});
			}
			//console.log(conf.paths);
			if(conf.paths.lazy !== undefined && $.isArray(conf.paths.lazy) && conf.paths.lazy.length > 0){
				$(document).ready(function(){
					setTimeout(function(){
						var info = $.extend(true,{},conf,
												{
													'onRequireLoaded':conf.onLazyLoaded,
													'paths':
														{
															'require':conf.paths.lazy.slice(),
															'lazy':[]
														}
												}
									);
						info.paths.lazy = [];
						_require.load(info);
					},conf.waitTime);
				});
			}
			
		}
	});
	window.require = _require;
})(jQuery);