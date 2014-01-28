// JavaScript Document

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
			text: 'Vrednost uteži 1',
			x: 0 //center
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
					return '<b>'+ this.series.name +'</b><br/>'+
					this.y;
			}
		},
		legend: {
			enabled: false
		},
		series: [{
			name: 'Koristnost',
			data: [0, 1]
		}]
	});
}

function narisi_graf_default(id, ime) {
	var div = id+"_graph";
	//var chart = new Highcharts.Chart({
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
					return '<b>'+ this.series.name +'</b><br/>'+
					this.y;
			}
		},
		legend: {
			enabled: false
		},
		series: [{
			name: 'Koristnost',
			data: [-1, -1]
		}]
	};
	podatki[id]['graph'] = opts;
	console.log(opts);
	var graf = new Highcharts.Chart(opts);
	//chart = Highcharts.Chart(opts);
}

function create_function(id, ime, opis, mode) {
	
	var append = "\
		<div class='funkcija' id='"+id+"'> \
            	<div id='"+id+"_graph' class='graph'></div> \
                <span class='close'></span> \
                <span class='edit'></span> \
            	<h3>"+ime+"</h3> \
                <p> \
                    "+opis+" \
                </p> \
            </div>";
	$("#art3").append(append);
	
	//$("div#"+id+" a.fancybox_item").fancybox({ type: 'iframe' });
	
	$("div#"+id).children("span[class=close]").click(function() {
		//console.log("closing: " + $(this).parent().attr("id"));
		odstrani_utez($(this).parent().attr("id"));
	});
	
	$("div#"+id).children("span[class=edit]").click(function() {
		//console.log("editing: " + $(this).parent().attr("id"));
		var id = $(this).parent().attr("id");
		uredi_utez = id;
		//console.log(id);
		//console.log(data[id]['ime']);
		$("#uredi_utez").attr("value", id);
		$("#utez_ime").attr("value", podatki[id]['ime']);
		$("#utez_opis").val(podatki[id]['opis']);
						
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
		
		if(podatki[id]['type'] == null) {
			
			$("#st_div").hide();
			
			$("#st").attr('checked', false);
			$("#lin").attr('checked', false);
			$("#eks").attr('checked', false);
			
		} else if(podatki[id]['type'] == 'st') {
			
			$("#st").attr('checked', true);
			
			$("#st_div").show();
			$("#lin_div").hide();
			$("#eks_div").hide();
			
			var i=0;
			$(".param").each(function() {
				if(podatki[id]['st_par']['par'][i] != null) {
					this.value = podatki[id]['st_par']['par'][i];
				}
				i++;
			});
			i=0;
			$(".val").each(function() {
				if(podatki[id]['st_par']['val'][i] != null) {
					this.value = podatki[id]['st_par']['val'][i];
				}
				i++;
			});
			
			
		} else if(podatki[id]['type'] == 'lin') {
			
			$("#lin").attr('checked', true);
			
			$("#st_div").hide();
			$("#lin_div").show();
			$("#eks_div").hide();
			
			$("#lin_min").val(podatki[id]['lin_min']);
			$("#lin_max").val(podatki[id]['lin_max']);
			
		} else if(podatki[id]['type'] == 'eks') {
			
			$("#eks").attr('checked', true);
			
			$("#st_div").hide();
			$("#lin_div").hide();
			$("#eks_div").show();
			
			$("#eks_min").val(podatki[id]['eks_min']);
			$("#eks_max").val(podatki[id]['eks_max']);
			$("#eks_n").val(podatki[id]['eks_n']);
		}
		
		
		$("div#urejanje_utezi").show();
		scroll(0,0);
	});
	
	if(mode == "normal") {
		narisi_graf_default(id, ime);
	} else if(mode == "loading") {
		/***************************************/
		narisi_graf_default(id, ime);
		if(podatki[id]['type'] == "st") {
			podatki[id]['graph'].xAxis.categories = podatki[id]['st_par']['par'];
			podatki[id]['graph'].series[0].data = podatki[id]['st_par']['val'];
			
			var graf = new Highcharts.Chart(podatki[id]['graph']);
			
		} else if(podatki[id]['type'] == "lin") {
			
			var lin_max = podatki[id]['lin_max'];
			var lin_min = podatki[id]['lin_min'];
			
			var zaloga = [];
			var graf = [];
			
			for(var i=0; i<=10; i++) {
				var temp = Number(lin_min) + Number(i*(lin_max-lin_min)/10);
				zaloga.push(temp);
				graf.push(calculate_lin(id, temp));
			}
			//console.log(lin_min + " - " + lin_max + ",  k=" + k + ", n=" + n + " = " + zaloga);
			//console.log(id);
			podatki[id]['graph'].xAxis.categories = zaloga;
			podatki[id]['graph'].series[0].data = graf;
			
			var graf = new Highcharts.Chart(podatki[id]['graph']);
			
		} else if(podatki[id]['type'] == "lin") {
			
			var eks_max = podatki[id]['eks_max'];
			var eks_min = podatki[id]['eks_min'];
			var eks_n = podatki[id]['eks_n'];
			
			var zaloga = [];
			var graf = [];
			
			for(var i=0; i<=10; i++) {
				var temp = Number(eks_min) + Number(i*(eks_max-eks_min)/10);
				zaloga.push(temp);
				graf.push(calculate_eks(id, temp));
			}
			
			podatki[id]['graph'].xAxis.categories = zaloga;
			podatki[id]['graph'].series[0].data = graf;
			podatki[id]['graph'].chart.defaultSeriesType = 'spline';
			
			var graf = new Highcharts.Chart(podatki[id]['graph']);
			
		}
		/*****************************/
	}
}

function clear_functions() {
	//console.log("test");
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

function calculate(id, value) {
	if(podatki[id]['type'] == 'st') {
		return calculate_st(id, value);
	} else if(podatki[id]['type'] == 'lin') {
		return calculate_lin(id, value);
	} else if(podatki[id]['type'] == 'eks') {
		return calculate_eks(id, value);
	}
}

function calculate_st(id, value) {
	for(var itmp in podatki[id]['st_par']['par']) {
		if(podatki[id]['st_par']['par'][itmp] == value) {
			return podatki[id]['st_par']['val'][itmp];
		}
	}
	return 0;
}

function calculate_lin(id, value) {
	
	var lin_max = podatki[id]['lin_max'];
	var lin_min = podatki[id]['lin_min'];
	
	var k = 1/(lin_max-lin_min);
	var n = lin_min*k;
	
	return k*value-n;
}

function calculate_eks(id, value) {
	
	var eks_max = podatki[id]['eks_max'];
	var eks_min = podatki[id]['eks_min'];
	var eks_n = podatki[id]['eks_n'];
	
	var k = 1/Math.pow(eks_max-eks_min, eks_n);
	
	return k*Math.pow(value-eks_min, eks_n);
}