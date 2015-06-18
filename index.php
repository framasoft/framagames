<?php
require('data.php');

$tips = '<ul class="tips">';

foreach ($data as $k => $v) {

    $tips .= '
    <li>
        <div class="tip-content text-center ">
            <div class="front">
                <h3>'.$v['title'].'</h3>
                <p><img src="'.$v['img'].'" alt="" /></p>
            </div>
            <div class="back">
                <p class="description">'.$v['description'].'</p>
                <p class="play">
                    <a class="btn btn-primary" href="'.$v['url'].'" title="Jouer en ligne à '.$v['title'].'">
                        <i class="fa fa-fw fa-lg fa-gamepad"></i> Jouer
                    </a>
                    <a class="btn btn-success" href="'.$v['dl'].'" title="Télécharger '.$v['title'].' pour y jouer hors-connexion">
                        <i class="fa fa-fw fa-lg fa-download"></i> Télécharger
                    </a>
                </p>
                <p class="text-right credits">
                    <button  class="btn btn-sm btn-default" title="Infos à propos de '.$v['title'].'" rel="popover"
                        data-content="<p>Auteur : '.$v['auteur'].'<br/>Licence : '.$v['licence'].'<br/><a href=\''.$v['src'].'\'>Site officiel</a></p>">
                        <i class="fa fa-fw fa-lg fa-info-circle"></i> Crédits
                    </button>
                </p>
            </div>
        </div>
    </li>';
};

$tips .= '
</ul>';

?><!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"> 
    <title>Framagames</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
    <meta name="description" content="Une sélection de jeux libres pour jouer en ligne ou à télécharger sur son PC, sa tablette..." />
    <meta name="keywords" content="hjeux, games, HTML5,framasofrt, framagames" />
    <link rel="shortcut icon" href="/favicon.ico"> 
    <link href="/nav/lib/bootstrap/css/bootstrap.min.css" media="all" rel="stylesheet">
    <link href="/css/style.css" rel="stylesheet" type="text/css" />
    <script src="/nav/lib/jquery/jquery.min.js" type="text/javascript"></script>
    <script src="/nav/lib/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
    <script type="text/javascript">
        $(document).ready(function() {
            // Fix slide up on focus
            $('.tips .back a,.tips .back button').on('focus', function() {
                $('.tip-content').removeClass('show-back');
                $(this).parent().parent().parent('.tip-content').addClass('show-back');
            });
            $('.tips .back a,.tips .back button').on('focusout', function() {
                $('.tip-content').removeClass('show-back');
            });
            $('.credits button').each(function() {
                $(this).popover({
                    html: true,
                    trigger: 'click',
                    placement:'top'
                });
                $(this).removeAttr('title');
            });
        });
    </script>
</head>
<body data-spy="scroll" data-target=".nav-year">
    <script src="/nav/nav.js" type="text/javascript"></script>
    <div class="container ombre">
        <header class="header">
            <h1><span class="violet">Frama</span><span class="vert">games</span></h1>
            <p class="lead">Des jeux libres pour jouer en ligne ou déconnecté.</p>
            <hr class="trait" role="presentation" />
        </header>
        <main>
            <?php echo $tips; ?>
        </main>
    </div>
</body>
</html>

