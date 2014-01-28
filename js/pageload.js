// JavaScript Document

var main_nodes;
var alt;
var data = []; //Podatki
var alternative = []; //Alternative
var chart;	

$(document).ready(function() {
	
	alt = 0; //0 alternativ na zacetku
	main_nodes = 0; //id za utezi
	
	bind_tabs();
	
	
	//narisi_grafe();
	
	
	
	/* Testing Purposes */
	/*
	dodaj_utez("Utez 1", 0, "opis1");
	dodaj_utez("Utez 2", 0, "opis2");
	dodaj_utez("Utez 3", 0, "opis3");
	dodaj_utez("Utez 4", 0, "opis4");
	*/
	//console.log(data['u1']['graph']);
	//data['u0']['graph'].xAxis.categories = ['a', 'b', 'c', 'd', 'e'];
	//data['u0']['graph'].series[0].data = [0.1, 0.2, 0.3, 0.6, 1];
	
	//var chart = new Highcharts.Chart(data['u0']['graph']);
	
	//dodaj_alternativo();
	
	
});


function bind_tabs() {
	//console.log("binding..." + $("ul.menu li").length);
	$("ul.menu li").click(function() {
		//console.log(this.id);
		var id = this.id.substring(3);
		/*
		$(".article:not(#tab"+id+")").hide();
		$("#tab"+id).show();
		*/
	  	$("ul.menu li:not(#but"+id+")").removeClass("active");
		$("#but"+id).addClass("active");
		
		$(".article:not(#tab"+id+")").hide();
		$("#tab"+id).show();
		
	});
	
	$("#urejanje_utezi_shrani").click(function() {
		var id = $("#uredi_utez").attr("value");
		//console.log(id);
		data[id]['ime'] = $("#utez_ime").attr("value");
		data[id]['opis'] = $("#utez_opis").val();
		var graph_type = "";
		
		if($("#st").is(":checked")) {
			data[id]['type'] = 'st';
			//stopnicasta
			var temp_par = [];
			temp_par['par'] = [];
			temp_par['val'] = [];
			
			$(".param").each(function() {
				if(this.value != "") {
					//console.log(this.value);
					temp_par['par'].push(this.value);
					temp_par['val'].push(Number($(this).parent().parent().children().last().children().first().val()));
				}
			});
	
			data[id]['st_par'] = temp_par;
			
			data[id]['graph'].xAxis.categories = temp_par['par'];
			data[id]['graph'].series[0].data = temp_par['val'];
			
			var chart = new Highcharts.Chart(data[id]['graph']);
			
			//alternative zamenjamo z novimi selecti...
			$("div#alternative_div input[id*=_"+id+"]").replaceWith(function() {
				var append = "<select id='"+this.id+"' class='alt_par_text'>";
				for(i in data[id]['st_par']['par']) {
					append += "<option>"+data[id]['st_par']['par'][i]+"</option>";
				}
				append += "</select>";
				return append;
			});
			
			
			//console.log(temp_par['par']);
		} else if($("#lin").is(":checked")) {
			//console.log("linearna");
			data[id]['type'] = 'lin';
			
			var lin_max = $("#lin_max").val();
			var lin_min = $("#lin_min").val();
			
			data[id]['lin_max'] = lin_max;
			data[id]['lin_min'] = lin_min;
			
			var zaloga = [];
			var graf = [];
			
			for(var i=0; i<=10; i++) {
				var temp = Number(lin_min) + Number(i*(lin_max-lin_min)/10);
				zaloga.push(temp);
				graf.push(calculate_lin(id, temp));
			}
			//console.log(lin_min + " - " + lin_max + ",  k=" + k + ", n=" + n + " = " + zaloga);
			data[id]['graph'].xAxis.categories = zaloga;
			data[id]['graph'].series[0].data = graf;
			
			var chart = new Highcharts.Chart(data[id]['graph']);
			
		} else if($("#eks").is(":checked")) {
			//console.log("eksponentna");
			data[id]['type'] = 'eks';
			
			var eks_max = $("#eks_max").val();
			var eks_min = $("#eks_min").val();
			var eks_n = $("#eks_n").val();
			
			data[id]['eks_max'] = eks_max;
			data[id]['eks_min'] = eks_min;
			data[id]['eks_n'] = eks_n;
			
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
		
		//console.log($("#utez_opis").val());
		//$("#utez_opis").attr("value");
		
		$("li#"+id+" > div[class=item] > text").html(data[id]['ime']);
		$("div#"+id+" > h3").html(data[id]['ime']);
		$("div#al_"+id).html(data[id]['ime']);
		$("div#"+id+" > p").html(data[id]['opis']);
		
		$("#urejanje_utezi").hide();
	});
	
	$("#urejanje_utezi_preklici").click(function() {
		$("#urejanje_utezi").hide();
	});
		
	$(".edit_radio").change(function() {
		var id = $(".edit_radio:checked").attr("id");
		$(".func_edit").hide();
		$("#"+id+"_div").show();
	});
	
	$("#dodaj_alternativo").click(function() {
		dodaj_alternativo();
	});
	
	$("#izracun").click(function() {
		izracunaj_oceno();
	});
	
	$("#load_data").click(function() {
		if(confirm("Ali res želite opustiti trenutne podatke in naloziti nove?")) { nalozi_datoteko(); }
	});
	
	$("#gen_data").click(function() {
		generiraj_kodo();
	});
	
	

}