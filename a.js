$(document).ready(function(){
    $('#btn').click(function() {
        $.ajax({
            type: "GET" ,
            url: "files/alunos.xml" ,
            dataType: "xml" ,
            success: function(xml) {
            var flag = true;
            $("#hidVal").text($("#fname").val());
                $(xml).find("ALUNO").each(function(){
                    if ($("#fname").val() == $(this).find('MATR_ALUNO').text()){
                        flag = false;
                        var code = $(this).find('COD_ATIV_CURRIC').text();
                        var status = $(this).find('SIGLA').text();
                        if(status == "Aprovado" || status == "Equivale"){
                            $('#'+code).css("color", "green");
                        }
                        else{
                            $('#'+code).css("color", "red");
                        }
                    }
                });
                if(flag){
                    $("td").css("color", "black");
                    alert("Aluno com o RA: "+$("#fname").val()+" não foi encontrado!");
                } 
            }       
        });
    });
});

$('td').mousedown(function(event) {
    switch (event.which) {
        case 1:
            var id = ($(this).attr('id'));
            togglePopup();
            $.ajax({
                type: "GET" ,
                url: "files/alunos.xml" ,
                dataType: "xml" ,
                success: function(xml) {
                    $("#description").text("");
                    var flag = true;
                    $(xml).find('ALUNO').each(function(){
                        if ($("#hidVal").text() == $(this).find('MATR_ALUNO').text()){
                            var code = $(this).find('COD_ATIV_CURRIC').text();
                            var materia = $(this).find('NOME_ATIV_CURRIC').text();
                            var ano = $(this).find('ANO').text();
                            var periodo = $(this).find('PERIODO').text();
                            var nota = $(this).find('MEDIA_FINAL').text();
                            var frequencia = $(this).find('FREQUENCIA').text();
                            if(code == id){
                                flag = false;
                                $("#description").text("");
                                $("#description").append(code+" - "+materia);
                                $("#description").append("</br>Última vez cursada:"+ano+"/"+periodo);
                                $("#description").append("</br>Nota: "+nota+"</br>Frequencia:"+frequencia+"%");
                            }
                        }
                    });
                    if(flag){
                        $("#description").append(id+" não foi cursada!");
                    } 
                }
            });
            
        break;
        case 3:
            var id = ($(this).attr('id'));
            togglePopup();
            $.ajax({
                type: "GET" ,
                url: "files/alunos.xml" ,
                dataType: "xml" ,
                success: function(xml) {
                    $("#description").text("");
                    $(xml).find("ALUNO").each(function(){
                        if ($("#hidVal").text() == $(this).find('MATR_ALUNO').text()){
                            var code = $(this).find('COD_ATIV_CURRIC').text();
                            var ano = $(this).find('ANO').text();
                            var periodo = $(this).find('PERIODO').text();
                            var nota = $(this).find('MEDIA_FINAL').text();
                            var frequencia = $(this).find('FREQUENCIA').text();
                            if(code == id){
                                $("#description").append("</br> Nota:"+nota);
                                $("#description").append(", frequencia:"+frequencia+"%");
                                $("#description").append(", em:"+ano+"/"+periodo);
                            }
                        }
                    });
                }
            });
        break;
        
    }
});

function togglePopup() {
    $(".content").toggle();
}