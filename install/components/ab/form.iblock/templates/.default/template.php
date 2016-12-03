<?php if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
/** @var array $arParams */
/** @var array $arResult */
/** @global CMain $APPLICATION */
/** @global CUser $USER */
/** @global CDatabase $DB */
/** @var CBitrixComponentTemplate $this */
/** @var string $templateName */
/** @var string $templateFile */
/** @var string $templateFolder */
/** @var string $componentPath */
/** @var CBitrixComponent $component */
$this->setFrameMode(true);
$this->addExternalCss($componentPath.'/vendor/sweetalert/sweetalert.css');
?>
<div class="container">
	<div class="row">
		<div id="ab_form_add" data-enc="<?=$arResult['ENC']?>">
			<div id="floatingBarsG">
				<div class="blockG" id="rotateG_01"></div>
				<div class="blockG" id="rotateG_02"></div>
				<div class="blockG" id="rotateG_03"></div>
				<div class="blockG" id="rotateG_04"></div>
				<div class="blockG" id="rotateG_05"></div>
				<div class="blockG" id="rotateG_06"></div>
				<div class="blockG" id="rotateG_07"></div>
				<div class="blockG" id="rotateG_08"></div>
			</div>
		</div>
		<div id="ab_items_wrap"></div>
	</div>
</div>
