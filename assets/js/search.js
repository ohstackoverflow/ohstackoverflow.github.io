$(function () { $('#myModal').on('show.bs.modal', function () {

var words = $("#words").val();
console.log(words);
if(words.length != 0) {

	fetch('http://42.192.41.199:4080/api/en_qa/_search', {
	  method: 'POST',
	  headers: {
		'Accept': 'application/json',
		'Authorization':'Basic c3RhY2tvdmVyZmxvdy11c2VyOnFkNTEwODIz',
		'Content-Type': 'application/json'
	  },
	  body: JSON.stringify({
		search_type: 'querystring',
		query: {"term":words},
		from: 0,
		max_results: 6,
		_source: ["slug","title","content"]
	  })
	})
	.then(function(response) {
	  return response.json()
	})
	.then(function(json) {
		console.log('json:', json);
		var result = "";
		for(i=0; i < json.hits.hits.length; i++) {
			//console.log(json.hits.hits[i]._source.title);
			
			var slug = json.hits.hits[i]._source.slug;
			var title = json.hits.hits[i]._source.title;
			var content = json.hits.hits[i]._source.content;
			var endIdx = content.indexOf("。");
			if(endIdx != -1) {
			  content = content.substring(0,endIdx+1);
			} else {
			  content = content.length >= 101 ? content.substring(0,100):content;
			}
			var ret_template = '<div class="panel panel-default">\n' +
								'<div class="panel-body">\n' +
								'	<h4><a href="/posts/' + slug + '/">' + title + '</a></h4>\n' +
								'	<p>' + content + '</p>\n' +
								'</div>\n' +
							'</div>';
			result = result + ret_template;
			
		}
		
		if(json.hits.hits.length > 0) {
		
		  $('#search-count').html("共找到" + json.hits.hits.length + "条相关记录");
		  $('#search-result').html(result);
		} else {
		  $('#search-count').html("未找到相关记录");
		}
	})
	.catch(function(ex) {
		console.log('parsing failed', ex)
	})

}

}) });

$(function () { $('#myModal').on('hide.bs.modal', function () {
  $("#words").val("");
})
});

$(function () { $('#myModal').modal('hide')});
