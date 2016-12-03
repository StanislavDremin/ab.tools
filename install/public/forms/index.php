<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Обратная связь");
?>

<?$APPLICATION->IncludeComponent('ab:form.iblock', '', array(), false)?>

<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>