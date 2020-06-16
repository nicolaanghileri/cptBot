<?php
    $mailto = $_POST['email'];
    $mailSub = "Login" ;
    $mailMsg = "Ciao inserisci questa chiave nel login di Discord";
    require 'C:/xampp/htdocs/loginPage/PHPMailer-master/PHPMailerAutoload.php';

    $mail = new PHPMailer();
    $mail ->IsSmtp();
    $mail ->SMTPDebug = 0;
    $mail ->SMTPAuth = true;
    $mail ->SMTPSecure = 'ssl';
    $mail ->Host = "smtp.gmail.com";
    $mail ->Port = 456; // or 587
    $mail ->IsHTML(true);
    $mail ->Username = "cptbotsamt@gmail.com";
    $mail ->Password = "Abc123!#";
    $mail ->SetFrom("cptbotsamt@gmail.com");
    $mail ->Subject = $mailSub;
    $mail ->Body = $mailMsg;
    $mail ->AddAddress($mailto);

    if(!$mail->Send())
    {
        echo "Mail Not Sent";
    }
    else
    {
        echo "Mail Sent";
    }
?>



   

