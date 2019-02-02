function size(){
    var i = 1
    while(true){
        var tag = 'ptr' + i.toString()
        var dados = window.localStorage[tag]
        if(dados == null)
            return i
        i++
    }
}

function sizeh(){
    var i = 1
    while(true){
        var tag = 'hist' + i.toString()
        var dados = window.localStorage[tag]
        if(dados == null)
            return i
        i++
    }
}

function atualizar(){
    var b30 = ''
    var terreno = ''
    var b32 = ''
    var historico = ''
    var cont30 = 0
    var cont32 = 0
    var contter = 0
    var pend30 = 0
    var linhas = []
    var qtdptr = 0
    var qtdefe = 0
    for(var i = 1; i < size(); i++){
        var tag = 'ptr' + i.toString()
        var dados = window.localStorage[tag]
        if(dados != null){
            var patrulha = JSON.parse(dados)
            if(patrulha != null){
                var pronta = ''
                if(patrulha.pronta == '0'){
                    pronta = 'naopronta'
                    pend30++
                }
                else
                    pronta = 'pronta'

                if(patrulha.local != 'b1000'){
                    var saida = tempo_segundo(patrulha.saida)
                    var agora = tempo_segundo(hora_atual())
                    if(tempo_segundo(patrulha.saida) < tempo_segundo(patrulha.entrada)){
                        saida += 86400
                        if(saida > agora && agora < tempo_segundo(patrulha.entrada))
                            agora += 86400
                    }

                    if(agora >= tempo_segundo(patrulha.entrada) && agora <= saida){
                        qtdptr++
                        qtdefe = parseInt(qtdefe) + parseInt(patrulha.efetivo)
                    }

                    var achei = false
                    for(var j = 0; j < linhas.length; j++){
                        if(linhas[j].entrada == patrulha.entrada && linhas[j].saida == patrulha.saida){
                            achei = true
                            linhas[j].patrulhas = linhas[j].patrulhas + '/' + patrulha.numero
                            linhas[j].quantidade = parseInt(linhas[j].quantidade) + 1
                            linhas[j].efetivo = parseInt(linhas[j].efetivo) + parseInt(patrulha.efetivo)
                        }
                    }
                    if(achei == false){
                        var linha = {entrada: patrulha.entrada, saida: patrulha.saida, patrulhas: patrulha.numero, quantidade: '1', efetivo: patrulha.efetivo}
                        linhas.push(linha)
                    }
                }
                
                if(patrulha.local == 'b30'){
                    b30 += '<tr><td><button id="' + tag + '" class="btn-b7 btn btn-link"><</button></td><td><div class="celula regular ' + pronta + ' ">' + patrulha.numero + '</div></td><td class="timer"><div id="'+ patrulha.inicio +'" class="tempor"></div></td></tr>'
                    cont30++
                }
                else if(patrulha.local == 'terreno'){
                    terreno += '<tr><td><button id="' + tag + '" class="btn-b32 btn btn-link"><</button></td><td><div class="celula regular ' + pronta + ' ">' + patrulha.numero + '</div></td><td><button id="' + tag + '" class="btn-b30 btn btn-link">></button></td><td></td></tr>'
                    contter++
                }
                else if(patrulha.local == 'b32'){
                    b32 += '<tr><td class="timer"><div class="tempod" id="'+ patrulha.inicio +'"></div></td><td><div class="celula regular ' + pronta + ' ">' + patrulha.numero + '</div></td><td><button id="' + tag + '" class="btn-b7 btn btn-link">></button></td></tr>'
                    cont32++
                }
            }
        }
        else
            break
    }
    var cont = 1
    for(var i = sizeh() - 1; i > 0; i--){
        var tag = 'hist' + i.toString()
        var dados = window.localStorage[tag]
        if(dados != null){
            var hist = JSON.parse(dados)
            if(hist.local == 'b32')
                hist.local = 'BETA 32'
            else if(hist.local == 'b30')
                hist.local = 'BETA 30'
            historico = '<tr><td>' + hist.numero + '</td><td class="caixa-alta">' + hist.local + '</td><td>' + hist.entrada + '</td><td>' + hist.saida + '</td><td>' + hist.efetivo + '</td><td>' + hist.inicio + '</td></tr>'
            $('#thist').append(historico)
        }
        else
            break
    }
    var linha = ''
    for(var i = 0; i < linhas.length; i++){
        linha = '<tr><td>' + linhas[i].entrada + ' - ' + linhas[i].saida + '</td><td>' + linhas[i].patrulhas + '</td><td>' + linhas[i].quantidade + '</td><td>' + linhas[i].efetivo + '</td></tr>'
        $('#tdet').append(linha)
    }
    $('#qtdptr').text('Qtd. atual de Patrulhas: ' + qtdptr)
    $('#qtdefe').text('Efetivo atual: ' + qtdefe)
    $('#b30').html(b30)
    $('#terreno').html(terreno)
    $('#b32').html(b32)
    $('#historico').html(historico)
    $('#titb32').text(function(){
        return $(this).text() + ' (' + cont32 + ')'
    })
    $('#titb30').text(function(){
        return $(this).text() + ' (' + cont30 + ')/PEND. (' + pend30 + ')'
    })
    $('#titter').text(function(){
        return $(this).text() + ' (' + contter + ')'
    })
}

function update(tag, valor){
    var dados = window.localStorage[tag]
    var patrulha = JSON.parse(dados)
    var data = new Date()
    var horas = data.getHours()
    var numero = patrulha.numero
    if(horas < 10)
        horas = '0' + horas;
    var minutos = data.getMinutes()
    if(minutos < 10)
        minutos = '0' + minutos;
    var segundos = data.getSeconds()
    if(segundos < 10)
        segundos = '0' + segundos
    inicio = horas + ':' + minutos + ':' + segundos
    patrulha.local = valor
    if(valor == 'b30')
        patrulha.pronta = '1'
    patrulha.inicio = inicio
    window.localStorage[tag] = JSON.stringify(patrulha)
    //salvando historico
    var hist = {numero: numero, local: patrulha.local, inicio: inicio}
    var indice = 'hist' +  sizeh()
    window.localStorage[indice] = JSON.stringify(hist)
    window.location.reload()
}

function subtrair(hora_final, hora_inicial){
    var h_inicial = hora_inicial.substring(0,2)
    var m_inicial = hora_inicial.substring(3,5)
    var s_inicial = hora_inicial.substring(6,8)
    var h_final = hora_final.substring(0,2)
    var m_final = hora_final.substring(3,5)
    var s_final = hora_final.substring(6,8)
    var t_inicial = parseInt(h_inicial) * 3600 + parseInt(m_inicial) * 60 + parseInt(s_inicial)
    var t_final = parseInt(h_final * 3600) + parseInt(m_final * 60) + parseInt(s_final)
    var t_result = Math.abs(t_final - t_inicial)
    var hora = Math.trunc(t_result / 3600)
    var minuto = Math.trunc((t_result - (hora * 3600)) / 60)
    var segundo = (t_result % 3600) % 60            
    if(hora < 10)
        hora = '0' + hora
    if(minuto < 10)
        minuto = '0' + minuto
    if(segundo < 10)
        segundo = '0' + segundo
    return hora + ':' + minuto + ':' + segundo
}

function subtrair_rel(hora_final, hora_inicial){
    var h_inicial = hora_inicial.substring(0,2)
    var m_inicial = hora_inicial.substring(3,5)
    var s_inicial = hora_inicial.substring(6,8)
    var h_final = hora_final.substring(0,2)
    var m_final = hora_final.substring(3,5)
    var s_final = hora_final.substring(6,8)            
    var t_inicial = parseInt(h_inicial) * 3600 + parseInt(m_inicial) * 60 + parseInt(s_inicial)
    var t_final = parseInt(h_final * 3600) + parseInt(m_final * 60) + parseInt(s_final)
    if(parseInt(t_final) < parseInt(t_inicial))
        t_final = t_final + 86400
    var t_result = Math.abs(t_final - t_inicial)
    var hora = Math.trunc(t_result / 3600)
    var minuto = Math.trunc((t_result - (hora * 3600)) / 60)
    var segundo = (t_result % 3600) % 60            
    if(hora < 10)
        hora = '0' + hora
    if(minuto < 10)
        minuto = '0' + minuto
    if(segundo < 10)
        segundo = '0' + segundo
    return hora + ':' + minuto + ':' + segundo
}

function hora_atual(){
    var timestamp = new Date().getTime()
    var date = new Date(timestamp)
    var hora_atual = date.getHours()
    var min_atual = date.getMinutes()
    var seg_atual = date.getSeconds()
    if(parseInt(hora_atual) < 10)
        hora_atual = '0' + hora_atual
    if(parseInt(min_atual) < 10)
        min_atual = '0' + min_atual
    if(parseInt(seg_atual) < 10)
        seg_atual = '0' + seg_atual
    return hora_atual.toString() + ':' + min_atual.toString() + ':' + seg_atual.toString()
}

function temporizar(){
    var dados = window.localStorage['config']
    var config = JSON.parse(dados)
    var tempo32 = config.tempo32
    var tempo30 = config.tempo30
    $('.tempor').text(function(){
        var inicio = $(this).attr('id')
        if(tempo_segundo(subtrair(hora_atual(), inicio)) > 1800){
            if($(this).hasClass('atrasada')){
                $(this).removeClass('atrasada')
                $(this).addClass('pisca')
            }
            else{
                $(this).removeClass('pisca')
                $(this).addClass('atrasada')
            }
            return '-' + subtrair(tempo30, subtrair_rel(hora_atual(), inicio))
        }
        else
            return subtrair(tempo30, subtrair(hora_atual(), inicio))
    })
    $('.tempod').text(function(){
        var inicio = $(this).attr('id')
        if(tempo_segundo(subtrair(hora_atual(), inicio)) > 600){
            if($(this).hasClass('atrasada')){
                $(this).removeClass('atrasada')
                $(this).addClass('pisca')
            }
            else{
                $(this).removeClass('pisca')
                $(this).addClass('atrasada')
            }
            return '-' + subtrair(tempo32, subtrair_rel(hora_atual(), inicio))
        }
        else
            return subtrair(tempo32, subtrair(hora_atual(), inicio))
    })
}

function tempo_segundo(tempo){
    var hora = tempo.substring(0,2)
    var minuto = tempo.substring(3,5)
    var segundo = tempo.substring(6,8)
    var result = parseInt(hora) * 3600 + parseInt(minuto) * 60 + parseInt(segundo)
    return result
}

function achei(numero){
    for(var i = 1; i < size(); i++){
        var tag = 'ptr' + i.toString()
        var dados = window.localStorage[tag]
        var patrulha = JSON.parse(dados)
        if(patrulha.numero == numero && patrulha.local != 'b1000')
            return true
    }
    return false
}

$(document).ready(function(){
    atualizar()
    var dados = window.localStorage['config']
    if(dados != null){
        var config = JSON.parse(dados)
        $('#tempo32').val(config.tempo32)
        $('#tempo30').val(config.tempo30)
    }
    else{
        $('#tempo32').val('00:10:00')
        $('#tempo30').val('00:30:00')
        var config = {tempo32: '00:10:00', tempo30: '00:30:00'}
        window.localStorage['config'] = JSON.stringify(config)        
    }    
    
    setInterval("temporizar()", 700)
            
    //mascara numero de patrulha
    $("#ptr").bind('input propertychange',function(){        
        // pego o valor do telefone
        var texto = $(this).val();
        // Tiro tudo que não é numero
        texto = texto.replace(/[^\d]/g, '');        
        // Se tiver alguma coisa
        if (texto.length > 0){
            // Não adianta digitar mais digitos!
            if (texto.length > 4)
                texto = texto.substr(0,4);
        }
        // Retorna o texto
        $(this).val(texto);     
    })

    //mascara tempo
    $(".enttempo").bind('input propertychange',function(){        
        // pego o valor do tempo
        var texto = $(this).val();        
        // Tiro tudo que não é numero
        texto = texto.replace(/[^\d]/g, '');        
        // Se tiver alguma coisa
        if (texto.length > 0)
        {
            if (texto.length > 2)
                texto = [texto.slice(0, 2), ":", texto.slice(2)].join('');                        
            if (texto.length > 5)
                texto = [texto.slice(0, 5), ":", texto.slice(5)].join('');            
            // Não adianta digitar mais digitos!
            if (texto.length > 8)                
               texto = texto.substr(0,8);
        }        
        // Retorna o texto
        $(this).val(texto);     
    })

    $('#cadastrar').click(function(){
        var numero = $('#ptr').val()
        var entrada = $('#entrada').val()
        var saida = $('#saida').val()
        var efetivo = $('#efetivo').val()
        if(numero.length != 4 || entrada.length != 8 || saida.length != 8 || efetivo == ''){
            alert('Preencha corretamente todos os campos!')
            $('#ptr').val('')
            $('#entrada').val('')
            $('#saida').val('')
            $('#efetivo').val('')
            return
        }
        if(achei(numero)){
            alert('Patrulha já foi cadastrada anteriormente!')
            $('#ptr').val('')
            $('#entrada').val('')
            $('#saida').val('')
            $('#efetivo').val('')
            return
        }
        var local = 'terreno'
        var data = new Date()
        var horas = data.getHours()
        if(horas < 10)
            horas = '0' + horas;
        var minutos = data.getMinutes()
        if(minutos < 10)
            minutos = '0' + minutos;
        var segundos = data.getSeconds()
        if(segundos < 10)
            segundos = '0' + segundos
        inicio = horas + ':' + minutos + ':' + segundos
        pronta = '0'
        var ptr = {numero: numero, local: local, inicio: inicio, pronta: pronta, entrada: entrada, saida: saida, efetivo: efetivo}
        var indice = size()
        window.localStorage['ptr' + indice.toString()] = JSON.stringify(ptr)
        //salvando historico
        var hist = {numero: numero, local: local, inicio: inicio, pronta: pronta, entrada: entrada, saida: saida, efetivo: efetivo}
        var indice = sizeh()
        window.localStorage['hist' + indice.toString()] = JSON.stringify(hist)
        window.location.reload()
        $('#ptr').val('')
        $('#entrada').val('')
        $('#saida').val('')
        $('#efetivo').val('')
    })

    $('#remover').click(function(){
        var numero = $('#ptr').val()
        if(numero.length != 4){
            alert('Digite um número válido!')
            $('#ptr').val('')
            $('#entrada').val('')
            $('#saida').val('')
            $('#efetivo').val('')
            return
        }
        for(var i = 1; i < size(); i++){
            var tag = 'ptr' + i.toString()
            var dados = window.localStorage[tag]
            var patrulha = JSON.parse(dados)
            if(patrulha.numero == numero){
                patrulha.local = 'b1000'
                window.localStorage[tag] = JSON.stringify(patrulha)
                break
            }
        }
        $('#ptr').val('')
        $('#entrada').val('')
        $('#saida').val('')
        $('#efetivo').val('')
        window.location.reload()
    })

    $('#limpar').click(function(){
        localStorage.clear()
        $('#ptr').val('')
        $('#entrada').val('')
        $('#saida').val('')
        $('#efetivo').val('')
        window.location.reload()
    })

    $('.btn-b32').click(function(){
        var tag = $(this).attr('id')
        var valor = 'b32'
        update(tag, valor)
    })

    $('.btn-b7').click(function(){
        var tag = $(this).attr('id')
        var valor = 'terreno'
        update(tag, valor)
    })

    $('.btn-b30').click(function(){
        var tag = $(this).attr('id')
        var valor = 'b30'
        update(tag, valor)
    })

    $('#salvar').click(function(){        
        var tempo32 = $('#tempo32').val()
        var tempo30 = $('#tempo30').val()
        if(tempo32.length == 8 && tempo30.length == 8){
            var config = {tempo32: tempo32, tempo30: tempo30}
            window.localStorage['config'] = JSON.stringify(config)
            alert('Configurações salvas!')
        }
        else
            alert('Digite valores válidos! Ex.: 00:10:00')
    })
})