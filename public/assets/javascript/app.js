

function showModal (){
	$(".modal").modal('toggle');
	// $(".modal").show;
}

// modal button to create a new note
$(document).on('click', '#makenew', function(){
	var selected =$(this).parent();
	var id = selected.attr('data-id')
	console.log('the value of the note is ' + $('#note').val().trim())
	console.log('the new-note button was clicked')
	$.ajax({
		type: 'POST',
		dataType: 'json',
		url: '/articles/' + id,
		data: {
			body: $('#note').val().trim(),
			created: Date.now()
		}
	}).done(function(data){
		console.log('the new note was created')
	});
});


$(document).on('click', '#scrape', function(){
	$.ajax({
		method: 'GET',
		url: '/scrape'
	}).done(function(res){
		alert(res);
		$.get('/', function(){
			$('#results').empty;
			getJson();
		});
	});

});

// $(document).on('click' '#get-notes', function(){
// 	$ajax({
// 		method: 'GET',
// 		url: '/scrape'
// 	}).done(function(res){
// 		alert(res);
// 		$.get('/', function(){
// 			$('#results').empty();
// 			getJson();
// 		});
// 	});
// });

// $(document).on('click', '#get-notes', function(){
// 	$.ajax({
// 		method: 'GET',
// 		url: '/scrape' + id
// 	}).done(function(res){
// 		alert(res);
// 		$.get("/", function() {
//   		$('#results').empty();
//   		getJson();
// 	});
// });


// main menu -- will probably delete
$(document).on('click', '#home', function(){
	$.get("/", function() {
  // Call our function to generate a table body
  $('#results').empty();
});

});

// deletes an article
$(document).on('click', '.delete', function(){
	console.log('a delete button was clicked');
	var selected =$(this).parent();
	console.log('the id is ' + selected.attr('data-id'));
	$.ajax({
		type: 'delete',
		url: '/delete/' + selected.attr('data-id'),
		success: function(response){
			console.log('the item was deleted')
			getJson();
		}
	});
});

// articles' note button: appends modal with article id and title then fires showModal()
$(document).on('click', '.note', function(){
	$('#article-title').empty();
	$('#notes').empty();
	var selected =$(this).parent();
	var id = selected.attr('data-id')
	console.log('the id is ' + id);
	// call a function to return the title of the article

	$.ajax({
		method: 'GET',
		url: '/articles/' + id
	}).done(function(data){
		console.log(data);
		$('#article-title').append("<h3>" + data.title + "</h3>");

		$("#notes").append("<textarea id='note' name='body'></textarea>");

		if (data.note) {
			console.log(data.note.body);
			$("#note").val(data.note.body);
		}
	});

	// $('#article-id').append(id);
	$('#makenew').attr('data-id', id);
	$('#actionbutton').attr('data-id', id);
	showModal();
});


$(document).on('click', '#articles', function(){
	getJson();
	// $.getJSON("/articles", function(data) {
 //  		getArticles(data);
 //  	});
});



// function gettArticles(articles) {
// 	$('#results').empty();
// 	articles.forEach(function(article){
// 		$('#results').append(
// 			"<p class='dataentry' data-id=" + article._id + "><span class='dataTitle' data-id=" + article._id + ">" + article.title + "</span></p>"
// 			)
// 	});
// }


function getArticles(articles) {
	$('#results').empty();
	articles.forEach(function(article){
		$('#results').append(
			"<br><div class='panel-heading' data-id=" + article._id + "><h3 class='panel-title'><a target='_blank' href=" + article.link + " data-id=" + article._id + ">" + article.title + "</a></h3><br><button class='btn-danger delete'>Delete</button> <button class='note btn-primary'>Check Notes</button></div><br>"
			)
	});
}




function getJson() {
	$.getJSON('/articles', function(data){
		if(data){getArticles(data);
		}else{
			alert(data);
		}
	});
}

