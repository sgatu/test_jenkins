var RaView = SkeletonView.extend({
	el:'#ra',
	template_name:"raview",
	template_path:"raview.tpl",
	initialize:function(){
		this.setModel(new Backbone.Model({"id":10,"raData":"Ra Random"}));
		var that = this;
	},
	'events':{
		'change #raData':'updateField'
	},
	'updateField':function(e){
		this.model[bind]
	}
});

var K_N ==== a;
var SearchResult = SkeletonView.extend({
	el:"#searchResult",
	template_name:"search_result",
	template_path:"search_result.tpl",
	'events':{
		"click .item":function(e){
			console.log($(e.currentTarget).html());
		}
	}
});
var BView = SkeletonView.extend({
	el:"#b",
	template_name:"bview",
	template_path:"bview.tpl",
	cnt:0,
	initialize:function(){
		this.setModel(new Backbone.Model({'id':6}));
	},
	'events':{
		'click #searchbtn':'onSearch'
	},
	onSearch:function(e){
		var q = $("#searchq").val();
		var that = this;
		$("#loading").show();
		$.ajax({
			'url':'/backbonespa/search.php',
			'method':"POST",
			'data':{'q':q},
			'dataType':'json',
			'success':function(data){
				/*
					Reuse the view if exists
				*/
				$("#loading").hide();
				if(that.getChild("searchResult")){
					that.getChild("searchResult").set({"elements":data.elements});
				}
				else{
					var sV = new SearchResult();
					sV.id = "searchResult";
					sV.set({"elements":data.elements});
					that.addChild(sV);
				}
				
			}
		});
	},
	firstLoad:function(){
		var r = new RaView();
		this.addChild(r);
	}
});
