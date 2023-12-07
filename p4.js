class P4 
{

    constructor(selector, options)
    {
        this.colones = options.colonnes;
        this.lignes = options.lignes;
        this.J1color = options.J1color;
        this.J2color = options.J2color;
        this.selector = selector;

        this.grille();
        this.lastCell(this.lignes);
        this.play(this.lignes, this.colones, this.J1color, this.J2color);
        this.setColor(this.J1color, this.J2color);
        this.setSize(this.colones, this.lignes);
    }

    grille()
    {
        let jeu = $(this.selector);

        for(let line = 0; line < this.lignes; line++)
        {
            let divline = $('<div>').addClass('lignes');
            for(let column = 0; column < this.colones; column++)
            {
                    let divcolumn = $('<div>').addClass('cell').addClass('vide').attr('joueur', 0).attr('y', line).attr('x', column);
                    divline.append(divcolumn);
            }
            jeu.append(divline);
        }
    }

    lastCell(lignes)
    {
        let lastline = lignes-1;
        let LY = $(`[y=${lastline}]`);
        LY.addClass('last');
    }

    setColor(CP1, CP2)
    {
        $('#joueur1').css('color', CP1);
        $('#joueur2').css('color', CP2);
    }

    setSize(colones, lignes)
    {
        if(lignes > 6 || colones > 7)
        {
            $('.cell').css('width', '50px');
            $('.cell').css('height', '50px');
        }
        if(lignes > 10 || colones > 10)
        {
            $('.cell').css('width', '20px');
            $('.cell').css('height', '20px');
        }
    }

    play(lignes, colones, CP1, CP2)
    {
        StartPopup();

        let v1 = 0;
        let v2 = 0;

        $('.cell').mouseenter(function()
        {
            let getX = $(this).attr('x');
            let getLastX = $(`.last[x=${getX}]`);
            hovercell(getLastX, CP1, CP2);
        })
        $('.cell').mouseleave(function()
        {
            let getX = $(this).attr('x');
            let getLastX = $(`.last[x=${getX}]`);
            leavehovercell(getLastX);
        })

        $('.cell').click(function()
        {
            let lol = $('#animCell').remove();
            $('#annuler').attr('disabled', false);
            $('#annuler').css('background', 'rgba(27, 27, 194, 0.541)');
            let a = 0;
            let getX = $(this).attr('x');
            let getLastX = $(`.last[x=${getX}]`);
            let topCellX = $(`[y=${a}][x=${getX}]`);
            let lastX = getLastX.attr('x');        
            let lastY = getLastX.attr('y');
            let currentPlayer = $('#currentPlayer').attr('joueur');
            let lastYint = parseInt(lastY);
            let lastXint = parseInt(lastX);

            if(typeof(getLastX.attr('y')) !== 'undefined')
            {
                $('#error').text('');
                animeCell(topCellX, getLastX, lastX, lastY, lastYint, lastXint, currentPlayer, CP1, CP2, lignes, colones);
            }
            else
            {
                $('#error').text('COLONNE PLEINE !!!').css('color', 'red');
            }

        })

        $("#validwin").click(function()
        {
            hidePopup(lignes);
        })

        $("#validnull").click(function()
        {
            hideNullScreen(lignes);
        })

        $('#startGame').click(function()
        {
            hinewLastXtartScreen();
            playerName();
        })

        $('#restart').click(function() 
        {
            location.reload();
        });

        $('#annuler').click(function()
        {
            annulTurn();
        })

        function playerName()
        {
            let P1name = $('#P1name').val();
            let P2name = $('#P2name').val();

            if(P1name == "")
            {
                P1name = "Joueur 1";
            }
            if(P2name == "")
            {
                P2name = "Joueur 2";
            }
    
            $('#joueur1').text(P1name);
            $("#joueur1").attr('name', P1name);
            $('#joueur2').text(P2name);
            $('#joueur2').attr('name', P2name);
            $('#currentPlayer').attr('joueur', 1);
            $('#currentPlayer').text('Tour de ' + P1name);
        }

        function animeCell(primecell, lastCell, lastX, lastY, lastYint, lastXint, currentPlayer, CP1, CP2, lignes, colones)
        {
            let posX = primecell.offset().left;
            let posY = primecell.offset().top;
            let newLastXtY = lastCell.offset().top;
            let travel = newLastXtY - posY + 236;
            let moveingcell = $('<div>').attr('id', 'animCell');

            moveingcell.css('top', posY - 75);
            moveingcell.css('left', posX);
            $('#game').append(moveingcell);

            if(lignes > 6 || colones > 7)
            {
                $('#animCell').css('width', '50px');
                $('#animCell').css('height', '50px');
            }
            if(lignes > 10 || colones > 10)
            {
                $('#animCell').css('width', '20px');
                $('#animCell').css('height', '20px');
            }

            if($('#currentPlayer').attr('joueur') == 1)
            {
                $('#animCell').css('background', CP1);
            }
            else
            {
                if($('#currentPlayer').attr('joueur') == 2)
                {
                    $("#animCell").css('background', CP2);
                }
            }
            $('#animCell').animate({top: travel});
            $('#animCell').delay(200).queue(function() 
            {
                $(this).remove();
                atribCell(lastCell, CP1, CP2);
                setNextTurn(lastCell);
                checkWin(lastX, lastY, lastYint, lastXint, currentPlayer);
                checknull();
                changePlayer();
            })
            return true;
            
        }
        
        function atribCell(cell, CP1, CP2)
        {
            if($('#currentPlayer').attr('joueur') == 1)
            {
                cell.attr('joueur', 1);
                cell.css('background', CP1);
                cell.removeClass('vide');
            }
            else
            {
                if($('#currentPlayer').attr('joueur') == 2)
                {
                    cell.attr('joueur', 2);
                    cell.css('background', CP2);
                    cell.removeClass('vide');
                }
            }
        }

        function annulTurn()
        {
            let last = $(".lastplayed");
            last.attr("joueur", 0);
            last.css('background', 'rgb(223, 223, 204)');
            last.addClass('vide');
            let ANNlastX = last.attr('x');
            let ANNlastXcol = $(`.last[x=${ANNlastX}]`);
            ANNlastXcol.removeClass('last');
            last.addClass('last');
            $('#annuler').attr('disabled', true);
            $('#annuler').css('background', 'grey');
            changePlayer();
        }

        function hovercell(cell, CP1, CP2)
        {
            if($('#currentPlayer').attr('joueur') == 1)
            {
                cell.css('background', CP1);
            }
            else
            {
                if($('#currentPlayer').attr('joueur') == 2)
                {
                    cell.css('background', CP2);
                }
            }

        }

        function leavehovercell(cell)
        {
                cell.css('background', 'rgb(223, 223, 204)');
        }

        function setNextTurn(cell)
        {
            $(".cell").removeClass('lastplayed');
            cell.removeClass('last');
            cell.addClass('lastplayed');
            let newLastY = cell.attr('y') -1;
            let newLastX = cell.attr('x');
            let newlastcord = $(`[y=${newLastY}][x=${newLastX}]`);
            newlastcord.addClass('last');
        }

        function checkWin(lastX, lastY, lastYint, lastXint, currentPlayer)
        {
            let cline = checkline(lastY, currentPlayer);
            let ccol = checkCol(lastX, currentPlayer);
            let cdiag = checkDiag(lastYint, lastXint, currentPlayer);
            let cadiag = checkAntiDiag(lastYint, lastXint, currentPlayer);

            if(cline == true || ccol == true || cdiag == true || cadiag == true)
            {
                showPopup();
                atribScore();
            }
        }            
            
        function checkline(lastY, currentPlayer)
        {
            let countline = 0;

            for (let i = 0; i < colones; i++)
            {
                let coordCheck = $(`.cell[y=${lastY}][x=${i}]`).attr('joueur');
                if(coordCheck == currentPlayer)
                {
                    countline++;
                    if(countline >= 4)
                    {
                        return true;
                    }    
                }
                else 
                {
                    countline = 0;
                }
            }
        }

        function checkCol(lastX, currentPlayer)
        {
            let countcol = 0;

            for (let e = 0; e < lignes; e++)
            {
                let coordCheck = $(`.cell[y=${e}][x=${lastX}]`).attr('joueur');
                if(coordCheck == currentPlayer)
                {
                    countcol++;
                    if(countcol >= 4)
                    {
                        return true;
                    }    
                }
                else 
                {
                    countcol = 0;
                }
            }
        }

        function checkDiag(lastYint, lastXint, currentPlayer)
        {
            let countdiag = 0;

            for (let j = 0; j < colones; j++)
            {
                let movedown = lastYint + j;
                let moveup = lastYint - j;
                let moveright = lastXint + j;
                let moveleft = lastXint -j;
                let coordCheck = $(`.cell[y=${moveup}][x=${moveright}]`).attr('joueur');
                let coordCheck2 = $(`.cell[y=${movedown}][x=${moveleft}]`).attr('joueur');
    
                if((coordCheck == currentPlayer) || (coordCheck2 == currentPlayer)) 
                {
                    countdiag++;

                    if(countdiag >= 4)
                    {
                        return true;
                    }    
                }
                else 
                {
                    countdiag = 0;
                }
            }    
        }
    
        function checkAntiDiag(lastYint, lastXint, currentPlayer)
        {
            let countadiag = 0;

            for (let j = 0; j < colones; j++)
            {
                let movedown = lastYint + j;
                let moveup = lastYint - j;
                let moveright = lastXint + j;
                let moveleft = lastXint -j;
                let coordCheck3 = $(`.cell[y=${movedown}][x=${moveright}]`).attr('joueur');
                let coordCheck4 = $(`.cell[y=${moveup}][x=${moveleft}]`).attr('joueur');
    
                if ((coordCheck3 == currentPlayer) || (coordCheck4 == currentPlayer))
                {
                    countadiag++;
                    if(countadiag >= 4)
                    {
                        return true;
                    }    
                }
                else 
                {
                    countadiag = 0;
                }                        
            }
        }
            
        function atribScore()
        {
            if($('#currentPlayer').attr('joueur') == 1)
            {
                v1++;
                $("#score1").text(v1);
            }
            else
            {
                if($('#currentPlayer').attr('joueur') == 2);
                {
                    v2++;
                    $("#score2").text(v2);
                }
            }
        }
            
        function checknull()
        {
            let nullcheck = $('.cell');
            if(nullcheck.hasClass('vide'))
            {
            }
            else 
            {
                nullPopup();
            }
        }

        function changePlayer()
        {
            let P1name = $('#joueur1').attr('name');
            let P2name = $('#joueur2').attr('name');
            
            if($('#currentPlayer').attr('joueur') == 1)
            {
                $('#currentPlayer').attr('joueur', 2);
                $('#currentPlayer').text('Tour de ' + P2name);
                $('#currentPlayer').attr('name', P2name);
            }
            else
            {
                if($('#currentPlayer').attr('joueur') == 2)
                {
                    $('#currentPlayer').attr('joueur', 1);
                    $('#currentPlayer').text('Tour de ' + P1name);
                    $('#currentPlayer').attr('name', P1name);
                }
            }    
        }

        function showPopup() 
        {
            $("#customPopup").before('<div id="grayBack"></div>');
            let attPlayerName = $("#currentPlayer").attr('name');
            $('#VicPlayer').text(attPlayerName + ' a gagné');
            $("#grayBack").css('opacity', 0).fadeTo(300, 0.5, function () { $("#customPopup").fadeIn(500); });
        }

        function StartPopup() 
        {
            $("#StartScreen").before('<div id="grayBack"></div>');
            $("#grayBack").css('opacity', 0).fadeTo(300, 0.5, function () { $("#StartScreen").fadeIn(500); });
        }

        function nullPopup() 
        {
            $("#nullPopup").before('<div id="grayBack"></div>');
            $("#grayBack").css('opacity', 0).fadeTo(300, 0.5, function () { $("#nullPopup").fadeIn(500); });
        }
            
        function hidePopup(lignes) 
        {
            $("#grayBack").fadeOut('fast', function () { $(this).remove() });
            $("#customPopup").fadeOut('fast', function () { $(this).hide() });
            $('.cell').attr('Joueur', 0);
            $('.cell').css('background', 'rgb(223, 223, 204)');
            $('.cell').removeClass('last');
            let lastline = lignes-1;
            let LY = $(`[y=${lastline}]`);
            LY.addClass('last');
            $('.cell').addClass('vide');
        }

        function hinewLastXtartScreen() 
        {
            $("#grayBack").fadeOut('fast', function () { $(this).remove() });
            $("#StartScreen").fadeOut('fast', function () { $(this).hide() });
        }

        function hideNullScreen(lignes) 
        {
            $("#grayBack").fadeOut('fast', function () { $(this).remove() });
            $("#nullPopup").fadeOut('fast', function () { $(this).hide() });
            $('.cell').attr('Joueur', 0);
            $('.cell').css('background', 'rgb(223, 223, 204)');
            $('.cell').removeClass('last');
            let lastline = lignes-1;
            let LY = $(`[y=${lastline}]`);
            LY.addClass('last');
            $('.cell').addClass('vide');
        }
    }
}