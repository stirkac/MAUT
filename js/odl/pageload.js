// JavaScript Document

var id_utezi;
var alternative;
var podatki = []; //Podatki
var alternative = []; //Alternative
var graf;	

$(document).ready(function() {
	
	id_alternative = 0; //alt 0 alternativ na zacetku
	id_utezi = 0; // main nodes id za utezi 
	
	menu();
	$(".article:not(#art"+1+")").hide(); //skrijemo vse razen frontpage-a
	
	
});


function menu() {
	//console.log("binding..." + $("ul.menu li").length);
	$("ul.menu li").click(function() {
		//console.log(this.id);
		var id = this.id.substring(3);
		
		
		$(".article:not(#art"+id+")").hide();
		$("#art"+id).show();
		
	});
	
$("#urejanje_utezi_shrani").click(function() {
	var id = $("#uredi_utez").attr("value");
	//console.log(id);
	podatki[id]['ime'] = $("#utez_ime").attr("value");
	podatki[id]['opis'] = $("#utez_opis").val();
	var graph_type = "";
	
	if($("#st").is(":checked")) {
		podatki[id]['type'] = 'st';
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

		podatki[id]['st_par'] = temp_par;
		
		podatki[id]['graph'].xAxis.categories = temp_par['par'];
		podatki[id]['graph'].series[0].data = temp_par['val'];
		
		var graf = new Highcharts.Chart(podatki[id]['graph']);
		
		//alternative zamenjamo z novimi selecti...
		$("div#alternative_div input[id*=_"+id+"]").replaceWith(function() {
			var append = "<select id='"+this.id+"' class='alt_par_text'>";
			for(i in podatki[id]['st_par']['par']) {
				append += "<option>"+podatki[id]['st_par']['par'][i]+"</option>";
			}
			append += "</select>";
			return append;
		});
		
		
		//console.log(temp_par['par']);
	} else if($("#lin").is(":checked")) {
		//console.log("linearna");
		podatki[id]['type'] = 'lin';
		
		var lin_max = $("#lin_max").val();
		var lin_min = $("#lin_min").val();
		
		podatki[id]['lin_max'] = lin_max;
		podatki[id]['lin_min'] = lin_min;
		
		var zaloga = [];
		var graf = [];
		
		for(var i=0; i<=10; i++) {
			var temp = Number(lin_min) + Number(i*(lin_max-lin_min)/10);
			zaloga.push(temp);
			graf.push(calculate_lin(id, temp));
		}
		//console.log(lin_min + " - " + lin_max + ",  k=" + k + ", n=" + n + " = " + zaloga);
		podatki[id]['graph'].xAxis.categories = zaloga;
		podatki[id]['graph'].series[0].data = graf;
		
		var graf = new Highcharts.Chart(podatki[id]['graph']);
		
	} else if($("#eks").is(":checked")) {
		//console.log("eksponentna");
		podatki[id]['type'] = 'eks';
		
		var eks_max = $("#eks_max").val();
		var eks_min = $("#eks_min").val();
		var eks_n = $("#eks_n").val();
		
		podatki[id]['eks_max'] = eks_max;
		podatki[id]['eks_min'] = eks_min;
		podatki[id]['eks_n'] = eks_n;
		
		var zaloga = [];
		var graf = [];
		
		for(var i=0; i<=10; i++) {
			var temp = Number(eks_min) + Number(i*(eks_max-eks_min)/10);
			zaloga.push(temp);
			graf.push(calculate_eks(id, temp));
		}
		
		podatki[id]['graph'].xAxis.categories = zaloga;
		podatki[id]['graph'].series[0].data = graf;
		podatki[id]['graph'].graf.defaultSeriesType = 'spline';
		
		var graf = new Highcharts.Chart(podatki[id]['graph']);
		
	}
	
	//console.log($("#utez_opis").val());
	//$("#utez_opis").attr("value");
	
	$("li#"+id+" > div[class=item] > text").html(podatki[id]['ime']);
	$("div#"+id+" > h3").html(podatki[id]['ime']);
	$("div#al_"+id).html(podatki[id]['ime']);
	$("div#"+id+" > p").html(podatki[id]['opis']);
	
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