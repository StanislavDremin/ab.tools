<?php require_once($_SERVER["DOCUMENT_ROOT"].'/bitrix/modules/main/include/prolog_before.php');
global $APPLICATION;
$APPLICATION->RestartBuffer();
$RestManager = new AB\Tools\Rest\Manager();

echo $RestManager->parseUrl()
	->init()
	->getResult();

exit;