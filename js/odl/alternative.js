// Alternative

function dodaj_alternativo() {
	
	var alt_id = id_alternative;
	//var utezi_id = [];
	var append = "\
            <div id='a"+alt_id+"' class='alternativa'> \
                <span class='close'></span> \
            	<input type='text' value='-naziv-' class='alt_header' />";
	
	$("#tab3 > div").each(function() { //sklicujemo se na funkcije
		if($(this).css('display') !== 'none') {
			if(podatki[this.id]['type'] == 'st') {
				
				append += "<select class='alt_par_text' id='a"+alt_id+"_"+this.id+"' >";
				for(i in podatki[this.id]['st_par']['par']) {
					append += "<option>"+podatki[this.id]['st_par']['par'][i]+"</option>";
				}
				append += "</select>";
			} else {
				append += "<input type='text' id='a"+alt_id+"_"+this.id+"' value='-vnesite-' class='alt_par_text' />";
			}
		}
	});
	
	append += " \
		<div id='a"+alt_id+"_ocena' class='alt_par_ocena'></div> \
	</div>";
	
	$("div#alternative_div").append(append);
	
	$("div#a"+alt_id+" span.close").click(function() {
		$(this).parent().remove();
	});
	
	alt++;
	//console.log(alt);
}

function create_legend_item(id, ime) {
	var append = "<div class='alt_par_text' id='al_"+id+"'>"+ime+"</div>";
	$(".alternativa_legend div.alt_par_ocena").before(append);
}

function add_to_existing_atr(id) {
	$("div.alternativa div.alt_par_ocena").before(function() {
		return "<input type='text' id='"+$(this).parent().attr("id")+"_"+id+"' value='-vnesite-' class='alt_par_text' />";
	});
}

function izracunaj_oceno() {
	$("div.alternativa").each(function() {
		var alt_id = this.id;
		var ocena = 0;
		$("#main_list > li").each(function() {
			ocena += calc_ocena(this.id, alt_id);
		});
		$("#"+this.id+"_ocena").html(ocena);
	});
}

function calc_ocena(u_id, a_id) {
	//console.log(u_id+", "+a_id);
	
	if($("#"+u_id+"_l li").length > 0) { //ce obstaja vgnezden list - rekurzija
		var temp_oc = 0;
		$("#"+u_id+"_l > li").each(function() {
			temp_oc += calc_ocena(this.id, a_id);
		});
		return drsnik_vrednost(u_id) * temp_oc;
	} else {
		//console.log(drsnik_vrednost(u_id)+" - "+alternativa_vrednost(u_id, a_id));
		return drsnik_vrednost(u_id) * alternativa_vrednost(u_id, a_id);
	}
}

function alternativa_vrednost(u_id, a_id) {
	var value = $("#"+a_id+"_"+u_id).val();
	//console.log(value);
	return calculate(u_id, value);
}

