// JavaScript Document

var id_utezi;
var id_alternative;
var data = []; //Podatki
var alternative = []; //Alternative
var chart;	


	
$(document).ready(function() {
	id_alternative = 0; //0 alternativ na zacetku alt
	id_utezi = 0; //main_nodes	
	menu();

	//skrijemo preostale elemente
	$(".popup").hide();  
	$(".article:not(#art"+1+")").hide(); 
	
	//dodamo prvo utez
	dodaj_utez('Prvi element', 0)
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
		//console.log("UREJANJE"+id);
		data[id]['ime'] = $("#utez_ime").val();
		var graph_type = "";
		console.log("IME: "+$("#utez_ime").val());
		if($("#lin").is(":checked")) {
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
		
		console.log("trenutna: "+data[id]['ime']);
		$("li#"+id+" > div[class=item] > text").html(data[id]['ime']);
		$("div#"+id+" > h3").html(data[id]['ime']);
		$("div#al_"+id).html(data[id]['ime']);
		
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
	
	
	

}