// JavaScript Document


function generiraj_kodo() {
	var code = "";
	
	// - HEADER
	code += "###\r\n";
	code += "### jMAUT\r\n";
	code += "### Generirano: "+(new Date())+"\r\n";
	code += "###\r\n";
	code += "\r\n";
	code += "\r\n";
	
	// - CODE
	// -- PARAMS
	
	code += "# Parametri\r\n";
	$("#main_list li").each(function() {
		var id = this.id;
		var par_id = "";
		if($(this).parent().attr("id") == "main_list") {
			par_id = "0";
		} else {
			par_id = $(this).parent().attr("id");
		}
		
		if(data[id]['opis'] == null) {
			data[id]['opis'] = "";
		}
		
		if(data[id]['type'] == "st") {
			code += "utez="+id+";"+par_id+";"+data[id]['ime']+";"+data[id]['opis']+";"+data[id]['type']; // : ;par1; val1; par2; val2...)
			for(var i in data[id]['st_par']['par']) {
				code += ";"+data[id]['st_par']['par'][i]+";"+data[id]['st_par']['val'][i];
			}
			code += "\r\n";
		} else if(data[id]['type'] == "lin") {
			code += "utez="+id+";"+par_id+";"+data[id]['ime']+";"+data[id]['opis']+";"+data[id]['type']+";"+data[id]['lin_min']+";"+data[id]['lin_max']+"\r\n";
		} else if(data[id]['type'] == "eks") {
			code += "utez="+id+";"+par_id+";"+data[id]['ime']+";"+data[id]['opis']+";"+data[id]['type']+";"+data[id]['eks_min']+";"+data[id]['eks_max']+";"+data[id]['eks_n']+"\r\n";
		} else {
			code += "utez="+id+";"+par_id+";"+data[id]['ime']+";"+data[id]['opis']+";0\r\n";
		}
	});
	code += "\r\n";
	
	
	// -- ALTERNATIVES
	
	code += "# Alternative\r\n";
	$("div.alternativa").each(function() {
		var id = this.id;
		var naziv = $(this).children("input.alt_header").first().val();
		var alt_code = "alt="+id+";"+naziv;
		
		$(this).children("input.alt_par_text").each(function() {
			var tmp = this.id.split("_");
			alt_code += ";"+tmp[1]+";"+$(this).val();
		});
		alt_code += "\r\n";
		code += alt_code;
	});
	
	
	
	$("#clipboard_data").val(code);
	
}

function nalozi_datoteko() {
	pocisti_utezi();
	pocisti_alternative();
	
	var code = $("#clipboard_data").val();
	
	var lines = code.split("\n");
	for(var l in lines) {
		if(lines[l][0] != "#" && lines[l][0] != null) {
			var line = lines[l].split("=");
			if(line[0] == "utez") {
				//Dodamo Utez
				var utez = line[1].split(";");
				
				var id = utez[0];
				var utez_parent = utez[1];
				var utez_ime = utez[2];
				var utez_opis = utez[3];
			
				data[id] = [];
				
				data[id]['ime'] = utez_ime;
				data[id]['opis'] = utez_opis;
				
				var utez_tip = utez[4];
				data[id]['type'] = utez_tip;
				
				if(utez_tip == "st") {
					var st_par = [];
					st_par['par'] = [];
					st_par['val'] = [];
					var n = 0;
					
					for(var i=5; i<utez.length; i+=2) {
						st_par['par'][n] = utez[i];
						st_par['val'][n] = utez[(i+1)];
						n++;
					}
					
					data[id]['st_par'] = st_par;
					
				} else if(utez_tip == "lin") {
					var lin_min = utez[5];
					var lin_max = utez[6];
					
					data[id]['lin_min'] = lin_min;
					data[id]['lin_max'] = lin_max;
				} else if(utez_tip == "eks") {
					var eks_min = utez[5];
					var eks_max = utez[6];
					var eks_n = utez[7];
					
					data[id]['eks_min'] = eks_min;
					data[id]['eks_max'] = eks_max;
					data[id]['eks_n'] = eks_n;
				} else if(utez_tip == "0") {
					//nothing
				} else {
					alert("Napaka v nalozeni kodi!");
					return -1;
				}
				
				nalozi_utez(id, utez_parent);
				
			} else if (line[0] == "alt") {
				//Dodamo Alternativo
				
				var alternativa = line[1].split(";");
				
				var alt_id = alternativa[0];
				//var utezi_id = [];
				var append = "\
						<div id='a"+alt_id+"' class='alternativa'> \
							<span class='close'></span> \
							<input type='text' value='"+alternativa[1]+"' class='alt_header' />";

				var par = [];
				
				for(var i=2; i<alternativa.length; i+=2) {
					par[alternativa[i]] = alternativa[(i+1)];
				}
	
	$("#tab3 > div").each(function() { //sklicujemo se na funkcije
		if($(this).css('display') !== 'none') {
			if(data[this.id]['type'] == 'st') {
				
				append += "<select class='alt_par_text' id='a"+alt_id+"_"+this.id+"' >";
				for(i in data[this.id]['st_par']['par']) {
					var tmp_val = data[this.id]['st_par']['par'][i];
					if(par[this.id] == tmp_val) {
						append += "<option selected='selected'>"+tmp_val+"</option>";
					} else {
						append += "<option>"+tmp_val+"</option>";
					}
				}
				append += "</select>";
			} else {
				append += "<input type='text' id='a"+alt_id+"_"+this.id+"' value='"+par[this.id]+"' class='alt_par_text' />";
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
	
				
			} else {
				alert("Napaka v nalozeni kodi!");
				return -1;
			}
		}
	}
}

function pocisti_utezi() {
	$("#main_list > li").each(function() {
		odstrani_utez(this.id);
	});
}

function pocisti_alternative() {
	$("div.alternativa").each(function() {
		$(this).remove();
	});
}

function nalozi_utez(id, par) {
	
	var new_id = id;
	var generated_id = id;
	
	var ime = data[id]['ime'];
	var opis = data[id]['opis'];
	var parent = par;
	
	//var opis = "Tukaj je opis funkcije";
	
	var append = "\
	<li id='"+new_id+"'> \
		<div class='slider'></div> \
		<div class='item'> \
			<text>"+ime+"</text> \
			<span class='close'></span> \
			<span class='add'></span> \
			<span class='edit'></span> \
		</div> \
		<ul id='"+new_id+"_l'></ul> \
	</li>";
	
	if(parent == 0) { //dodajamo na najvišjo stopnjo
	
		$("#main_list").append(append);
		//alert("#u"+main_nodes);
		handle_utez_item(new_id);
		main_nodes++;
		
	} else { //dodajamo v spicificen element
		//alert(parent);
		var element_list = $("#"+parent);// #u1 ul
		if(element_list.length > 0) { //starš je najden....
			console.log(element_list.length);
			//element.append("<ul id='"+parent+"_l'><li id='"+parent+"_0'>"+ime+"</li></ul>");
			element_list.append(append);
			handle_utez_item(new_id);
			//$("#"+parent+"_"+main_nodes[parent]).each(handle_utez_item);
			main_nodes++;
			
			
		} else {
			console.log("Stars ni najden");
			return -1; //napaka, ni najden element
		}
	}
	
	//generated_id
	create_function(generated_id, ime, opis, "loading");
	create_legend_item(generated_id, ime);
	add_to_existing_atr(generated_id);
	clear_functions();
}

function load_alternativo() {
}