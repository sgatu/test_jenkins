var SkeletonView = Backbone.View.extend({
	'template_name':"",
	'template_path':"",
	'data':{},
	'model':false,
	'_boolFirstLoad':true,
	'set':function(values,full){
		var isFull = full || true;
		if(!isFull)
			this.data = $.extend(true,this.data,values);
		else{
			for(var key in values){
				this.data[key] = values[key];
			}
		}
		for(child in this.children){
			for(value in values){
				this.children[child].trigger("update:$parent.data."+value);
			}
		}
		this.render();
	},
	'update':function(values){
		this.set(values,false);
	},
	'getChild':function(childName){
		if(this.children[childName] !== undefined)
			return this.children[childName];
		return false;
	},
	'removeChild':function(child){
		if(child == undefined || child == false) return;
		var id = false;
		if(typeof child == "object" && (child.id != undefined || child.cid != undefined)){
			id = child.id || child.cid;
		}
		else if(typeof child == "string"){
			id = child;
		}
		if(id && this.getChild(id)){
			var _child = this.getChild(id);
			_child.$el.html("");
			delete this.children[id];
		}
	},
	'addChild':function(view, selector){
		if(!this.hasOwnProperty('children')) this.children = {};
		view.father = this;
		var _id = view.id || view.cid;
		if(view.id && this.children[view.id] !== undefined) delete this.children[view.id];
		this.children[_id] = view;
		view.render();
	},
	'render':function(){
		var params = {"data":this.data};
		if(this.model && typeof this.model.set == "function"){
			params["model"] = $.extend(true,{},this.model.toJSON());
		}
		var that = this;
		require(this.template_name + "|" + this.template_path).then(function(template){

			var _data  =_.template(template)(params);
			that.$el.html(_data);
			if(that.hasOwnProperty("children")){
				for(var child in that.children){
					that.children[child].setElement(that.children[child].$el.selector).render();
				}
			}
			if(that.loaded && typeof that.loaded.apply == "function") that.loaded(that.firstLoad);
			if(that._boolFirstLoad && that.firstLoad && typeof that.firstLoad.apply == "function") that.firstLoad();
			if(that._boolFirstLoad) that._boolFirstLoad = false;
		}).fail(function(){
			
		});
	},
	'loaded': function(){ },
	'firstLoad':function() { },
	'setModel':function(model,bindings){
		this.model = model;
		var that = this;
		var onChange = function(){
			for(var key in this.changed){
				that.trigger("update:$model."+key);
			}
			that.render();
		};
		this.model.on("change",onChange);
		onChange();
	},
	'get':function(key){
		return this.data[key];
	},
	'bind':function(map){
		for(value in map){
			this.binds[value] = map[value];
		}
	}
});