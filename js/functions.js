function dodaj_parameter(ime, id_stars) { //id = parent
	var new_id = id_utezi;
	var generated_id = "u"+new_id;
	
	data[generated_id] = [];
	data[generated_id]['ime'] = ime;
	data[generated_id]['tip'] = null;
	
	var append = "\
	<li id='u"+new_id+"'> \
		<div class='slider'></div> \
		<div class='item'> \
			<text>"+ime+"</text> \
			<button class='btn-success btn-xs'>Dodaj</button> \
			<button class='btn-warning btn-xs'>Uredi</button> \
			<button class='btn-danger btn-xs'>Odstrani</button> \
		</div> \
		<ul id='u"+new_id+"_l'></ul> \
	</li>";
	
	if(id_stars == 0) { //dodajamo na najvišjo stopnjo
	
		$("#main_list").append(append);
		dokoncaj_parameter("u"+new_id);
		id_utezi++;
		
	} else { //dodajamo v parameter
		var element_list = $("#"+id_stars+"_l");// #u1 ul element
		if(element_list.length > 0) { //najden 
			element_list.append(append);
			dokoncaj_parameter("u"+new_id);
			id_utezi++;
			
			
		} else {
			return -1; 
		}
	}
	//pomozne f
	create_function(generated_id, ime, "normal");
	create_legend_item(generated_id, ime);
	add_to_existing_atr(generated_id);
	clear_functions();
}
		
function dokoncaj_parameter(id) {
	
	var parent_id = $("#"+id).parent().attr("id");
	
	$("#"+id).children("div[class=slider]").slider({
		range: 'min',
		value: 100,
		size: 10,
		create: drsnik,
		slide: drsnik,
		stop: drsnik
	});
	
	$("#"+id).children("div[class=item]").children("button[class='btn-danger btn-xs']").click(function() { //odstrani
		odstrani_parametre($(this).parent().parent().attr("id"));
	});
	
	$("#"+id).children("div[class=item]").children("button[class='btn-success btn-xs']").click(function() { //dodaj
		//alert($(this).parent().parent().attr("id"));
		dodaj_parameter("Nov parameter ", $(this).parent().parent().attr("id"));
	});
	
	$("#"+id).children("div[class=item]").children("button[class='btn-warning btn-xs']").click(function() { //uredi

		var id = $(this).parent().parent().attr("id");
		uredi_utez = id;
		console.log("Urejam id:"+id+" naziv:"+data[id]['ime']);
		$("#uredi_utez").attr("value", id);
		
		$("#utez_ime").attr("value", data[id]['ime']);
						
		$(".param, .val").each(function() {
			this.value = "";
		});
		
		$("#lin_div").hide();
		$("#eks_div").hide();
		
		$("#lin_min").val("");
		$("#lin_max").val("");
		$("#eks_min").val("");
		$("#eks_max").val("");
		$("#eks_n").val("");
		
		if(data[id]['type'] == null) {
			
			$("#lin").attr('checked', false);
			$("#eks").attr('checked', false);
			
		}
		else if(data[id]['type'] == 'lin') {
			
			$("#lin").attr('checked', true);
			
			
			$("#lin_div").show();
			$("#eks_div").hide();
			
			$("#lin_min").val(data[id]['lin_min']);
			$("#lin_max").val(data[id]['lin_max']);
			
		} else if(data[id]['type'] == 'eks') {
			
			$("#eks").attr('checked', true);
			
			
			$("#lin_div").hide();
			$("#eks_div").show();
			
			$("#eks_min").val(data[id]['eks_min']);
			$("#eks_max").val(data[id]['eks_max']);
			$("#eks_n").val(data[id]['eks_n']);
		}
		
		
		$("div#urejanje_utezi").show();
		scroll(0,0);
	});
}

function odstrani_parametre(id) {
	if(confirm("Z brisanjem bodo odstranjeni tudi morebitni podelementi! Želite nadaljevati? ")) {
		$(".alternativa_legend div.alt_header_ocena").remove();
		remove_id = id;
		var elements = $("#"+remove_id+" li");
		
			elements.each(function() {
				odstrani_parameter(this.id);
			});
			odstrani_parameter(remove_id);
		}

}

function odstrani_parameter(id) {
	
	$("div#al_"+id).remove(); //iz legende alternativ
	$("div#alternative_div input[id*=_"+id+"]").remove(); // iz alternativ
	$("div#"+id).remove(); //funkcija koristnosti
	$("li#"+id).remove(); //izbrisemo element
	clear_functions();
}

//Spreminjanje drsnikov
function drsnik() {
	
		var el_id = $(this).parent().attr("id");
		var list_id = $(this).parent().parent().attr("id");
		
		var sliders = $("#"+list_id).children("li").children("div.slider");
		
		var val = 0;
		sliders.each(function() {
			val += parseInt($(this).slider("value"));
		});
		//alert("vrednosti: " + val);
		
		var diff = val - 100; //nepravilna vrednost
		
		//console.log(sliders.not(this).length);
		sliders.not(this).each(function() {
			var tmp = $(this).slider("value");
			$(this).slider("value", (tmp - 2* tmp * (diff/val)) ); //nastavimo vrednosti ostalig
		});
}

function clear_functions() {
	$("#main_list li").each(function() {
		if($(this).children("ul").children().length > 0) {
			var id = this.id;
			$("div#"+id).hide();//Skrijemo graf funkcije
			
			$("div#al_"+id).hide(); //Skrijemo v legendi
			$("div#alternative_div input[id*=_"+id+"]").hide(); //skrijemo na alternativah
			
		} else {
			var id = this.id;
			$("div#"+id).show();
			
			$("div#al_"+id).show(); //Pokazemo v legendi
			$("div#alternative_div input[id*=_"+id+"]").show(); //Pokazemo na alternativah
			
		}
	});
}

function drsnik_vrednost(id) {
	return (Number($("#"+id+" > div.slider").slider("value"))/100);
}



function narisi_grafe() {

	graf = new Highcharts.Chart({
		chart: {
			renderTo: 'func1',
			defaultSeriesType: 'line',
			marginRight: 10,
			marginBottom: 50,
			width: 400,
			height: 300
		},
		title: {
			text: '',
			x: 0 
		},
		yAxis: {
			title: {
				text: ''
			},
			min: 0,
			max: 1
		},
		tooltip: {
			formatter: function() {
					return '<b>'+ this.series.name +'</b><br/>'+ this.y;
			}
		},
		legend: {
			enabled: false
		},
		series: [{
			name: 'Funkcija koristnosti',
			data: [0, 1]
		}]
	});
}

function narisi_graf_default(id, ime) {
	var div = id+"_graph";
	var opts = {
		chart: {
			renderTo: div,
			defaultSeriesType: 'line',
			marginRight: 10,
			marginBottom: 50,
			width: 400,
			height: 300
		},
		title: null,
		xAxis: {
			categories: ['', '']
		},
		yAxis: {
			title: {
				text: ''
			},
			min: 0,
			max: 1
		},
		tooltip: {
			formatter: function() {
					return '<b>'+ this.series.name +'</b><br/>'+this.y;
			}
		},
		legend: {
			enabled: false
		},
		series: [{
			name: 'Funkcija koristnosti',
			data: [-1, -1]
		}]
	};
	data[id]['graph'] = opts;
	var chart = new Highcharts.Chart(opts);
}

function create_function(id, ime, mode) {
	
	var append = "\
		<div class='funkcija' id='"+id+"'> \
            	<div id='"+id+"_graph' class='graf'></div> \
            	<p><strong> Parameter: "+ime+"</strong></p> \
            	<button class='btn btn-warning'>Uredi</button> \
				<button class='btn btn-danger'>Odstrani</button> \
            </div><hr />";
	$("#art3").append(append);
	
	$("div#"+id).children("button[class='btn btn-danger']").click(function() {
		odstrani_parametre($(this).parent().attr("id"));
	});
	
	$("div#"+id).children("button[class='btn btn-warning']").click(function() {
		var id = $(this).parent().attr("id");
		uredi_utez = id;
		console.log(id);
		console.log("ime: "+data[id]['ime']);

		$("#uredi_utez").attr("value", id);
		$("#utez_ime").attr("value", data[id]['ime']);
						
		$(".param, .val").each(function() {
			this.value = "";
		});
		
		$("#lin_div").hide();
		
		$("#lin_min").val("");
		$("#lin_max").val("");
		
		$("#eks_div").hide();
		
		$("#eks_min").val("");
		$("#eks_max").val("");
		$("#eks_n").val("");
		
		if(data[id]['type'] == null) {
			
			$("#st_div").hide();
			
			$("#lin").attr('checked', false);
			$("#eks").attr('checked', false);
			
		} else if(data[id]['type'] == 'lin') {
			
			$("#lin").attr('checked', true);
			
			$("#lin_div").show();
			$("#eks_div").hide();
			
			$("#lin_min").val(data[id]['lin_min']);
			$("#lin_max").val(data[id]['lin_max']);
			
		} else if(data[id]['type'] == 'eks') {
			
			$("#eks").attr('checked', true);
			
			$("#lin_div").hide();
			$("#eks_div").show();
			
			$("#eks_min").val(data[id]['eks_min']);
			$("#eks_max").val(data[id]['eks_max']);
			$("#eks_n").val(data[id]['eks_n']);
		}
		
		
		$("div#urejanje_utezi").show();
		scroll(0,0);
	});
	
	if(mode == "normal") {
		narisi_graf_default(id, ime);
	} else if(mode == "loading") {
		narisi_graf_default(id, ime);
		if(data[id]['type'] == "lin") {
			
			var lin_max = data[id]['lin_max'];
			var lin_min = data[id]['lin_min'];
			
			var zaloga = [];
			var graf = [];
			
			for(var i=0; i<=10; i++) {
				var temp = Number(lin_min) + Number(i*(lin_max-lin_min)/10);
				zaloga.push(temp);
				graf.push(calculate_lin(id, temp));
			}
			data[id]['graph'].xAxis.categories = zaloga;
			data[id]['graph'].series[0].data = graf;
			
			var chart = new Highcharts.Chart(data[id]['graph']);
			
		} else if(data[id]['type'] == "lin") {
			
			var eks_max = data[id]['eks_max'];
			var eks_min = data[id]['eks_min'];
			var eks_n = data[id]['eks_n'];
			
			var zaloga = [];
			var graf = [];
			
			for(var i=0; i<=10; i++) {
				var temp = Number(eks_min) + Number(i*(eks_max-eks_min)/10);
				zaloga.push(temp);
				graf.push(calculate_eks(id, temp));
			}
			
			data[id]['graph'].xAxis.categories = zaloga;
			data[id]['graph'].series[0].data = graf;
			data[id]['graph'].chart.defaultSeriesType = 'spline';
			
			var chart = new Highcharts.Chart(data[id]['graph']);
			
		}
	}
}


function calculate(id, value) {
	if(data[id]['type'] == 'lin') {
		return calculate_lin(id, value);
	} else if(data[id]['type'] == 'eks') {
		return calculate_eks(id, value);
	}
}


function calculate_lin(id, value) {
	
	var lin_max = data[id]['lin_max'];
	var lin_min = data[id]['lin_min'];
	
	var k = 1/(lin_max-lin_min);
	var n = lin_min*k;
	
	return k*value-n;
}

function calculate_eks(id, value) {
	
	var eks_max = data[id]['eks_max'];
	var eks_min = data[id]['eks_min'];
	var eks_n = data[id]['eks_n'];
	
	var k = 1/Math.pow(eks_max-eks_min, eks_n);
	
	return k*Math.pow(value-eks_min, eks_n);
}

function dodaj_alternativo() {
	
	var alt_id = id_alternative;
	var append = "\
            <div id='a"+alt_id+"' class='alternativa'> \
            	<input type='text' placeholder='naziv alternative' class='form-control' />";
	
	$("#art3 > div").each(function() { //funkcije korisnsti (drugi tab)
		
		if($(this).css('display') !== 'none') {
				append += "<input type='text' id='a"+alt_id+"_"+this.id+"' placeholder='vpiši vrednost' class='form-control'  />";
		}	
	});
	
	append += " \
		<div id='a"+alt_id+"_ocena' class='alt_header_ocena'></div> \
		<button class='btn btn-danger wide'>Odstrani alternativo</button> \
	</div>";
	
	$("div#alternative_div").append(append);
	
	$("div#a"+alt_id+" button").click(function() {
		$(this).parent().remove();
		najboljsa=0;
	});

	id_alternative++;
}

function create_legend_item(id, ime) {
	var append = "<div class='alt_header' id='al_"+id+"'>"+ime+": </div>"
	console.log(append);
	$(".alternativa_legend div.alt_header_ocena").before(append);
}



function add_to_existing_atr(id) {
	$("div.alternativa div.alt_par_ocena").before(function() {
		return "<input type='text' id='"+$(this).parent().attr("id")+"_"+id+"' placeholder='vrednost' class='form-control'  />";
	});
}

function izracunaj_oceno() {
	$("div.alternativa").each(function() {
		var alt_id = this.id;
		console.log(alt_id);
		var ocena = 0;
		$("#main_list > li").each(function() {
			ocena += (Math.round(calc_ocena(this.id, alt_id) * 100) / 100);
		});
		$("#"+this.id+"_ocena").html(ocena);
		if(ocena>najboljsa){
			najboljsa=ocena;
			$("#main_list > li").each(function() {
				$("#"+this.id+"_ocena").attr("class","alt_header_ocena");
			});
			$("#"+this.id+"_ocena").attr("class","alt_header_ocena best");

		}
	});
}

function calc_ocena(u_id, a_id) {
	
	if($("#"+u_id+"_l li").length > 0) { //ce so vgnezdeni ostali parametri
		var temp_oc = 0;
		$("#"+u_id+"_l > li").each(function() {
			temp_oc += calc_ocena(this.id, a_id);
		});
		return drsnik_vrednost(u_id) * temp_oc;
	} else {
		return drsnik_vrednost(u_id) * alternativa_vrednost(u_id, a_id);
	}
}

function alternativa_vrednost(u_id, a_id) {
	var value = $("#"+a_id+"_"+u_id).val();
	//console.log(value);
	return calculate(u_id, value);
}

