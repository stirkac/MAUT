// JavaScript Document

/*
   Id = id starsa (u1, u1_1, u0... ali 0 če je na najvišji stopnji)
*/
function dodaj_utez(ime, parent, opis) { //id = parent

	var new_id = main_nodes;
	var generated_id = "u"+new_id;
	
	//var opis = "Tukaj je opis funkcije";
	
	data[generated_id] = [];
	data[generated_id]['ime'] = ime;
	data[generated_id]['opis'] = opis;
	data[generated_id]['tip'] = null;
	
	var append = "\
	<li id='u"+new_id+"'> \
		<div class='slider'></div> \
		<div class='item'> \
			<text>"+ime+"</text> \
			<span class='close'></span> \
			<span class='add'></span> \
			<span class='edit'></span> \
		</div> \
		<ul id='u"+new_id+"_l'></ul> \
	</li>";
	
	if(parent == 0) { //dodajamo na najvišjo stopnjo
	
		$("#main_list").append(append);
		//alert("#u"+main_nodes);
		handle_utez_item("u"+new_id);
		main_nodes++;
		
	} else { //dodajamo v spicificen element
		//alert(parent);
		var element_list = $("#"+parent+"_l");// #u1 ul
		if(element_list.length > 0) { //starš je najden....
			console.log(element_list.length);
			//element.append("<ul id='"+parent+"_l'><li id='"+parent+"_0'>"+ime+"</li></ul>");
			element_list.append(append);
			handle_utez_item("u"+new_id);
			//$("#"+parent+"_"+main_nodes[parent]).each(handle_utez_item);
			main_nodes++;
			
			
		} else {
			return -1; //napaka, ni najden element
		}
	}
	
	//generated_id
	create_function(generated_id, ime, opis, "normal");
	create_legend_item(generated_id, ime);
	add_to_existing_atr(generated_id);
	clear_functions();
}
		
function handle_utez_item(id) { //Nastavljanje vseh funkcionalnosi za novo nastalo funkcijo
			
	//alert(id);
	//$("#"+id).sortable({ delay: 100 });
	
	var parent_id = $("#"+id).parent().attr("id");
	$("#"+parent_id).sortable({
		delay: 100,
		connectWith: "ul",
		placeholder: "holder",
		update: clear_functions
	});
	
	//alert($("#"+id).children("div[class=slider]").length);
	
	$("#"+id).children("div[class=slider]").slider({
		range: 'min',
		value: 25,
		size: 10,
		create: drsnik,
		slide: drsnik,
		stop: drsnik
	});
	
	$("#"+id).children("div[class=item]").children("span[class=close]").click(function() {
		odstrani_utez($(this).parent().parent().attr("id"));
	});
	
	$("#"+id).children("div[class=item]").children("span[class=add]").click(function() {
		//alert($(this).parent().parent().attr("id"));
		dodaj_utez("brez imena", $(this).parent().parent().attr("id"));
	});
	
	$("#"+id).children("div[class=item]").children("span[class=edit]").click(function() {
		//console.log("editing: " + $(this).parent().attr("id"));
		var id = $(this).parent().parent().attr("id");
		uredi_utez = id;
		//console.log(id);
		//console.log(data[id]['ime']);
		$("#uredi_utez").attr("value", id);

		$("#utez_ime").attr("value", data[id]['ime']);
		$("#utez_opis").val(data[id]['opis']);
						
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
			
			$("#st").attr('checked', false);
			$("#lin").attr('checked', false);
			$("#eks").attr('checked', false);
			
		} else if(data[id]['type'] == 'st') {
			
			$("#st").attr('checked', true);
			
			$("#st_div").show();
			$("#lin_div").hide();
			$("#eks_div").hide();
			
			var i=0;
			$(".param").each(function() {
				if(data[id]['st_par']['par'][i] != null) {
					this.value = data[id]['st_par']['par'][i];
				}
				i++;
			});
			i=0;
			$(".val").each(function() {
				if(data[id]['st_par']['val'][i] != null) {
					this.value = data[id]['st_par']['val'][i];
				}
				i++;
			});
			
			
		} else if(data[id]['type'] == 'lin') {
			
			$("#lin").attr('checked', true);
			
			$("#st_div").hide();
			$("#lin_div").show();
			$("#eks_div").hide();
			
			$("#lin_min").val(data[id]['lin_min']);
			$("#lin_max").val(data[id]['lin_max']);
			
		} else if(data[id]['type'] == 'eks') {
			
			$("#eks").attr('checked', true);
			
			$("#st_div").hide();
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

function odstrani_utez(id) {
	remove_id = id;
	var elements = $("#"+remove_id+" li");
	//if(elements.length <= 1 || (elements.length > 1 && confirm("Are you sure you want to delete "+(elements.length+1)+" items?"))) {
		elements.each(function() {
			delete_utez(this.id);
		});
		delete_utez(remove_id);
		//$("#"+remove_id).remove();
	//}
	//$("div#"+remove_id).remove();
}

function delete_utez(id) {
	
	//console.log(id);
	$("div#al_"+id).remove(); //Izbrisemo iz legende alternativ
	$("div#alternative_div input[id*=_"+id+"]").remove(); //Izbrisemo iz alternativ
	$("div#"+id).remove(); //izbrisemo funkcijo koristnosti
	$("li#"+id).remove(); //izbrisemo utez
	
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
		
		//console.log("Together: " + val);
		
		var diff = val - 100; //nepravilna vrednost
		
		//console.log(sliders.not(this).length);
		sliders.not(this).each(function() {
			var tmp = $(this).slider("value");
			$(this).slider("value", (tmp - 2* tmp * (diff/val)) );
		});
}

function drsnik_vrednost(id) {
	return (Number($("#"+id+" > div.slider").slider("value"))/100);
}